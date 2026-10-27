import React, {useState} from 'react';
import {Alert, Keyboard, StyleSheet, Text, View} from 'react-native';
import {quickStart} from '../chatbot';
import {colors, Input, PrimaryButton} from '../components';

export default function QuickStartScreen() {
  const [botId, setBotId] = useState('');

  const start = () => {
    const id = botId.trim();
    if (!id) {
      Alert.alert('Error', 'Enter a valid bot id to start');
      return;
    }
    Keyboard.dismiss();
    quickStart(id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.intro}>
        Use Quick Start to quickly launch a bot just using bot id.{'\n'}For advanced bot
        configuration and bot storage use Profiles
      </Text>
      <View style={styles.card}>
        <Input
          placeholder="Enter Bot Id. Eg: x0123456789"
          value={botId}
          onChangeText={setBotId}
          returnKeyType="go"
          onSubmitEditing={start}
        />
        <View style={styles.spacer} />
        <PrimaryButton title="Start Chat Bot" onPress={start} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: colors.background},
  intro: {fontSize: 16, color: colors.text, lineHeight: 22, marginBottom: 24},
  card: {backgroundColor: colors.border, borderRadius: 10, padding: 10},
  spacer: {height: 10},
});
