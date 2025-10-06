import AsyncStorage from "@react-native-async-storage/async-storage";
import { Player } from "../types/golf";

const FIREBASE_API_KEY = "AIzaSyDGolfTournamentAppExample"; // User will need to provide their own
const FIREBASE_PROJECT_ID = "johnsons-live";
const FIREBASE_DATABASE_URL = `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`;

// Store auth token locally
const AUTH_TOKEN_KEY = "@johnsons_live_auth_token";
const USER_ID_KEY = "@johnsons_live_user_id";

interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

interface FirebaseError {
  error: {
    code: number;
    message: string;
    errors: Array<{
      message: string;
      domain: string;
      reason: string;
    }>;
  };
}

export class FirebaseService {
  private static authToken: string | null = null;
  private static userId: string | null = null;

  // Initialize by loading saved auth
  static async initialize() {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userId = await AsyncStorage.getItem(USER_ID_KEY);
      if (token && userId) {
        this.authToken = token;
        this.userId = userId;
      }
    } catch (error) {
      console.error("Error initializing Firebase:", error);
    }
  }

  // Sign up with email and password
  static async signUp(email: string, password: string, fullName: string, handicap: number): Promise<Player> {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const data: AuthResponse | FirebaseError = await response.json();

      if (!response.ok) {
        const error = data as FirebaseError;
        throw new Error(error.error.message || "Sign up failed");
      }

      const authData = data as AuthResponse;
      
      // Save auth token
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, authData.idToken);
      await AsyncStorage.setItem(USER_ID_KEY, authData.localId);
      this.authToken = authData.idToken;
      this.userId = authData.localId;

      // Create player profile in database
      const player: Player = {
        uid: authData.localId,
        fullName,
        email,
        handicap,
        emailVerified: false,
        createdAt: new Date().toISOString(),
      };

      await this.setDatabaseValue(`/players/${authData.localId}`, player);

      // Send verification email
      await this.sendVerificationEmail();

      return player;
    } catch (error: any) {
      throw new Error(error.message || "Sign up failed");
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<Player> {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );

      const data: AuthResponse | FirebaseError = await response.json();

      if (!response.ok) {
        const error = data as FirebaseError;
        throw new Error(error.error.message || "Sign in failed");
      }

      const authData = data as AuthResponse;

      // Save auth token
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, authData.idToken);
      await AsyncStorage.setItem(USER_ID_KEY, authData.localId);
      this.authToken = authData.idToken;
      this.userId = authData.localId;

      // Get player profile
      const player = await this.getDatabaseValue<Player>(`/players/${authData.localId}`);
      
      if (!player) {
        throw new Error("Player profile not found");
      }

      // Check email verification status
      const userInfo = await this.getUserInfo();
      player.emailVerified = userInfo.emailVerified;

      return player;
    } catch (error: any) {
      throw new Error(error.message || "Sign in failed");
    }
  }

  // Sign out
  static async signOut() {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_ID_KEY);
    this.authToken = null;
    this.userId = null;
  }

  // Send email verification
  static async sendVerificationEmail() {
    if (!this.authToken) throw new Error("Not authenticated");

    try {
      await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: this.authToken,
          }),
        }
      );
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  }

  // Get user info (including email verification status)
  static async getUserInfo(): Promise<{ emailVerified: boolean; email: string }> {
    if (!this.authToken) throw new Error("Not authenticated");

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken: this.authToken,
          }),
        }
      );

      const data = await response.json();
      const user = data.users[0];
      
      return {
        emailVerified: user.emailVerified || false,
        email: user.email,
      };
    } catch (error) {
      return { emailVerified: false, email: "" };
    }
  }

  // Get current user ID
  static getCurrentUserId(): string | null {
    return this.userId;
  }

  // Get current auth token
  static getAuthToken(): string | null {
    return this.authToken;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.authToken && !!this.userId;
  }

  // Database operations
  static async getDatabaseValue<T>(path: string): Promise<T | null> {
    try {
      const response = await fetch(`${FIREBASE_DATABASE_URL}${path}.json`);
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error("Error getting database value:", error);
      return null;
    }
  }

  static async setDatabaseValue(path: string, value: any): Promise<void> {
    try {
      await fetch(`${FIREBASE_DATABASE_URL}${path}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
    } catch (error) {
      console.error("Error setting database value:", error);
      throw error;
    }
  }

  static async pushDatabaseValue(path: string, value: any): Promise<string> {
    try {
      const response = await fetch(`${FIREBASE_DATABASE_URL}${path}.json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const data = await response.json();
      return data.name; // Firebase returns the generated key
    } catch (error) {
      console.error("Error pushing database value:", error);
      throw error;
    }
  }

  static async deleteDatabaseValue(path: string): Promise<void> {
    try {
      await fetch(`${FIREBASE_DATABASE_URL}${path}.json`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting database value:", error);
      throw error;
    }
  }

  // Listen to database changes (polling implementation)
  static subscribeToDatabasePath<T>(
    path: string,
    callback: (data: T | null) => void,
    intervalMs: number = 3000
  ): () => void {
    let isActive = true;

    const poll = async () => {
      while (isActive) {
        try {
          const data = await this.getDatabaseValue<T>(path);
          callback(data);
        } catch (error) {
          console.error("Error polling database:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
      }
    };

    poll();

    return () => {
      isActive = false;
    };
  }
}
