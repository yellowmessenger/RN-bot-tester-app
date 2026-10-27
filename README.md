# Yellow.ai Chatbot SDK: React Native Demo App

A sample React Native app that shows how to add a Yellow.ai chatbot to a React Native app with the [`ymchat-react-native`](https://www.npmjs.com/package/ymchat-react-native) plugin. It runs on iOS and Android.

Use it to:

- **See your bot running in a mobile app in a few minutes**, before you write any integration code.
- **Try different settings** (v1, v2 or v3 widget, auth token, payload, region) without rebuilding.
- **Copy working integration code**: starting the bot, listening to bot events, and registering for push notifications.

| | Version |
|---|---|
| React Native | 0.76.5 (New Architecture) |
| ymchat-react-native | 3.5.8 |
| Minimum OS | iOS 15.1 / Android 7.0 |

For the full SDK reference, see the [React Native SDK docs](https://docs.yellow.ai/docs/platform_concepts/mobile/chatbot/react-native).

## Requirements

- Node 18 or later
- **iOS:** a Mac with Xcode and CocoaPods (`brew install cocoapods`)
- **Android:** JDK 17 and the Android SDK (API 35), easiest through Android Studio
- Your bot's **Bot ID**. Open your bot on the [Yellow.ai platform](https://cloud.yellow.ai); the Bot ID is in the URL and starts with `x` (for example `x1587041004122`).

## Run the app

```bash
npm install
cd ios && pod install && cd ..

npm start          # starts Metro; keep it running
npm run ios        # in a second terminal
npm run android
```

## Try your bot

### Quick Start

Enter your **Bot ID** and tap **Start Chat Bot**. The bot opens with default settings: v1 widget, no auth token, no payload.

### Profiles

Save a bot with specific settings and reuse it. Profiles are stored on the device.

1. Open the **Profiles** tab and tap **＋**.
2. Fill in the fields you need:

   | Field | What it does |
   |---|---|
   | Bot ID | Your bot's ID. Required. To change it later, delete the profile and add it again. |
   | Name | A label for the profile list. |
   | Version | Which chat widget to load: `v1`, `v2` or `v3`. |
   | Activation Mode | **v3 only.** Open the widget in `chat` or `voice` mode. |
   | Initial Message | **v3 only.** A message to start the conversation with. |
   | Enable Speech | **v1/v2 only.** Adds voice input to the widget. |
   | Use Lite Version | **v1/v2 only.** Loads the lite widget. |
   | YMAuthToken | A token that identifies the user, for bots that need an authenticated session. |
   | Api Key | Your Yellow.ai API key. Needed only for **Register Device** and **Unlink Device Token**. |
   | Push Notification | Sends this device's push token to the bot. Needs Firebase (see below). |
   | Custom Base URL | Leave empty if your bot is in the default region. For other regions use `https://rx.cloud.yellow.ai` (for example `https://r5.cloud.yellow.ai`), or your on-premise URL. |
   | Payload | Any JSON object you want to send to the bot when the chat starts, such as user details. Must be valid JSON. |

3. Tap **Save**, then tap the profile:
   - **Start Bot** opens the chat with this profile's settings.
   - **Register Device** links this device to the user for push notifications. Shown when Api Key, YMAuthToken and Push Notification are set.
   - **Unlink Device Token** stops push notifications to this device, for example on logout. Shown when Api Key and Push Notification are set.
   - **Edit** / **Delete**

### Info

Shows the app version, the `ymchat-react-native` version, the React Native version and the platform.

## Push notifications (optional)

The app runs without Firebase. To test push notifications from your bot:

1. In your own [Firebase project](https://console.firebase.google.com), add an iOS and/or Android app with the ID `ai.yellow.demoapp`.
2. **iOS:** upload your APNs key to Firebase, then download `GoogleService-Info.plist` and put it in `ios/YellowBot/`. You don't need to add it in Xcode; the build picks it up from there, and it's gitignored. Push on a real device needs a bundle ID and signing team from your Apple Developer account.
3. **Android:** download `google-services.json` and put it in `android/app/`.
4. Map your Firebase service account key to your Bot ID, as described in [Push notifications for mobile SDKs](https://docs.yellow.ai/docs/platform_concepts/mobile/chatbot/sdk-faq-worflows/push-notifications-sdks).
5. Rebuild, turn on **Push Notification** in a profile, and use **Register Device**.

## Integration code to reuse

| File | What to look at |
|---|---|
| `src/chatbot.ts` | Turning your settings into the `YMChat` config, starting the bot, registering and unlinking the device |
| `App.tsx` | Listening to bot events (`YMChatEvent`, `YMBotCloseEvent`) |
| `src/push.ts` | Asking for notification permission and getting the Firebase push token |
| `ios/Podfile` | iOS build settings the plugin needs (see tips) |

## Tips for your own integration

- **Android:** the plugin keeps the previous bot's payload when you call `setBotId`. Always set the payload when you start the bot, even if it's an empty `{}`.
- **iOS:** the app's `ios/Podfile` raises every pod to iOS 15.1, because current Xcode versions won't build pods that target older iOS versions. Copy that `post_install` block if your build fails with a deployment target error.
- **iOS 27:** apps must use the UIScene lifecycle or they crash at launch. See `ios/YellowBot/SceneDelegate.mm` for how this app does it.
- `YMBotCloseEvent` currently fires twice on Android when the bot closes. Make your close handler safe to run twice.

## Help

- [React Native SDK docs](https://docs.yellow.ai/docs/platform_concepts/mobile/chatbot/react-native)
- [Mobile SDK FAQ](https://docs.yellow.ai/docs/platform_concepts/mobile/chatbot/sdk-faq-worflows/mobile-sdk-faq)
- Email [apps@yellow.ai](mailto:apps@yellow.ai)
