/*
 * Capacitor Migration Note:
 * The previous Cordova/PhoneGap bootstrap (deviceready event handling)
 * has been replaced by Capacitor's declarative configuration.
 * Capacitor automatically injects its bridge on native platforms.
 * StatusBar and SplashScreen are configured via capacitor.config.json.
 *
 * The original tests for the Cordova app bootstrap have been removed
 * as they tested PhoneGap-specific initialization that is no longer used.
 */
