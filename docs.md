# Sawmill Calculator Pro — Development & Build Guide

## Table of Contents

1. [Local Web Testing (Full Instructions)](#local-web-testing)
2. [Building Native Apps Locally](#building-native-apps-locally)
3. [Version Management with Capver](#version-management-with-capver)
4. [Capawesome Cloud Build Setup](#capawesome-cloud-build-setup)
5. [Icons and Splash Screens](#icons-and-splash-screens)
6. [iOS Signing for App Store Distribution](#ios-signing-for-app-store-distribution)
7. [Framework Recommendations](framework-recommendations.md) — Evaluating replacements for KnockoutJS & jQuery Mobile

---

## Local Web Testing

This section covers everything you need to test the app in a browser on your local machine. No mobile device, emulator, Xcode, or Android Studio is required.

### Prerequisites

| Requirement | Version | How to Check | Install Link |
|-------------|---------|-------------|-------------|
| **Node.js** | v18 or later (v22+ recommended) | `node --version` | [nodejs.org](https://nodejs.org/) |
| **npm** | Included with Node.js | `npm --version` | Included with Node.js |
| **Git** | Any recent version | `git --version` | [git-scm.com](https://git-scm.com/) |
| **Web browser** | Chrome, Firefox, Safari, or Edge | — | — |

#### Installing Node.js

**macOS** (using Homebrew):
```bash
brew install node
```

**macOS** (using the installer):
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the macOS installer (LTS version recommended)
3. Run the `.pkg` file and follow the prompts

**Windows:**
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the Windows installer (LTS version recommended)
3. Run the `.msi` file and follow the prompts
4. Restart your terminal/command prompt after installation

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Verify Installation

After installing, open a terminal and verify:
```bash
node --version    # Should show v18.x.x or later
npm --version     # Should show 9.x.x or later
```

### Step-by-Step: Run the App Locally

```bash
# 1. Clone the repository
git clone https://github.com/GrantErickson/SawmillCalculator2.git
cd SawmillCalculator2

# 2. Install dependencies
npm install

# 3. Start the local development server
npm start
```

This starts a local HTTP server and automatically opens the app in your default browser at:

> **http://localhost:8080**

### What to Expect

- The app opens showing the main menu with links to Cut List, Board Feet, and Log Volume calculators
- All calculator features work in the browser — enter values, generate cut lists, calculate board feet and log volumes
- PDF export works: when you click "Email" or share buttons, the app generates a PDF and downloads it to your computer
- Settings are saved in your browser's `localStorage` and persist between sessions

### Testing Each Feature

| Feature | Page | What to Test |
|---------|------|-------------|
| **Cut List (US)** | `cutlist.html` | Enter log diameter, board thickness, blade kerf → verify cut positions |
| **Cut List (Metric)** | `cutlistMetric.html` | Same as above with metric units |
| **Board Feet (US)** | `boardfeet.html` | Enter dimensions and quantities → verify board foot totals and pricing |
| **Board Feet (Metric)** | `boardfeetMetric.html` | Same as above with cubic meter calculations |
| **Log Volume (US)** | `volume.html` | Enter log dimensions → verify Doyle/Scribner/International/ROY volumes |
| **Log Volume (Metric)** | `volumeMetric.html` | Same as above with metric units |
| **Settings** | `settings.html` | Change blade side, money symbol, max quantity → verify they persist |
| **PDF Export** | Any calculator page | Generate a PDF → verify it downloads correctly |

### Stopping the Server

Press `Ctrl+C` in the terminal to stop the development server.

### Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm: command not found` | Install Node.js from [nodejs.org](https://nodejs.org/) |
| `EACCES` permission errors | On macOS/Linux, don't use `sudo`. Fix npm permissions: [guide](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) |
| Port 8080 already in use | Stop the other process using port 8080, or start with a custom port: `npx http-server www -o -p 3000` |
| Page shows blank or errors | Open browser DevTools (`F12`) → Console tab to check for JavaScript errors |
| CSS/UI looks broken | Clear browser cache (`Ctrl+Shift+Delete`) and reload |

---

## Building Native Apps Locally

If you have Xcode (Mac) or Android Studio, you can build native apps locally.

### iOS (requires Mac with Xcode)

```bash
npm run cap:sync         # Syncs www/ assets to native project
npm run cap:open:ios     # Opens project in Xcode for building/running
```

### Android (requires Android Studio)

```bash
npm run cap:sync         # Syncs www/ assets to native project
npm run cap:open:android # Opens project in Android Studio for building/running
```

---

## Version Management with Capver

This project uses [@capawesome/capver](https://github.com/capawesome-team/capver) to keep version numbers in sync across all platforms (web, iOS, and Android) from a single command.

### How It Works

Capver manages version numbers in these files:

| Platform | File | Fields |
|----------|------|--------|
| **Web** | `package.json` | `version` |
| **Android** | `android/app/build.gradle` | `versionCode`, `versionName` |
| **iOS** | `ios/App/App.xcodeproj/project.pbxproj` | `CURRENT_PROJECT_VERSION`, `MARKETING_VERSION` |

The Android `versionCode` and iOS `CURRENT_PROJECT_VERSION` (build numbers) are automatically calculated from the semantic version using the default pattern `MMmmmpphh`:

| Letter | Meaning | Digits |
|--------|---------|--------|
| `MM` | Major version | 2 |
| `mmm` | Minor version | 3 |
| `pp` | Patch version | 2 |
| `hh` | Hotfix version | 2 |

For example, version `3.0.0` produces build number `30000000`, and version `3.1.2` would produce `30010200`.

### Available Commands

```bash
# Check the current version across all platforms
npm run version:get

# Set a specific version (updates all platforms)
npm run version:set -- 3.1.0

# Bump the patch version (e.g., 3.0.0 → 3.0.1)
npm run version:patch

# Bump the minor version (e.g., 3.0.1 → 3.1.0)
npm run version:minor

# Bump the major version (e.g., 3.1.0 → 4.0.0)
npm run version:major

# Sync all platforms to the highest detected version
npm run version:sync
```

### Version Workflow

When preparing a release:

1. Bump the version: `npm run version:patch` (or `version:minor` / `version:major`)
2. Verify: `npm run version:get`
3. Commit the changed files
4. Push to trigger a Capawesome Cloud build

---

## Capawesome Cloud Build Setup

[Capawesome Cloud](https://cloud.capawesome.io/) builds native iOS and Android apps in the cloud — no local Xcode or Android Studio required. This is the officially recommended cloud build service for Capacitor.

### Pricing

| Plan | Cost | Build Minutes | Concurrent Builds | Features |
|------|------|--------------|-------------------|----------|
| **Starter** | $9/month | 200 min (~40 builds) | 1 | Live updates, App Store publishing |
| **Professional** | $29/month | 600 min (~120 builds) | 2 | Everything in Starter + more capacity |
| **Team** | $99/month | 1,800 min (~360 builds) | 3 | 60-day data retention |
| **Open Source** | Free | — | — | Apply on their site |

### Step 1: Create Your Capawesome Cloud Account

1. Go to [cloud.capawesome.io](https://cloud.capawesome.io/) and sign up
2. Choose your plan (Starter at $9/month is sufficient for this project)
3. Verify your email address

### Step 2: Create a New App

1. In the Capawesome Cloud Console, click **"Create App"**
2. Fill in:
   - **App Name:** `Sawmill Calculator Pro`
   - **App ID:** `net.micapeak.SawmillCalculatorPro` (must match `appId` in `capacitor.config.json`)
3. Copy the **Capawesome App ID** shown in the app settings (a UUID like `a1b2c3d4-...`)

### Step 3: Update the Project Configuration

Open `capawesome.config.json` in the project root and replace `YOUR_CAPAWESOME_APP_ID` with your actual Capawesome App ID:

```json
{
  "cloud": {
    "apps": [
      {
        "appId": "a1b2c3d4-your-actual-app-id-here",
        "dependencyInstallCommand": "npm install",
        "webBuildCommand": "echo 'No build step needed — www/ contains pre-built assets'"
      }
    ]
  }
}
```

> **Note:** This app is a vanilla JavaScript app with no bundler. The `www/` folder contains pre-built assets, so no web build step is needed. The `webBuildCommand` is set to a no-op echo command.

### Step 4: Connect Your Repository

1. In the Capawesome Cloud Console, go to your app's **Settings**
2. Click **"Connect Repository"**
3. Authorize Capawesome to access your GitHub account
4. Select the `SawmillCalculator2` repository
5. Choose the branch to build from (typically `main` or `master`)

### Step 5: Configure Code Signing

#### For Android:

1. Generate an Android keystore (if you don't have one):
   ```bash
   keytool -genkey -v -keystore sawmill-release.keystore -alias sawmill -keyalg RSA -keysize 2048 -validity 10000
   ```
2. In the Capawesome Cloud Console, go to **Certificates**
3. Upload your `.keystore` file and enter the keystore password and alias

#### For iOS:

1. You need an [Apple Developer account](https://developer.apple.com/) ($99/year)
2. Generate a distribution certificate and provisioning profile (see [iOS Signing](#ios-signing-for-app-store-distribution) below)
3. In the Capawesome Cloud Console, go to **Certificates**
4. Upload your `.p12` certificate and provisioning profile

### Step 6: Trigger a Build

There are three ways to trigger builds:

**Option A — From the Console:**
1. Go to your app in the Capawesome Cloud Console
2. Click **"New Build"**
3. Select the platform (iOS, Android, or both)
4. Click **"Start Build"**

**Option B — Automatic on Git Push:**
1. In the Console, enable **"Auto Build"** for your connected branch
2. Every push to that branch will automatically trigger a native build

**Option C — Using the Capawesome CLI:**
```bash
# Install the CLI
npm install -g @capawesome/cli

# Log in with your Capawesome Cloud token
npx capawesome login --token YOUR_TOKEN

# Trigger a build
npx capawesome apps:builds:create --appId YOUR_APP_ID --platform android
npx capawesome apps:builds:create --appId YOUR_APP_ID --platform ios
```

### Step 7: Download and Distribute

After a build completes (~3–5 minutes per build):
1. Download the signed `.apk`/`.aab` (Android) or `.ipa` (iOS) from the Console
2. Or use **App Store Publishing** to push directly to Google Play or Apple App Store/TestFlight

### Pipeline Summary

```
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│  Push to GitHub  │────▶│  Capawesome Cloud    │────▶│  App Store /     │
│  (main branch)   │     │  • npm install        │     │  Google Play     │
│                  │     │  • Build iOS/Android  │     │  (auto-publish)  │
└─────────────────┘     │  • Sign binaries      │     └──────────────────┘
                        └──────────────────────┘
```

This fully automated pipeline means:
- **No local Xcode or Android Studio needed**
- **No self-hosted build servers**
- **Push code → get store-ready binaries**

---

## Icons and Splash Screens

Use [@capacitor/assets](https://github.com/ionic-team/capacitor-assets) or generate manually:

```bash
npx @capacitor/assets generate
```

Or use online tools like [icon.kitchen](https://icon.kitchen/) for generating app icons.

---

## iOS Signing for App Store Distribution

1. Create a CSR with Keychain Access (use the Keychain Access menu → Certificate Assistant → Request a Certificate From a Certificate Authority)
2. Upload the CSR to [developer.apple.com](https://developer.apple.com) → Certificates, Identifiers & Profiles → create a Distribution certificate
3. Download the `.cer` file and import it into Keychain Access (double-click the file)
4. Export as a `.p12` certificate: in Keychain Access, right-click the certificate → Export → save as `.p12` (set a password)
5. Create a Provisioning Profile at developer.apple.com → Profiles → App Store distribution
6. Upload the `.p12` and provisioning profile to Capawesome Cloud Console under your app's **Certificates** section
