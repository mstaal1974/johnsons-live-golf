# 🔥 Firebase Setup - Step by Step

## Overview
The Johnsons Live app uses Firebase for authentication and real-time data storage. This guide will help you set it up in under 10 minutes.

---

## 🎯 What You Need Firebase For

1. **User Authentication** - Sign up, login, email verification
2. **Player Profiles** - Store player data (name, email, handicap)
3. **Real-time Database** - Scores, teams, chat messages
4. **Email Verification** - Automatic verification emails

---

## 📋 Step-by-Step Setup

### Step 1: Create Firebase Project (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `johnsons-live` (or your choice)
4. Click **Continue**
5. Disable Google Analytics (optional, recommended for simplicity)
6. Click **Create project**
7. Wait for project creation (30 seconds)
8. Click **Continue**

---

### Step 2: Enable Authentication (2 minutes)

1. In the left sidebar, click **Build** → **Authentication**
2. Click **Get started**
3. You'll see a list of sign-in methods
4. Click on **Email/Password**
5. Toggle **Enable** to ON
6. Click **Save**

**What this does:**
- Allows users to sign up with email and password
- Enables Firebase to send verification emails
- Provides secure user management

---

### Step 3: Enable Realtime Database (2 minutes)

1. In the left sidebar, click **Build** → **Realtime Database**
2. Click **Create Database**
3. Choose database location:
   - Select the region closest to your users
   - US: `us-central1`
   - Europe: `europe-west1`
   - Asia: `asia-southeast1`
4. Click **Next**
5. Choose **Start in test mode** (for development)
6. Click **Enable**

**Important for Production:**
After testing, update database rules to:
```json
{
  "rules": {
    "players": {
      "$uid": {
        ".read": true,
        ".write": "$uid === auth.uid"
      }
    },
    "chat": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "scores": {
      ".read": true,
      ".write": "auth != null"
    },
    "teams": {
      ".read": true,
      ".write": "auth != null"
    },
    "tournaments": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

---

### Step 4: Get Your Credentials (3 minutes)

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Click **Project settings**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (</>)
5. Enter app nickname: `johnsons-live-mobile`
6. **DO NOT** check "Firebase Hosting" (we don't need it)
7. Click **Register app**
8. You'll see configuration like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyABC123...",        // ← Copy this
  authDomain: "...",
  databaseURL: "https://johnsons-live-default-rtdb.firebaseio.com",
  projectId: "johnsons-live",       // ← Copy this
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

9. Copy the **`apiKey`** and **`projectId`**

---

### Step 5: Update Your App (1 minute)

1. Open the file: `/src/api/firebase.ts`
2. Find these lines near the top:

```typescript
const FIREBASE_API_KEY = "AIzaSyDGolfTournamentAppExample";
const FIREBASE_PROJECT_ID = "johnsons-live";
```

3. Replace with YOUR values:

```typescript
const FIREBASE_API_KEY = "AIzaSyABC123..."; // Your actual API key
const FIREBASE_PROJECT_ID = "your-project-id"; // Your actual project ID
```

4. Save the file

---

## ✅ Verification

### Test Authentication
1. Run the app: `bun start`
2. Try to sign up with a test account
3. If successful, you'll see the main app
4. Check your email for verification

### Test Database
1. Create a tournament (Admin tab)
2. Go to Firebase Console → Realtime Database
3. You should see data appearing under `/tournaments`

---

## 🔍 Database Structure

Your Firebase database will look like this:

```
johnsons-live-default-rtdb/
├── players/
│   ├── userId1/
│   │   ├── uid: "userId1"
│   │   ├── fullName: "John Smith"
│   │   ├── email: "john@example.com"
│   │   ├── handicap: 12
│   │   └── emailVerified: true
│   └── userId2/
│       └── ...
├── tournaments/
│   └── tournament-123456/
│       ├── name: "Spring Classic 2025"
│       ├── gameMode: "Individual"
│       └── days: [...]
├── scores/
│   └── ...
├── teams/
│   └── ...
└── chat/
    ├── msg-123456/
    │   ├── senderId: "userId1"
    │   ├── senderName: "John Smith"
    │   ├── message: "Great round!"
    │   └── timestamp: "2025-01-15T..."
    └── ...
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Sign up failed"
**Cause:** Firebase Authentication not enabled
**Solution:**
1. Go to Firebase Console → Authentication
2. Make sure Email/Password is enabled (toggle is green)
3. Try again

### Issue 2: "Database write failed"
**Cause:** Database rules too restrictive
**Solution:**
1. Go to Firebase Console → Realtime Database → Rules
2. For testing, use test mode rules (shown above)
3. Publish rules
4. Try again

### Issue 3: "API key is invalid"
**Cause:** Wrong API key in firebase.ts
**Solution:**
1. Double-check you copied the correct `apiKey` from Firebase Console
2. Make sure no extra spaces or quotes
3. Restart the app

### Issue 4: "Project not found"
**Cause:** Wrong project ID
**Solution:**
1. Check `projectId` in Firebase Console → Project Settings
2. Update `FIREBASE_PROJECT_ID` in firebase.ts
3. Make sure it matches exactly

### Issue 5: Email verification not received
**Cause:** Firebase email service delay or spam folder
**Solution:**
1. Check spam/junk folder
2. Wait a few minutes (can be slow in development)
3. Or continue without verification (app still works)

---

## 💰 Firebase Pricing

### Free Tier (Spark Plan)
**Included for free:**
- ✅ 50,000 reads/day (database)
- ✅ 20,000 writes/day (database)
- ✅ 10 GB storage
- ✅ Unlimited authentication

**Perfect for:**
- Small tournaments (under 50 players)
- Testing and development
- Personal use

### If You Need More
- **Blaze Plan** (Pay as you go)
- Only pay for what you use
- Still very affordable for most tournaments
- First 50k reads are free even on paid plan

**For a typical golf tournament:**
- 20 players
- 18-hole round
- All scoring + chat + leaderboard
- **Cost: ~$0.01** (one penny!)

---

## 🔒 Security Best Practices

### For Production Use:

1. **Update Database Rules** (see Step 3 above)
2. **Change Super Admin Password** (in `/src/screens/MainApp.tsx`)
3. **Add Password Requirements** (minimum length, etc.)
4. **Enable Email Verification Requirement** (optional)
5. **Set up Firebase Quotas** (to prevent abuse)

### Optional: Environment Variables
Instead of hardcoding API key in firebase.ts, you can use `.env`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

Then in firebase.ts:
```typescript
const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "";
const FIREBASE_PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "";
```

---

## 📱 Testing Checklist

After setup, test these features:

- [ ] Sign up with a new account
- [ ] Receive verification email
- [ ] Log in with created account
- [ ] Log out and log back in
- [ ] Create a tournament (as super admin)
- [ ] Enter scores
- [ ] View leaderboard
- [ ] Send chat messages
- [ ] Create teams
- [ ] View profiles

If all work, you're good to go! 🎉

---

## 🆘 Need Help?

1. **Firebase Documentation:** [firebase.google.com/docs](https://firebase.google.com/docs)
2. **Check Console Logs:** Look for error messages in Expo dev tools
3. **Firebase Console Status:** Make sure Authentication and Database show as active
4. **Test with Multiple Accounts:** Sign up 2-3 test users to verify everything works

---

## ✨ You're Done!

Firebase is now configured for your golf tournament app!

**Next:** Go create your first tournament and invite players! 🏌️‍♂️

---

**Estimated Total Time:** 10 minutes  
**Cost for Testing:** $0 (Free tier)  
**Difficulty:** Easy ⭐⭐☆☆☆
