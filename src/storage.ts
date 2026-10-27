import AsyncStorage from '@react-native-async-storage/async-storage';

// Mirrors `struct Bot` in the iOS tester app (BotModel.swift).
export type BotVersion = 1 | 2 | 3;
export type ActivationMode = 'chat' | 'voice';

export interface Bot {
  id: string;
  name: string;
  ymAuthToken: string;
  customBaseURL: string;
  apiKey: string;
  version: BotVersion;
  enableSpeech: boolean;
  enableLiteVersion: boolean;
  enableNotification: boolean;
  date: number; // epoch ms, used to sort the profile list (newest first)
  payload: string; // raw JSON text, validated in the Payload screen
  activationMode: ActivationMode;
  initialUserMessage: string;
}

const BOT_PREFIX = 'bot-';
const FCM_TOKEN_KEY = 'fcmToken';

export async function getBotList(): Promise<Bot[]> {
  const keys = (await AsyncStorage.getAllKeys()).filter(k => k.startsWith(BOT_PREFIX));
  const entries = await AsyncStorage.multiGet(keys);
  const bots: Bot[] = [];
  for (const [, value] of entries) {
    if (!value) {
      continue;
    }
    try {
      bots.push(JSON.parse(value));
    } catch {
      // Skip a corrupt entry rather than breaking the whole list.
    }
  }
  return bots.sort((a, b) => b.date - a.date);
}

export async function getBot(botId: string): Promise<Bot | null> {
  const value = await AsyncStorage.getItem(BOT_PREFIX + botId);
  return value ? JSON.parse(value) : null;
}

export async function saveBot(bot: Bot): Promise<void> {
  await AsyncStorage.setItem(BOT_PREFIX + bot.id, JSON.stringify(bot));
}

export async function deleteBot(botId: string): Promise<void> {
  await AsyncStorage.removeItem(BOT_PREFIX + botId);
}

export async function getFcmToken(): Promise<string> {
  return (await AsyncStorage.getItem(FCM_TOKEN_KEY)) ?? '';
}

export async function setFcmToken(token: string): Promise<void> {
  await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
}

export function isValidPayload(text: string): boolean {
  if (text.trim() === '') {
    return true;
  }
  try {
    const parsed = JSON.parse(text);
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
  } catch {
    return false;
  }
}
