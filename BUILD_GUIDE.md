# 📱 AR Computers App - Android Build Guide

## ✅ Step 1: Prerequisites Install

```bash
# Install Node.js (v18 LTS recommended)
# Download from: https://nodejs.org/

# Install Expo CLI
npm install -g expo-cli eas-cli

# Verify installation
node --version
npm --version
```

---

## ✅ Step 2: Extract & Setup Project

```bash
# Extract the ZIP file
unzip ar_computers_app.zip
cd ar_computers_app

# Install all dependencies
npm install
```

---

## ✅ Step 3: Test on Your Phone (Easiest!)

```bash
# Start development server
npx expo start
```

Then:
1. Install **Expo Go** app from Play Store on your Android phone
2. Open Expo Go → Scan the QR code shown in terminal
3. App will load on your phone instantly! ✨

---

## ✅ Step 4: Build Android APK (for distribution)

### Option A: Using Expo Cloud Build (Recommended - No Android Studio needed!)

```bash
# 1. Create free account at expo.dev
# 2. Login
eas login

# 3. Build APK (free for personal use)
eas build -p android --profile preview

# Wait 5-10 minutes, then download APK from the link provided!
```

### Option B: Local Build (requires Android Studio)

```bash
# Install Android Studio from: https://developer.android.com/studio
# Set ANDROID_HOME environment variable

# Build locally
npx expo run:android
```

---

## ✅ Step 5: Install APK on Android Phone

1. Enable "Install from Unknown Sources" in Android Settings → Security
2. Transfer APK to phone via USB or WhatsApp
3. Open APK file and install
4. Open "AR Computers" app! 🎉

---

## 📱 App Features After Install

| Feature | Description |
|---------|-------------|
| 🏠 Home | Dashboard with categories, products, banners |
| 📦 Products | Browse 15+ products, filter & sort |
| 📂 Categories | 8 categories with subcategories |
| 🛒 Cart | Add products, manage quantities, checkout |
| 📥 Import | Import CSV files with 1000+ products |
| 👤 Profile | Business info, stats, quick actions |

---

## 📋 Import Your Products

1. Open app → Tap **Import** tab
2. Tap **Download CSV Template**
3. Fill your products in the template
4. Tap **Select CSV File** → Choose your file
5. Preview & Tap **Import Products**

**CSV Format:**
```
Product ID,Category,Product Name,Brand,Model,Price,Stock,Image URL,Description
AR001,Laptop,HP 15s i3,HP,15s-fq2672TU,38000,15,https://...,Description here
```

---

## 🎨 Branding

- **Primary Color:** `#1a237e` (Deep Blue)
- **Accent Color:** `#ff6f00` (Orange)
- Change colors in each screen's StyleSheet

---

## 🆘 Troubleshooting

**"npm install" fails:**
```bash
npm install --legacy-peer-deps
```

**Metro bundler issues:**
```bash
npx expo start --clear
```

**Build fails:**
```bash
npm install -g eas-cli@latest
eas build --clear-cache -p android --profile preview
```

---

## 📞 Support
- Expo Docs: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction
- AR Computers: info@arcomputers.com
