import {YMChat, YMChatEvents} from 'ymchat-react-native';
import {Bot, getFcmToken} from './storage';

// Equivalent of `Bot.toYMConfig` in the iOS tester app. setBotId() creates a
// fresh config natively on both platforms, so it must be called first.
async function applyConfig(bot: Bot): Promise<void> {
  YMChat.setBotId(bot.id);
  YMChat.setVersion(bot.version);
  YMChat.showCloseButton(true);

  if (bot.version === 3) {
    YMChat.setActivationMode(bot.activationMode);
    if (bot.initialUserMessage) {
      YMChat.setInitialUserMessage(bot.initialUserMessage);
    }
  } else {
    YMChat.setEnableSpeech(bot.enableSpeech);
    // SDK setter, not a React hook — the "use" prefix trips the hooks lint rule.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    YMChat.useLiteVersion(bot.enableLiteVersion);
  }

  if (bot.ymAuthToken) {
    YMChat.setAuthenticationToken(bot.ymAuthToken);
  }
  if (bot.enableNotification) {
    YMChat.setDeviceToken(await getFcmToken());
  }
  if (bot.customBaseURL) {
    YMChat.setCustomURL(bot.customBaseURL);
  }
  // Always set the payload: on Android the previous bot's payload otherwise
  // carries over into the next config.
  YMChat.setPayload(bot.payload.trim() ? JSON.parse(bot.payload) : {});
}

export async function startBot(bot: Bot): Promise<void> {
  await applyConfig(bot);
  YMChat.startChatbot();
}

// Quick Start: bot id only, everything else at SDK defaults.
export function quickStart(botId: string): void {
  YMChat.setBotId(botId);
  YMChat.setPayload({});
  YMChat.showCloseButton(true);
  YMChat.startChatbot();
}

export async function registerDevice(bot: Bot): Promise<void> {
  await applyConfig(bot);
  await YMChat.registerDevice(bot.apiKey);
}

export async function unlinkDeviceToken(bot: Bot): Promise<void> {
  await YMChat.unlinkDeviceToken(bot.id, bot.apiKey, await getFcmToken());
}

export {YMChatEvents};
