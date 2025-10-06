# 🤖 Building Android APK - Complete Guide

## Overview

There are **3 ways** to build an Android APK for Johnsons Live:

1. **EAS Build** (Recommended) - Cloud build, easiest
2. **Expo Prebuild + Android Studio** - Local build
3. **Direct Install via Expo Go** - No build needed (testing only)

---

## ✅ Method 1: EAS Build (RECOMMENDED)

### What You Need
- Expo account (free)
- Internet connection
- 10-15 minutes

### Step-by-Step

#### 1. Create Expo Account (if you don't have one)
```bash
# Go to expo.dev and sign up
# Or create during the build process
```

#### 2. Login to EAS
```bash
cd /home/user/workspace
npx eas-cli login
# Enter your Expo credentials
```

#### 3. Configure Your Project
```bash
# Initialize EAS (already done, but run if needed)
npx eas-cli build:configure
```

#### 4. Build APK
```bash
# Build APK for testing/distribution
npx eas-cli build --platform android --profile preview

# Or build AAB for Play Store
npx eas-cli build --platform android --profile production
```

#### 5. Wait for Build (10-15 minutes)
- Build happens in the cloud
- You'll see progress in terminal
- Get a link to download when done

#### 6. Download APK
- Click the link provided
- Or go to expo.dev/accounts/[your-username]/projects/johnsons-live/builds
- Download the APK file

#### 7. Install on Android Device
- Transfer APK to phone
- Open and install
- Allow "Install from Unknown Sources" if prompted

### EAS Build Advantages
✅ No Android Studio needed  
✅ No local setup required  
✅ Builds in cloud (fast)  
✅ Automated signing  
✅ Works on any OS  
✅ Free tier available  

---

## 🏗️ Method 2: Local Build with Expo Prebuild

### What You Need
- Android Studio installed
- Android SDK configured
- Java JDK 17+
- 30+ minutes setup time

### Step-by-Step

#### 1. Install Android Studio
```bash
# Download from: https://developer.android.com/studio
# Install Android SDK Platform 34
# Set up environment variables:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### 2. Install Java JDK 17
```bash
# On Ubuntu/Debian:
sudo apt install openjdk-17-jdk

# On Mac:
brew install openjdk@17

# On Windows: Download from Oracle
```

#### 3. Prebuild the Project
```bash
cd /home/user/workspace

# This generates native Android code
npx expo prebuild --platform android
```

#### 4. Build APK
```bash
# Using Expo
npx expo run:android --variant release

# Or directly with Gradle
cd android
./gradlew assembleRelease
```

#### 5. Find Your APK
```bash
# APK will be at:
android/app/build/outputs/apk/release/app-release.apk
```

#### 6. Install on Device
```bash
# Via ADB
adb install android/app/build/outputs/apk/release/app-release.apk

# Or transfer file and install manually
```

### Local Build Disadvantages
❌ Complex setup  
❌ Requires Android Studio  
❌ Large download (10GB+)  
❌ OS-specific issues  
❌ Manual signing required  

---

## 📱 Method 3: Expo Go (Testing Only)

### Instant Testing Without Building

#### 1. Install Expo Go on Android
- Open Google Play Store
- Search "Expo Go"
- Install (free)

#### 2. Start Dev Server
```bash
cd /home/user/workspace
bun start
```

#### 3. Scan QR Code
- Open Expo Go on phone
- Tap "Scan QR code"
- Point at QR code in terminal
- App loads instantly!

### Expo Go Advantages
✅ No build needed  
✅ Instant updates  
✅ Perfect for testing  
✅ Hot reload  

### Expo Go Limitations
❌ Requires Expo Go app  
❌ Can't distribute to users  
❌ No custom native code  
❌ Not for production  

---

## 🚀 Quick Start: Build APK Now

### Using EAS Build (Fastest)

```bash
# 1. Install EAS CLI (already done)
cd /home/user/workspace

# 2. Login (create account if needed)
npx eas-cli login

# 3. Build APK
npx eas-cli build --platform android --profile preview

# 4. Follow the prompts:
# - Generate new Android keystore? Yes
# - Wait for build to complete
# - Download APK from provided link
```

**Total time: 15 minutes**

---

## 📋 EAS Build Configuration

I've already created `eas.json` with 3 build profiles:

### 1. Development Build
```bash
npx eas-cli build --platform android --profile development
```
- For development/testing
- Includes dev tools
- Larger file size

### 2. Preview Build (APK)
```bash
npx eas-cli build --platform android --profile preview
```
- **Recommended for distribution**
- Creates APK file
- Smaller size
- Production-ready

### 3. Production Build (AAB)
```bash
npx eas-cli build --platform android --profile production
```
- For Google Play Store
- Creates AAB (Android App Bundle)
- Optimized by Play Store

---

## 🔑 Android App Signing

### Automatic (EAS Build)
EAS handles signing automatically:
- Generates keystore
- Signs APK
- Stores credentials securely
- No manual work needed

### Manual (Local Build)
If building locally, you need to:

```bash
# 1. Generate keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore johnsons-live.keystore \
  -alias johnsons-live-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 2. Configure in android/gradle.properties
MYAPP_UPLOAD_STORE_FILE=johnsons-live.keystore
MYAPP_UPLOAD_KEY_ALIAS=johnsons-live-key
MYAPP_UPLOAD_STORE_PASSWORD=***
MYAPP_UPLOAD_KEY_PASSWORD=***

