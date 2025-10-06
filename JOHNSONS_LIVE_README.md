# Johnsons Live - Golf Tournament App 🏌️‍♂️

A comprehensive real-time golf tournament scoring application built with React Native and Expo.

## Features ✨

- **User Authentication** - Secure Firebase-based authentication with email verification
- **Multiple Game Modes** - Individual and Ambrose (team) tournament formats
- **Live Scoring** - Real-time scorecard with hole-by-hole entry
- **Intelligent Scoring** - Automatic Stableford points calculation with handicap support
- **Leaderboard** - Dynamic leaderboard with Gross/Stableford toggle
- **Team Management** - Create and manage teams with automatic team handicap calculation
- **Course Management** - Pre-loaded with famous courses (Pebble Beach, Augusta National, St Andrews)
- **Live Chat** - Real-time messaging between tournament participants
- **Admin Dashboard** - Tournament configuration and management
- **AI Summaries** - Generate tournament summaries using OpenAI
- **Celebration Alerts** - Special notifications for birdies, eagles, and better scores

## Quick Start 🚀

### Prerequisites
- Node.js 18+ or Bun
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Firebase account

### Installation

1. **Clone and install dependencies:**
   ```bash
   bun install
   # or npm install
   ```

2. **Set up Firebase:**
   
   a. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   
   b. Enable **Firebase Authentication** (Email/Password provider)
   
   c. Enable **Firebase Realtime Database**
   
   d. Update `/src/api/firebase.ts` with your Firebase credentials:
   ```typescript
   const FIREBASE_API_KEY = "YOUR_API_KEY";
   const FIREBASE_PROJECT_ID = "YOUR_PROJECT_ID";
   ```

3. **Start the development server:**
   ```bash
   bun start
   # or npm start
   ```

4. **Launch the app:**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your physical device

## How to Use 📱

### First Time Setup

1. **Create an Account:**
   - Open the app and tap "Sign Up"
   - Enter your full name, email, password, and handicap
   - You'll receive a verification email

2. **Authenticate as Super Admin:**
   - Tap the lock icon (🔒) in the bottom-right corner
   - Enter credentials:
     - Username: `tjohnsons`
     - Password: `Menage74!`
   - This unlocks the Admin tab and management features

### Creating a Tournament

1. Navigate to the **Admin** tab (requires Super Admin access)
2. Enter a tournament name (e.g., "Spring Classic 2025")
3. Tap "Create Tournament"
4. Add tournament days using the "Add Day" button
5. Toggle between "Individual" and "Ambrose" game modes

### Setting Up Teams (Ambrose Mode Only)

1. Switch game mode to "Ambrose" in Admin tab
2. Navigate to the **Teams** tab
3. Tap "Add Team" and enter a team name
4. Tap on players to add them to the team
5. Team handicap is calculated automatically

### Entering Scores

1. Navigate to the **Scorecard** tab
2. Use the +/- buttons to enter strokes for each hole
3. Swipe or use navigation buttons to move between holes
4. Quick view shows all 18 holes at a glance
5. Tap "Save Scores" to record your round

### Viewing Results

1. Navigate to the **Leaderboard** tab
2. Toggle between Gross Score and Stableford Points
3. Generate AI summaries with the "Generate AI Summary" button

### Chatting with Players

1. Navigate to the **Chat** tab
2. Type your message and tap the send button
3. Messages are displayed in real-time

## Architecture 🏗️

### Technology Stack
- **React Native** - Mobile framework
- **Expo SDK 53** - Development platform
- **TypeScript** - Type safety
- **Zustand** - State management
- **Firebase** - Authentication & Realtime Database
- **NativeWind** - Tailwind CSS for React Native
- **React Navigation** - Tab navigation
- **OpenAI API** - AI tournament summaries

### Project Structure
```
src/
├── api/
│   ├── firebase.ts          # Firebase service
│   ├── chat-service.ts      # AI integration
│   └── ...
├── components/
│   ├── Avatar.tsx           # User avatars
│   └── ScoreInput.tsx       # Score entry component
├── data/
│   └── sampleCourses.ts     # Pre-loaded courses
├── screens/
│   ├── AuthScreen.tsx       # Login/Sign up
│   ├── MainApp.tsx          # Tab navigator
│   ├── LeaderboardTab.tsx   # Leaderboard
│   ├── ScorecardTab.tsx     # Scorecard entry
│   ├── TeamsTab.tsx         # Team management
│   ├── CourseTab.tsx        # Course details
│   ├── ProfilesTab.tsx      # Player profiles
│   ├── ChatTab.tsx          # Live chat
│   └── AdminTab.tsx         # Admin dashboard
├── state/
│   └── gameStore.ts         # Zustand store
├── types/
│   └── golf.ts              # TypeScript types
└── utils/
    ├── golfUtils.ts         # Scoring calculations
    └── cn.ts                # Tailwind helper
```

## Scoring System ⛳

### Stableford Points
- **Albatross or better**: 5 points
- **Eagle**: 4 points
- **Birdie**: 3 points
- **Par**: 2 points
- **Bogey**: 1 point
- **Double bogey or worse**: 0 points

### Team Handicap (Ambrose)
- **2 players**: 35% of lowest + 15% of highest
- **3 players**: 30% + 15% + 10%
- **4 players**: 25% + 15% + 10% + 5%

## Firebase Setup (Detailed) 🔥

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: "johnsons-live" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Click on "Email/Password"
4. Enable the toggle
5. Save

### 3. Enable Realtime Database
1. Go to **Realtime Database**
2. Click "Create Database"
3. Choose location (closest to your users)
4. Start in **test mode** (for development)
5. Click "Enable"

### 4. Set up Database Rules (Production)
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
      ".read": true,
      ".write": "auth != null"
    },
    "scores": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

### 5. Get Your Credentials
1. Go to **Project Settings** (gear icon)
2. Under "Your apps", click the Web icon (</>)
3. Register your app
4. Copy the `apiKey` and `projectId`
5. Update `src/api/firebase.ts`

## Environment Variables 🔑

The app comes pre-configured with OpenAI API access for AI summaries. If you want to use your own keys, create a `.env` file:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key (optional)
```

## Super Admin Credentials 👑

- **Username**: `tjohnsons`
- **Password**: `Menage74!`

⚠️ **Important**: Change these credentials in `src/screens/MainApp.tsx` before deploying to production!

## Troubleshooting 🔧

### "Sign up failed" error
- Check that Firebase Authentication is enabled
- Verify email/password provider is active
- Check Firebase project ID in `firebase.ts`

### Scores not saving
- Ensure Realtime Database is enabled
- Check database rules allow writes
- Verify you've created a tournament and selected a day

### AI Summary not working
- The app uses pre-configured OpenAI API keys
- Make sure you have internet connection
- Check console for API errors

### Email verification not received
- Check spam folder
- Ensure email/password authentication is properly configured
- Firebase may have rate limits in development

## Future Enhancements 🚀

Potential features to add:
- [ ] Photo uploads for tournament moments
- [ ] Push notifications for score updates
- [ ] Offline mode with sync
- [ ] Tournament history and archives
- [ ] Player statistics and trends
- [ ] GPS course mapping
- [ ] Apple Watch companion app
- [ ] Social media sharing

## Support 💬

For issues or questions:
1. Check the troubleshooting section
2. Review Firebase console for errors
3. Check Expo dev tools console output
4. Verify all dependencies are installed

## License 📄

This project was created for Johnsons Live golf tournaments. All rights reserved.

---

**Built with ❤️ using React Native, Expo, and Firebase**
