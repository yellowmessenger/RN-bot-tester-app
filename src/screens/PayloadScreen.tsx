import React, {useLayoutEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from '../components';
import type {ProfilesStackParamList} from '../navigation';
import {getBot, isValidPayload, saveBot} from '../storage';

type Props = NativeStackScreenProps<ProfilesStackParamList, 'Payload'>;

export default function PayloadScreen({navigation, route}: Props) {
  const {botId} = route.params;
  const [text, setText] = useState(route.params.payload);

  const save = async () => {
    if (!isValidPayload(text)) {
      Alert.alert('Error', 'Payload not compatible with JSON format');
      return;
    }
    // Like the iOS app, persist straight away if the profile already exists.
    const bot = await getBot(botId);
    if (bot) {
      await saveBot({...bot, payload: text});
    }
    navigation.popTo('Profile', {payload: text}, {merge: true});
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={save} hitSlop={12}>
          <Text style={styles.headerButton}>Save</Text>
        </Pressable>
      ),
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>JSON object sent to the bot as the session payload.</Text>
      <TextInput
        style={styles.editor}
        value={text}
        onChangeText={setText}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={'{\n  "key": "value"\n}'}
        placeholderTextColor={colors.muted}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: colors.background},
  headerButton: {fontSize: 17, color: colors.link, fontWeight: '600'},
  hint: {color: colors.muted, marginBottom: 8},
  editor: {
    flex: 1,
    fontFamily: 'Courier',
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
});
