# Installation and running instructions for SawmillCalculator

## Prerequisites
1. Install [Node.js](https://nodejs.org/) (LTS recommended)

## Local Development
1. Clone Repo
2. Run `npm install` to install dependencies
3. To preview in a browser: `npm i http-server -g` then run `http-server` from the `www` folder

## Capacitor Setup
This project uses [Capacitor](https://capacitorjs.com/) for native builds.

- **Web directory:** `www/` (vanilla JS, no build step needed)
- **Config:** `capacitor.config.json`
- **Android platform:** `android/`

To sync web assets to the native project after making changes to `www/`:
```
npx cap sync
```

To open the Android project in Android Studio:
```
npx cap open android
```

## Capawesome Cloud Builds
This project uses [Capawesome Cloud](https://cloud.capawesome.io/) for native builds.

- **Config:** `capawesome.config.json`
- Push to the repository to trigger a build, or use the Capawesome Cloud CLI.

## Generating Icons and Splash Screens
`https://pgicons.abiro.com/`

`https://pgicons.abiro.com/config.xml`

## Key Instructions (iOS Signing)
1. Create a CSR with keychain access. Use the Keychain Access Menu
1. Upload this to developer.apple.com and get a .cer file
1. Import the .cer file into Keychain Access.
1. Export this as a p12 certificate with the private key.
1. Get a publish profile from developer.apple.com.
1. Upload these to the build service.

https://community.telligent.com/community/9/w/user-documentation/52415/convert-a-cer-file-to-a-p12-file
