# Quick Start Guide - Johnsons Live Golf App

## 🚀 Getting Started in 5 Minutes

### Step 1: Launch the App
```bash
bun start
# Press 'i' for iOS or 'a' for Android
```

### Step 2: Firebase Setup (One-Time)

**Before first use, you must configure Firebase:**

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project called "johnsons-live"
3. Enable **Authentication** → Email/Password
4. Enable **Realtime Database**
5. Copy your API credentials

6. Update `/src/api/firebase.ts`:
```typescript
const FIREBASE_API_KEY = "YOUR_API_KEY_HERE";
const FIREBASE_PROJECT_ID = "YOUR_PROJECT_ID_HERE";
```

### Step 3: Create Your First Account

1. Open the app
2. Tap **Sign Up**
3. Fill in:
   - Full Name: Your name
   - Email: Your email
   - Password: Secure password
   - Handicap: Your golf handicap (e.g., 12.5)
4. Check your email for verification

### Step 4: Unlock Super Admin

1. Tap the **🔒 lock icon** (bottom-right)
2. Enter credentials:
   - Username: `tjohnsons`
   - Password: `Menage74!`
3. Admin tab is now unlocked!

### Step 5: Create a Tournament

1. Go to **Admin** tab
2. Enter tournament name: "Spring Classic 2025"
3. Tap **Create Tournament**
4. Tap **Add Day** to add tournament days
5. Toggle **Game Mode** (Individual or Ambrose)

### Step 6: Invite Players

1. Share the app with players
2. They sign up with their details
3. View all players in **Profiles** tab

### Step 7: Set Up Teams (Ambrose Mode Only)

1. Switch to Ambrose mode in Admin
2. Go to **Teams** tab
3. Tap **Add Team**
4. Add players to teams
5. Team handicap calculated automatically

### Step 8: Start Scoring!

1. Go to **Scorecard** tab
2. Select a hole
3. Use **+ / -** buttons to enter strokes
4. Navigate between holes
5. Tap **Save Scores**

### Step 9: View Leaderboard

1. Go to **Leaderboard** tab
2. Toggle between Gross and Stableford
3. See real-time rankings
4. Generate AI summary

## 🎯 Quick Tips

### For Super Admin
- ✅ Create tournament first
- ✅ Add at least one tournament day
- ✅ Choose game mode before players start scoring
- ✅ Teams only work in Ambrose mode
- ⚠️ Use "Danger Zone" carefully - it deletes everything!

### For Players
- 📝 Enter scores for each hole as you play
- 💬 Use chat to communicate with group
- 📊 Check leaderboard to see standings
- 🏌️ View course details before starting

### Celebration Alerts
When you score a **birdie or better**, you'll get a special alert! 🎉

## 🔑 Key Credentials

### Super Admin
- Username: `tjohnsons`
- Password: `Menage74!`
- **Change these in production!** (Edit `/src/screens/MainApp.tsx`)

## 📱 App Navigation

| Tab | Icon | Purpose |
|-----|------|---------|
| Leaderboard | 🏆 | View rankings, generate AI summaries |
| Scorecard | 📋 | Enter scores hole-by-hole |
| Teams | 👥 | Manage teams (Ambrose mode) |
| Course | 🏌️ | View course details |
| Profiles | 👤 | See all players |
| Chat | 💬 | Message other players |
| Admin | 🛡️ | Tournament management (Super Admin) |

## 🎮 Game Modes

### Individual Mode
- Each player scores independently
- Personal handicap used
- Individual leaderboard

### Ambrose Mode
- Team-based scoring
- Team handicap calculated automatically
- Team leaderboard
- Players must be assigned to teams

## 🏆 Scoring

### Stableford Points
| Score | Points |
|-------|--------|
| Albatross (-3) | 5 |
| Eagle (-2) | 4 |
| Birdie (-1) | 3 |
| Par (0) | 2 |
| Bogey (+1) | 1 |
| Double+ (+2) | 0 |

## 🔧 Troubleshooting

**Can't sign up?**
- Check Firebase is configured
- Verify Email/Password auth is enabled

**No Admin tab?**
- Tap lock icon to authenticate as super admin

**Scores not saving?**
- Create a tournament in Admin first
- Add at least one tournament day
- Make sure you tapped "Save Scores"

**AI Summary not working?**
- Check internet connection
- OpenAI API is pre-configured

## 📞 Common Workflows

### Daily Tournament Flow
1. Super admin creates tournament
2. Players sign up
3. Super admin adds tournament day
4. Players enter scores during round
5. View leaderboard live
6. Generate AI summary at end
7. Share results via chat

### Multi-Day Tournament
1. Create tournament once
2. Add multiple days (Day 1, Day 2, etc.)
3. Players can see cumulative scores
4. Switch between days in app

## 🎨 Pre-loaded Courses

The app includes 3 famous courses:
- 🏖️ Pebble Beach Golf Links (Par 72)
- 🌳 Augusta National Golf Club (Par 72)
- ⛳ St Andrews - Old Course (Par 72)

More courses can be added in `/src/data/sampleCourses.ts`

## 🚨 Important Notes

1. **Email verification** is automatic but not required for scoring
2. **Firebase setup** is required - app won't work without it
3. **Super admin** credentials should be changed for production
4. **Scores are persistent** - saved in Firebase and local storage
5. **Chat is real-time** - messages sync across all devices

---

**Need more help?** Check `JOHNSONS_LIVE_README.md` for full documentation.

**Enjoy your tournament! 🏌️‍♂️⛳**
