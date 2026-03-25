# Development and Build Instructions for Sawmill Calculator Pro

## Quick Start (Browser Development)

1. Clone the repo
2. `npm install`
3. `npm start` (opens `http-server` serving the `www` folder)

## Building Native Apps with Capacitor

### iOS (requires Mac with Xcode)

```bash
npm run cap:add:ios      # First time only: adds the iOS platform
npm run cap:sync         # Syncs www/ assets to native project
npm run cap:open:ios     # Opens project in Xcode for building/running
```

### Android (requires Android Studio)

```bash
npm run cap:add:android  # First time only: adds the Android platform
npm run cap:sync         # Syncs www/ assets to native project
npm run cap:open:android # Opens project in Android Studio for building/running
```

### Cloud Builds (No Local IDE Required)

If you don't have Xcode or Android Studio, use a cloud build service:

#### VoltBuilder (~$15/month, free debug Android builds)

The simplest option — closest experience to the old PhoneGap Build:

1. Sign up at [volt.build](https://volt.build/) (15-day free trial for paid plans)
2. Zip your project or connect your Git repo
3. Upload and build — get store-ready iOS and Android binaries
4. Use [VoltSigner](https://volt.build/) for free certificate generation (no Mac required)

**Pricing:**
- **Free:** Debug Android builds, 4 builds/day, 10 MB limit
- **Indy ($15/mo):** Release iOS + Android, 20 builds/day, 50 MB limit
- **Pro:** 100 builds/day, AdHoc iOS, 200 MB limit

More info: [volt.build/docs/capacitor-overview](https://volt.build/docs/capacitor-overview/)

#### Capawesome Cloud ($9/month, free for open source)

The officially recommended cloud service for Capacitor:

1. Sign up at [cloud.capawesome.io](https://cloud.capawesome.io/)
2. Connect your GitHub/GitLab/Bitbucket repository
3. Configure build settings and signing certificates
4. Build, test, and publish to App Store and Google Play

**Pricing:**
- **Starter ($9/mo):** ~40 builds/mo, live updates, App Store publishing
- **Professional ($29/mo):** ~120 builds/mo, 2 concurrent builds
- **Free for open-source projects** (apply on their site)
- **Price lock guarantee:** Your subscription price never increases

More info: [cloud.capawesome.io](https://cloud.capawesome.io/)

#### GitHub Actions (Free for public repos)

Full CI/CD with complete control but requires setup:

- Free for public repos (2,000 min/mo free for private repos)
- macOS runners available for iOS builds
- Requires writing workflow YAML files and managing signing certificates

> **Note:** Ionic Appflow is being discontinued (EOL December 2027) and should not be used for new projects.

## Generating Icons and Splash Screens

Use [@capacitor/assets](https://github.com/nicepay/capacitor-assets) or generate manually:

```bash
npx @capacitor/assets generate
```

Or use online tools like https://icon.kitchen/ for generating app icons.

## iOS Signing (for App Store Distribution)

1. Create a CSR with Keychain Access (use the Keychain Access menu)
2. Upload the CSR to [developer.apple.com](https://developer.apple.com) and download the `.cer` file
3. Import the `.cer` file into Keychain Access
4. Export as a `.p12` certificate (with private key)
5. Create a Provisioning Profile at developer.apple.com
6. Configure signing in Xcode (or upload certificates to your cloud build service)

Reference: https://community.telligent.com/community/9/w/user-documentation/52415/convert-a-cer-file-to-a-p12-file
