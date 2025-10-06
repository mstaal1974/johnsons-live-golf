# 🤖 Build Android APK - Quick Instructions

## ⚡ Fastest Way (Recommended)

### Option 1: Use the Build Script

```bash
cd /home/user/workspace
./build-apk.sh
```

Follow the prompts - it will guide you through everything!

---

### Option 2: Manual Commands

```bash
# 1. Login to Expo (first time only)
npx eas-cli login

# 2. Build APK
npx eas-cli build --platform android --profile preview

# 3. Wait 10-15 minutes
# You'll get a download link when done
```

---

## 📋 What You Need

1. **Expo Account** (free) - Create at [expo.dev](https://expo.dev)
2. **Internet Connection**
3. **10-15 minutes** for build to complete

---

## 🎯 After Building

### Download Your APK
- You'll get a link in the terminal
- Or visit: https://expo.dev/accounts/[your-username]/projects/johnsons-live/builds
- Click the latest build
- Download the APK file

### Install on Android Device
1. Transfer APK to your phone (email, Drive, USB)
2. Open the APK file on your phone
3. Tap "Install"
4. If blocked, enable "Install from Unknown Sources" in Settings
5. Done! Open Johnsons Live app

---

## 📤 Share with Users

### Method 1: Google Drive
1. Upload APK to Google Drive
2. Right-click → Share → Get link
3. Set to "Anyone with the link"
4. Share link with tournament participants

### Method 2: Direct Transfer
1. Send APK via email (if under 25MB)
2. Or use WeTransfer, Dropbox, etc.
3. Users download and install

---

## 🔧 Troubleshooting

### "Command not found: eas"
```bash
cd /home/user/workspace
bun add -d eas-cli
# Then try again
```

### "Not logged in"
```bash
npx eas-cli login
# Enter your Expo credentials
```

### "Build failed"
```bash
# Clear cache and try again
npx eas-cli build --platform android --profile preview --clear-cache
```

### Can't install APK on phone
- Go to Settings → Security → Unknown Sources → Enable
- Or Settings → Apps → Special Access → Install Unknown Apps
- Then try installing again

---

## 📊 Build Profiles

### Preview (Default - Recommended)
```bash
npx eas-cli build --platform android --profile preview
```
✅ Creates APK file  
✅ Ready for distribution  
✅ ~50-70 MB file size  

### Production (For Play Store)
```bash
npx eas-cli build --platform android --profile production
```
✅ Creates AAB file  
✅ For Google Play Store  
✅ Optimized by Play Store  

---

## 💰 Cost

**FREE!**
- 30 builds per month on free tier
- More than enough for this app

---

## ⏱️ Build Time

- **First build**: 15-20 minutes
- **Subsequent builds**: 10-15 minutes
- Builds happen in the cloud, so you can close terminal

---

## 🎉 That's It!

**Three simple steps:**
1. Login to Expo
2. Run build command
3. Download APK

**Your Android app is ready to distribute!** 🚀

---

## 📚 More Info

- Full guide: `BUILD_APK_GUIDE.md`
- Expo docs: https://docs.expo.dev/build/introduction/
- Need help? Check Expo Discord: https://chat.expo.dev

---

**Ready? Run the build script now:**
```bash
./build-apk.sh
```
