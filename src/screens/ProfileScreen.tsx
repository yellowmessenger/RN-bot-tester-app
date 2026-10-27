import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors, Field, Input, Segmented, SwitchRow} from '../components';
import type {ProfilesStackParamList} from '../navigation';
import {ActivationMode, Bot, BotVersion, getBot, saveBot} from '../storage';

type Props = NativeStackScreenProps<ProfilesStackParamList, 'Profile'>;

export default function ProfileScreen({navigation, route}: Props) {
  const editBotId = route.params?.botId;
  const isEditing = editBotId !== undefined;

  const [botId, setBotId] = useState(editBotId ?? '');
  const [name, setName] = useState('');
  const [version, setVersion] = useState<BotVersion>(1);
  const [activationMode, setActivationMode] = useState<ActivationMode>('chat');
  const [initialUserMessage, setInitialUserMessage] = useState('');
  const [enableSpeech, setEnableSpeech] = useState(false);
  const [enableLiteVersion, setEnableLiteVersion] = useState(false);
  const [ymAuthToken, setYmAuthToken] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [enableNotification, setEnableNotification] = useState(false);
  const [customBaseURL, setCustomBaseURL] = useState('');
  const [payload, setPayload] = useState('');

  const isV3 = version === 3;

  useEffect(() => {
    if (!editBotId) {
      return;
    }
    getBot(editBotId).then(bot => {
      if (!bot) {
        Alert.alert('Error', `Cannot find bot ${editBotId}. Please reinstall the app`);
        return;
      }
      setName(bot.name);
      setVersion(bot.version);
      setActivationMode(bot.activationMode);
      setInitialUserMessage(bot.initialUserMessage);
      setEnableSpeech(bot.enableSpeech);
      setEnableLiteVersion(bot.enableLiteVersion);
      setYmAuthToken(bot.ymAuthToken);
      setApiKey(bot.apiKey);
      setEnableNotification(bot.enableNotification);
      setCustomBaseURL(bot.customBaseURL);
      setPayload(bot.payload);
    });
  }, [editBotId]);

  // Payload screen hands the edited JSON back through route params.
  useEffect(() => {
    if (route.params?.payload !== undefined) {
      setPayload(route.params.payload);
    }
  }, [route.params?.payload]);

  const save = async () => {
    const id = botId.trim();
    if (!id) {
      Alert.alert('Error', 'Bot ID cannot be empty');
      return;
    }
    const bot: Bot = {
      id,
      name: name.trim(),
      ymAuthToken: ymAuthToken.trim(),
      customBaseURL: customBaseURL.trim(),
      apiKey: apiKey.trim(),
      version,
      enableSpeech,
      enableLiteVersion,
      enableNotification,
      date: Date.now(),
      payload,
      activationMode,
      initialUserMessage: initialUserMessage.trim(),
    };
    await saveBot(bot);
    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Profile' : 'Add Profile',
      headerRight: () => (
        <Pressable onPress={save} hitSlop={12}>
          <Text style={styles.headerButton}>Save</Text>
        </Pressable>
      ),
    });
  });

  const openPayload = () => {
    if (!botId.trim()) {
      Alert.alert('', 'Enter the bot id first');
      return;
    }
    navigation.navigate('Payload', {botId: botId.trim(), payload});
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Field label="Bot Id">
        <Input
          value={botId}
          onChangeText={setBotId}
          editable={!isEditing}
          placeholder="x0123456789"
        />
      </Field>
      <Field label="Name">
        <Input value={name} onChangeText={setName} placeholder="Label for this profile" />
      </Field>
      <Field label="Version">
        <Segmented
          options={[
            {label: 'v1', value: 1 as BotVersion},
            {label: 'v2', value: 2 as BotVersion},
            {label: 'v3', value: 3 as BotVersion},
          ]}
          value={version}
          onChange={setVersion}
        />
      </Field>

      {isV3 ? (
        <>
          <Field label="Activation Mode">
            <Segmented
              options={[
                {label: 'chat', value: 'chat' as ActivationMode},
                {label: 'voice', value: 'voice' as ActivationMode},
              ]}
              value={activationMode}
              onChange={setActivationMode}
            />
          </Field>
          <Field label="Initial Message">
            <Input
              value={initialUserMessage}
              onChangeText={setInitialUserMessage}
              placeholder="Optional"
              autoCapitalize="sentences"
            />
          </Field>
        </>
      ) : (
        <>
          <SwitchRow label="Enable Speech" value={enableSpeech} onValueChange={setEnableSpeech} />
          <SwitchRow
            label="Use Lite Version"
            value={enableLiteVersion}
            onValueChange={setEnableLiteVersion}
          />
        </>
      )}

      <Field label="YMAuthToken">
        <Input value={ymAuthToken} onChangeText={setYmAuthToken} placeholder="Optional" />
      </Field>
      <Field label="Api Key">
        <Input
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Needed for Register / Unlink device"
        />
      </Field>
      <SwitchRow
        label="Push Notification"
        value={enableNotification}
        onValueChange={setEnableNotification}
      />
      <Field label="Custom Base URL">
        <Input
          value={customBaseURL}
          onChangeText={setCustomBaseURL}
          placeholder="Leave empty for the default region"
          keyboardType="url"
        />
      </Field>
      <Pressable onPress={openPayload}>
        <Field label="Payload ›">
          <Text style={styles.payload} numberOfLines={4}>
            {payload || 'Tap to add a JSON payload'}
          </Text>
        </Field>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  headerButton: {fontSize: 17, color: colors.link, fontWeight: '600'},
  payload: {fontSize: 14, color: colors.text, fontFamily: 'Courier'},
});
