# 🎯 Run This On Your Local Machine

## ⚠️ Important Note

The APK build process requires **interactive authentication** that cannot be done remotely. You need to run these commands on your own computer where you have access to:
- Terminal/Command Prompt
- Web browser (for Expo login)
- Your Expo account credentials

---

## 🖥️ **Step-by-Step: Build APK on Your Machine**

### **Prerequisites**

1. **Download/Clone this project** to your local machine
2. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org
   - Choose LTS version
3. **Install Bun** (optional, or use npm)
   - https://bun.sh

### **Step 1: Open Terminal**

**On Mac:**
- Press `Cmd + Space`
- Type "Terminal"
- Press Enter

**On Windows:**
- Press `Win + R`
- Type "cmd" or "powershell"
- Press Enter

**On Linux:**
- Press `Ctrl + Alt + T`

### **Step 2: Navigate to Project**

```bash
# Replace with your actual project path
cd /path/to/johnsons-live-project

# Example on Mac:
cd ~/Desktop/johnsons-live

# Example on Windows:
cd C:\Users\YourName\Desktop\johnsons-live
```

### **Step 3: Install Dependencies (First Time Only)**

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### **Step 4: Run Build Script**

```bash
./build-apk.sh
```

### **Step 5: Login to Expo**

You'll see:
```
🔐 You need to login to Expo EAS first.
   Don't have an account? Create one at expo.dev (it's free!)

Press Enter to login...
```

**Press Enter**, then:

#### **If You Have an Expo Account:**
```
? Email or username: your-email@example.com
? Password: ••••••••••
✔ Logged in as your-username
```

#### **If You Don't Have an Account:**
1. Go to https://expo.dev in your browser
2. Click "Sign Up"
3. Create free account
4. Come back to terminal
5. Enter your new credentials

### **Step 6: Choose Build Type**

You'll see:
```
🎯 What type of build do you want?
   1) APK - For direct distribution to users (recommended)
   2) AAB - For Google Play Store submission
   3) Development - For testing with dev tools

Enter choice (1, 2, or 3):
```

**Type: `1`** and press Enter

### **Step 7: First-Time Setup Questions**

#### **Question 1: Generate Keystore?**
```
? Generate a new Android Keystore? (Y/n)
```
**Type: `Y`** and press Enter

This creates signing credentials for your APK.

#### **Question 2: Project Name**
```
? What would you like your Android application id to be?
```
Should show: `com.johnsons.live`
**Press Enter** to accept

### **Step 8: Build Starts**

You'll see:
```
✔ Build started, it may take a few minutes to complete.
📝 Build details: https://expo.dev/accounts/[username]/projects/johnsons-live/builds/[id]

Waiting for build to complete...
```

**What's happening:**
- Your code is uploaded to Expo servers
- APK is built in the cloud
- Process takes 10-15 minutes
- You can close terminal if needed (build continues)

### **Step 9: Build Completes**

You'll see:
```
✔ Build finished!

📦 Download your build:
   https://expo.dev/artifacts/eas/abc123-xyz789.apk

📱 Install on Android:
   1. Click the link above
   2. Download APK file
   3. Transfer to your Android phone
   4. Open and install
```

### **Step 10: Download APK**

1. **Click the download link** in terminal
2. Or copy/paste into browser
3. **APK file downloads** to your computer
4. **Save it** somewhere accessible

---

## 📱 **Install APK on Android Phone**

### **Method 1: USB Transfer (Fastest)**

1. **Connect phone to computer** via USB
2. **Enable File Transfer** on phone
3. **Copy APK** to phone's Download folder
4. **Disconnect phone**
5. **Open Files app** on phone
6. **Navigate to Downloads**
7. **Tap the APK file**
8. **Tap Install**
9. If blocked, go to Settings → Security → Unknown Sources → Enable
10. **Tap Install** again

### **Method 2: Cloud Transfer**

1. **Upload APK to Google Drive**
   - Go to drive.google.com
   - Upload APK file
   - Right-click → Get shareable link
   - Set to "Anyone with link"
   
