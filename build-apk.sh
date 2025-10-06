#!/bin/bash

# Johnsons Live - APK Build Script
# This script helps you build an Android APK easily

echo "🏌️ Johnsons Live - Android APK Builder"
echo "========================================"
echo ""

# Check if eas-cli is available
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js"
    exit 1
fi

# Check if user is logged in to EAS
echo "📋 Checking EAS login status..."
if ! npx eas-cli whoami &> /dev/null; then
    echo ""
    echo "🔐 You need to login to Expo EAS first."
    echo "   Don't have an account? Create one at expo.dev (it's free!)"
    echo ""
    read -p "Press Enter to login..."
    npx eas-cli login
    
    if [ $? -ne 0 ]; then
        echo "❌ Login failed. Please try again."
        exit 1
    fi
fi

echo "✅ Logged in successfully!"
echo ""

# Ask what type of build
echo "🎯 What type of build do you want?"
echo "   1) APK - For direct distribution to users (recommended)"
echo "   2) AAB - For Google Play Store submission"
echo "   3) Development - For testing with dev tools"
echo ""
read -p "Enter choice (1, 2, or 3): " choice

case $choice in
    1)
        echo ""
        echo "🔨 Building APK for distribution..."
        echo "   This will take 10-15 minutes."
        echo "   The build happens in the cloud, so you can close this terminal if needed."
        echo ""
        npx eas-cli build --platform android --profile preview
        ;;
    2)
        echo ""
        echo "🔨 Building AAB for Google Play Store..."
        echo "   This will take 10-15 minutes."
        echo ""
        npx eas-cli build --platform android --profile production
        ;;
    3)
        echo ""
        echo "🔨 Building development APK..."
        echo "   This will take 10-15 minutes."
        echo ""
        npx eas-cli build --platform android --profile development
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build started successfully!"
    echo ""
    echo "📱 Next steps:"
    echo "   1. Wait for build to complete (you'll get a notification)"
    echo "   2. Download the APK/AAB from the link provided"
    echo "   3. Install on your Android device or distribute to users"
    echo ""
    echo "💡 Tip: You can check build status anytime with:"
    echo "   npx eas-cli build:list"
    echo ""
else
    echo ""
    echo "❌ Build failed. Check the error message above."
    echo ""
    echo "🆘 Common fixes:"
    echo "   - Make sure you're connected to the internet"
    echo "   - Try: npx eas-cli build --platform android --profile preview --clear-cache"
    echo "   - Check: https://docs.expo.dev/build-reference/troubleshooting/"
    echo ""
fi