# 3. Update android/app/build.gradle
# (Add signing config)
```

**EAS Build is much easier!**

---

## 📦 APK File Details

### What You'll Get
- **File name**: `build-xxxxxx.apk`
- **Size**: ~50-70 MB
- **Min Android**: Android 5.0 (API 21)
- **Target Android**: Android 14 (API 34)
- **Architecture**: Universal (arm64, armeabi, x86)

### APK Contents
✅ All app code  
✅ React Native runtime  
✅ JavaScript bundle  
✅ Assets and images  
✅ Native dependencies  

---

## 🎯 Distribution Options

### Option 1: Direct APK Distribution
1. Build APK with EAS
2. Upload to Google Drive/Dropbox
3. Share link with users
4. Users download and install

**Pros**: Instant, free, no approval  
**Cons**: Manual updates, no analytics

### Option 2: Google Play Store
1. Build AAB with EAS production profile
2. Create Google Play Developer account ($25 one-time)
3. Submit AAB file
4. Wait for review (1-3 days)
5. Published!

**Pros**: Professional, automatic updates, analytics  
**Cons**: $25 fee, review process

### Option 3: Firebase App Distribution
1. Build APK with EAS
2. Upload to Firebase
3. Invite testers
4. They get notification to install

**Pros**: Easy testing, controlled distribution  
**Cons**: Requires Firebase setup

---

## ⚡ Quick Commands Reference

```bash
# Login to EAS
npx eas-cli login

# Build APK (testing/distribution)
npx eas-cli build --platform android --profile preview

# Build AAB (Play Store)
npx eas-cli build --platform android --profile production

# Check build status
npx eas-cli build:list

# View specific build
npx eas-cli build:view [build-id]

# Download APK directly
npx eas-cli build:download [build-id]
```

---

## 🐛 Troubleshooting

### "Command not found: eas"
```bash
# Install EAS CLI
bun add -d eas-cli
# Or use npx
npx eas-cli [command]
```

### "Not logged in"
```bash
npx eas-cli login
# Or
npx eas-cli whoami
```

### "Build failed"
- Check error message
- Common issues:
  - package.json missing dependencies
  - Invalid app.json configuration
  - Network issues
- Run: `npx eas-cli build --platform android --profile preview --clear-cache`

### "APK won't install"
- Enable "Install from Unknown Sources"
- Check Android version (5.0+)
- Make sure APK is not corrupted
- Try: Settings → Security → Unknown Sources → Allow

---

## 💰 EAS Build Pricing

### Free Tier
- ✅ 30 builds per month
- ✅ Unlimited builds for open source
- ✅ Perfect for small projects

### Paid Plans (if you need more)
- **Production**: $29/month (unlimited builds)
- **Enterprise**: Custom pricing

**For Johnsons Live tournament app, free tier is plenty!**

---

## 📊 Build Size Optimization

### Current APK Size: ~50-70 MB

### To Reduce Size:
1. **Enable Hermes** (already enabled in Expo 53)
2. **ProGuard** (enabled in production builds)
3. **Remove unused dependencies**
4. **Optimize images**
5. **Split APKs by architecture** (advanced)

The current size is already optimized for React Native apps!

---

## 🎉 Recommended: Use EAS Build

**For 99% of users, EAS Build is the best choice:**

✅ **Easy**: One command  
✅ **Fast**: 10-15 minutes  
✅ **Free**: 30 builds/month  
✅ **Reliable**: Cloud infrastructure  
✅ **Maintained**: Always up-to-date  

**Just run:**
```bash
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

---

## 📱 After Building

### Share APK with Users

1. **Via Link**
   - Upload to Google Drive
   - Share public link
   - Users click to download

2. **Via Email**
   - Attach APK file
   - Send to tournament participants
   - They install on Android

3. **Via QR Code**
   - Use qr-code generator
   - Point to APK download link
   - Users scan and install

### Installation Instructions for Users

```
1. Download the APK file
2. Open the file
3. Tap "Install"
4. If blocked, go to Settings → Security → Unknown Sources → Enable
5. Return and tap "Install" again
6. Open "Johnsons Live" app
7. Sign up or log in
```

---

## ✅ Complete Build Checklist

Before building:
- [ ] Firebase configured (API keys in firebase.ts)
- [ ] Super admin credentials changed (if needed)
- [ ] App name updated in app.json
- [ ] Version number set
- [ ] Test in Expo Go first

Build process:
- [ ] Run `npx eas-cli login`
- [ ] Run `npx eas-cli build --platform android --profile preview`
- [ ] Wait for build to complete
- [ ] Download APK

After building:
- [ ] Test APK on real device
- [ ] Verify Firebase connection
- [ ] Test all features
- [ ] Share with users

---

## 🆘 Need Help?

**EAS Build Documentation:**
https://docs.expo.dev/build/introduction/

**Common Issues:**
https://docs.expo.dev/build-reference/troubleshooting/

**Expo Discord:**
https://chat.expo.dev

---

## 🎊 You're Ready!

Your app is configured and ready to build!

**Run this now:**
```bash
cd /home/user/workspace
npx eas-cli build --platform android --profile preview
```

In 15 minutes, you'll have an installable APK! 🎉

---

**Built APK successfully? Users can now install Johnsons Live on their Android devices and start scoring golf tournaments!** ⛳🏆