2. **On your phone:**
   - Open the Google Drive link
   - Download APK
   - Install as above

### **Method 3: Email**

1. **Email APK to yourself**
   - Attach APK file
   - Send to your email

2. **On your phone:**
   - Open email
   - Download attachment
   - Install APK

---

## 🐛 **Troubleshooting**

### **"npm: command not found" or "bun: command not found"**

Install Node.js first:
- Go to https://nodejs.org
- Download and install LTS version
- Restart terminal
- Try again

### **"Permission denied" when running ./build-apk.sh**

```bash
# Make script executable
chmod +x build-apk.sh

# Then run again
./build-apk.sh
```

### **"eas: command not found"**

```bash
# Install EAS CLI
npm install -g eas-cli

# Or use with npx
npx eas-cli build --platform android --profile preview
```

### **Build Fails**

```bash
# Clear cache and try again
npx eas-cli build --platform android --profile preview --clear-cache
```

### **Can't Install APK on Phone**

**On Android 12+:**
1. Settings → Apps → Special app access
2. Install unknown apps
3. Find your browser/Files app
4. Enable "Allow from this source"

**On Android 11 and below:**
1. Settings → Security
2. Unknown sources → Enable

---

## 📊 **Command Reference**

```bash
# Full manual build process
npx eas-cli login                                           # Login first
npx eas-cli build --platform android --profile preview     # Build APK
npx eas-cli build:list                                      # Check status
npx eas-cli build:view [build-id]                          # View details

# Alternative profiles
npx eas-cli build --platform android --profile production  # For Play Store (AAB)
npx eas-cli build --platform android --profile development # Dev build
```

---

## ⏱️ **Timeline**

| Step | Time |
|------|------|
| Install dependencies | 2-5 min |
| Login to Expo | 1 min |
| Start build | 1 min |
| **Build in cloud** | **10-15 min** |
| Download APK | 1 min |
| Transfer to phone | 2 min |
| Install | 1 min |
| **TOTAL** | **~20-25 min** |

---

## ✅ **Checklist**

Before building:
- [ ] Project downloaded to local machine
- [ ] Node.js installed
- [ ] Terminal opened
- [ ] In project directory
- [ ] Dependencies installed (`bun install`)

During build:
- [ ] Expo account created (or have credentials)
- [ ] Logged in successfully
- [ ] Chose APK build type
- [ ] Accepted keystore generation
- [ ] Build started

After build:
- [ ] APK downloaded
- [ ] APK transferred to phone
- [ ] APK installed
- [ ] App tested
- [ ] Ready to share!

---

## 🎉 **Success!**

Once installed, you'll have:
- ✅ Johnsons Live app on Android
- ✅ Full tournament features
- ✅ Shareable APK file
- ✅ Ready for your golf tournament!

---

## 💡 **Pro Tips**

1. **Save the APK file** - You can install it on multiple devices
2. **Bookmark the Expo build page** - Easy access to all builds
3. **Share via Google Drive** - Easiest way to distribute to players
4. **Test thoroughly** - Install on 2-3 devices before tournament
5. **Keep credentials safe** - You'll need them for updates

---

## 📞 **Need Help?**

If you get stuck:
1. **Check the error message** - Often tells you exactly what's wrong
2. **Read BUILD_APK_GUIDE.md** - Detailed troubleshooting
3. **Expo Discord** - https://chat.expo.dev (very helpful community)
4. **Expo Forums** - https://forums.expo.dev

---

## 🚀 **Next Steps After Building**

1. **Install on your phone**
2. **Test all features:**
   - Sign up / Login
   - Create tournament
   - Enter scores
   - View leaderboard
   - Send messages
   - Generate AI summary
3. **Share APK with tournament participants**
4. **Start your golf tournament!**

---

**Good luck with your build!** 🏌️‍♂️📱⛳

**The build process is straightforward - just follow these steps on your local machine!**
