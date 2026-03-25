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

- **[VoltBuilder](https://volt.build/)** — ~$36/year, direct replacement for PhoneGap Build
- **[Appflow](https://ionic.io/appflow)** — Ionic's cloud build platform
- **[GitHub Actions](https://github.com/features/actions)** — Free CI/CD for public repos

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
