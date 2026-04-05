# Deploying an Android AAB to Google Play with Managed Signing via Capawesome Cloud

This guide walks through the complete process of building and submitting an Android App Bundle (AAB) to Google Play using **Capawesome Cloud Native Builds** with **Google Play Managed App Signing**.

---

## Understanding the Error

```
Google Api Error: Invalid request - For uploading an AppBundle you must be enrolled in Play Signing.
```

This error means your app in Google Play Console is **not enrolled in Google Play App Signing**. When uploading an AAB (as opposed to an APK), Google Play **requires** that you use their managed signing service. Google holds the actual app signing key, and you sign your uploads with a separate **upload key**.

---

## How Google Play Managed Signing Works

There are two keys involved:

| Key                 | Who Holds It          | Purpose                                                               |
| ------------------- | --------------------- | --------------------------------------------------------------------- |
| **App Signing Key** | Google Play (managed) | Signs the final APK delivered to users' devices                       |
| **Upload Key**      | You (via keystore)    | Signs the AAB/APK you upload to Google Play to prove it came from you |

Capawesome Cloud signs your build with your **upload key**. Google Play then verifies the upload signature, strips it, and re-signs the app with the **app signing key** before delivering it to users.

---

## Step-by-Step Setup

### Step 1: Enroll in Google Play App Signing

> **This step is done in Google Play Console and is the root cause of the error.**

