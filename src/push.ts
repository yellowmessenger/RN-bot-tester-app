import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {setFcmToken} from './storage';

// Equivalent of the Firebase setup in the iOS tester app's AppDelegate:
// ask for notification permission, then store the FCM token so profiles with
// "Push Notification" enabled can pass it to the SDK as the device token.
export async function initPush(): Promise<void> {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
    await messaging().requestPermission();
    await setFcmToken(await messaging().getToken());
    messaging().onTokenRefresh(setFcmToken);
  } catch (e) {
    // Firebase isn't configured (e.g. no google-services.json) or the device
    // can't get a token. The bot still works; only push testing is affected.
    console.log('[push] Push notifications not set up (optional):', e);
  }
}
