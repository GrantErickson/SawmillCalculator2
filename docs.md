# Installation and running instructions for SawmillCalculator

## Generating Icons and Splash Screens
`https://pgicons.abiro.com/`

`https://pgicons.abiro.com/config.xml`


Below doesn't work well.
1. Put the files into a resources folder. 
1. Install Brew: `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
1. Install Node `brew install node`
1. Use: https://www.npmjs.com/package/cordova-res-generator

    `npm install cordova-res-generator -g`

    from root of project: `crgen`


## key instructions
1. Create a CSR with keychain access. Use the Keychain Access Menu
1. Upload this to developer.apple.com and get a .cer file
1. Import the .cer file into Keychain Access.
1. Export this as a p12 certificate with the private key.
1. Get a publish profile from developer.apple.com.
1. Upload these to phonegap. 

https://community.telligent.com/community/9/w/user-documentation/52415/convert-a-cer-file-to-a-p12-file