1. Sign in to [Google Play Console](https://play.google.com/console).
2. Select your app (or create a new app entry if you haven't yet).
3. In the left menu, go to **Setup > App signing** (under "App integrity" in some layouts).
4. If you see the option to **Opt in to Play App Signing**, follow the prompts.
   - **For a new app that has never been published:** Google automatically generates and manages the app signing key for you. You just need to create and upload an **upload key** (see Step 2).
   - **For an existing app that was previously signed with your own key:** You'll need to export and upload your existing app signing key to Google, or let Google generate a new one. Follow the on-screen instructions to transfer your key.
5. Once enrolled, the **App signing** page will show the certificates for both the **App signing key** and the **Upload key**.

> **Important:** Enrollment in Play App Signing is **irreversible**. Once enrolled, Google manages the app signing key permanently.

### Step 2: Create an Upload Keystore

You need a keystore file containing your **upload key**. This is the key Capawesome Cloud will use to sign the AAB before uploading to Google Play.

#### Option A: Use the Capawesome Online Generator

1. Go to the [Capawesome Android Keystore Generator](https://cloud.capawesome.io/tools/android-keystore-generator/).
2. Fill in the required fields (name, organization, etc.).
3. Download the generated `.jks` file.
4. **Save the keystore password, key alias, and key password** — you will need all three.

#### Option B: Use `keytool` (Command Line)

Run the following command:

```bash
keytool -genkey -v -keystore upload-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload-key-alias
```

You will be prompted to:

1. Enter a password for the keystore.
2. Enter your name and organizational information.
3. Enter a password for the key (press Enter to use the same password as the keystore).

The file `upload-key.jks` will be created in your current directory.

#### Option C: Use Android Studio

1. Open Android Studio.
2. Click **Build > Generate Signed Bundle / APK**.
3. Choose **Android App Bundle** and click **Next**.
4. Click **Create new...** to generate a new keystore.
5. Fill in the fields:
   - **Key store path:** Choose a location (e.g., `upload-key.jks`).
   - **Password:** Set a strong password.
   - **Alias:** e.g., `upload-key-alias`.
   - **Key password:** Set a password.
   - **Validity:** 25 years.
   - **Certificate:** Fill in your info.
6. Click **OK**.

> **Keep your keystore file and passwords secure.** If you lose the upload key, you can reset it through Google Play Console, but losing it creates downtime.

### Step 3: Register the Upload Key with Google Play

After creating your upload keystore, you need to tell Google Play about it:

1. In Google Play Console, go to **Setup > App signing**.
2. Under **Upload key certificate**, you may need to register your upload key.
3. To get the certificate fingerprint from your keystore, run:

   ```bash
   keytool -list -v -keystore upload-key.jks -alias upload-key-alias
   ```

4. Google Play may also allow you to upload the certificate directly (a `.pem` file). To export it:

   ```bash
   keytool -export -rfc -keystore upload-key.jks -alias upload-key-alias -file upload-cert.pem
   ```

5. Upload the `.pem` certificate to Google Play Console under the **Upload key** section if prompted.

> **Note:** For **new apps** that have never been published, Google Play typically generates both keys when you upload your first AAB. In that case, the keystore you use to sign that first upload automatically becomes your upload key — no separate registration step is needed.

### Step 4: Add the Signing Certificate in Capawesome Cloud

1. Sign in to [Capawesome Cloud Console](https://console.cloud.capawesome.io/).
2. Select your app and navigate to **Signing Certificates**.
3. Click to add a new certificate and fill in:
   - **Name:** e.g., `Production Android Upload Key`
   - **Platform:** `Android`
   - **Type:** `Production`
   - **Keystore File:** Upload your `upload-key.jks` file
   - **Keystore Password:** The password you set when creating the keystore
   - **Key Alias:** The alias you chose (e.g., `upload-key-alias`)
   - **Key Password:** The key-specific password
4. Save the certificate.

### Step 5: Configure the Google Play Store Destination

This sets up the automated submission from Capawesome Cloud to Google Play.

1. In Capawesome Cloud Console, navigate to your app's **Destinations** page.
2. Create a new destination with:
   - **Name:** e.g., `Google Play Internal` or `Google Play Production`
   - **Type:** `Android`
   - **Track:** Choose one of `Internal`, `Alpha`, `Beta`, or `Production`
   - **Package Name:** `net.micapeak.SawmillCalculatorPro`
   - **Publishing Format:** `AAB`
   - **Release Status:** `Draft` for the first release, `Completed` for subsequent releases
   - **JSON Key File:** Upload the service account JSON key (see Step 6)
3. Save the destination.

### Step 6: Create a Google Cloud Service Account

A service account JSON key is required for Capawesome Cloud to upload builds to Google Play on your behalf.

1. Sign in to [Google Cloud Console](https://console.cloud.google.com/).
2. Navigate to **IAM & Admin > Service Accounts**.
3. Click **Create Service Account**.
4. Fill in the service account details (e.g., name: `capawesome-play-publisher`) and click **Create and Continue**.
5. Assign the role **Service Account User** and click **Continue**.
6. Click **Done**.
7. In the service accounts list, find the new account. **Copy its email address.** Then click the **Actions** menu > **Manage keys**.
8. In the **Keys** tab, click **Add Key > Create new key**.
9. Select **JSON** and click **Create**. Save the downloaded file.
10. Sign in to [Google Play Console](https://play.google.com/console).
11. Go to **Users and Permissions** and click **Invite new user**.
12. Paste the service account email address.
13. Click on the invited user, go to the **App permissions** tab, and add your app.
14. In the permissions dialog, check **all permissions in the Release section** at minimum.
15. Click **Apply**, then **Invite User**.

Upload this JSON key file when configuring your Google Play Store destination in Step 5.

### Step 7: Do the First Manual Upload (New Apps Only)

> **Google Play requires the very first version of your app to be uploaded manually.** This is a Google requirement, not a Capawesome limitation.

1. Build a **Release** AAB from Capawesome Cloud (see Step 8).
2. Download the built AAB artifact from the Capawesome Cloud build details page.
3. In Google Play Console, go to your app's **Internal testing** (or whichever track you want).
4. Click **Create new release**.
5. Upload the AAB file manually.
6. Fill in the release notes and review.
7. Click **Save** and then **Review release** and **Start rollout**.

After this first manual upload, Capawesome Cloud can handle all subsequent submissions automatically.

### Step 8: Trigger a Release Build in Capawesome Cloud

1. In Capawesome Cloud Console, go to your app's **Builds** page.
2. Click **Build from Git**.
3. Select your Git reference (branch, tag, or commit).
4. Set:
   - **Platform:** `Android`
   - **Build Type:** `Release`
   - **Signing Certificate:** Select the upload key certificate you added in Step 4
5. Click **Build** and wait for completion.

The AAB will be signed with your upload key. If you have set up a destination (Step 5) and it's configured for auto-submission, the build will be automatically submitted to Google Play after a successful build.

---

## Troubleshooting

### "For uploading an AppBundle you must be enrolled in Play Signing"

- You haven't enrolled in Google Play App Signing in Google Play Console.
- Go to **Setup > App signing** in Google Play Console and complete enrollment.

### "The Android App Bundle was not signed"

- No signing certificate was selected when triggering the build in Capawesome Cloud.
- Ensure you selected your upload key certificate and chose the **Release** build type.

### Upload succeeds but Play Console rejects with "upload certificate mismatch"

- The upload key in your Capawesome Cloud signing certificate doesn't match what Google Play expects.
- In Google Play Console, go to **Setup > App signing** and check the **Upload key certificate** fingerprint.
- Compare it against your keystore: `keytool -list -v -keystore upload-key.jks`
- If they don't match, you may need to reset the upload key in Google Play Console.

### "The first APK or Android App Bundle must be uploaded manually"

- Google requires the very first artifact to be uploaded through the Google Play Console UI.
- Download the AAB from Capawesome Cloud and upload it manually. Subsequent uploads can be automated.

### "You must declare the use of advertising ID in Play Console"

- Apps targeting Android 13 (API 33) or above must declare advertising ID usage in the Google Play Console.
- This is a **Play Console setting**, not a code change. The `AndroidManifest.xml` already includes `tools:node="remove"` for the AD_ID permission.
- Go to **Google Play Console** → select your app → **Policy and programs** → **App content** → **Advertising ID** → select **"No"** → **Save**.
- This is a one-time declaration. Once set, subsequent uploads will succeed.

### Service account permission errors

- Ensure the service account has been granted **Release** permissions for your specific app in Google Play Console under **Users and Permissions > App permissions**.
- Permissions can take up to 24 hours to propagate.

---

## Quick Reference: Capawesome Cloud Config Summary

| Setting                          | Value for This Project               |
| -------------------------------- | ------------------------------------ |
| **App ID**                       | `net.micapeak.SawmillCalculatorPro`  |
| **Platform**                     | Android                              |
| **Build Type**                   | Release                              |
| **Signing Certificate Platform** | Android                              |
| **Signing Certificate Type**     | Production                           |
| **Destination Type**             | Android                              |
| **Publishing Format**            | AAB                                  |
| **Destination Track**            | Internal (for testing) or Production |

---

## Reference Links

- [Capawesome Cloud - Native Builds Setup](https://capawesome.io/cloud/native-builds/setup/)
- [Capawesome Cloud - Android Signing Certificates](https://capawesome.io/cloud/native-builds/certificates/android/)
- [Capawesome Cloud - Build Types](https://capawesome.io/cloud/native-builds/build-types/)
- [Capawesome Cloud - Google Play Store Destination](https://capawesome.io/cloud/app-store-publishing/destinations/google-play-store/)
- [Google Play Console - App Signing](https://support.google.com/googleplay/android-developer/answer/9842756)
