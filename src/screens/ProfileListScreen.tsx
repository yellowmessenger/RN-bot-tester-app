import React, {useCallback, useLayoutEffect, useState} from 'react';
import {Alert, FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {registerDevice, startBot, unlinkDeviceToken} from '../chatbot';
import {ActionSheet, colors, SheetAction} from '../components';
import type {ProfilesStackParamList} from '../navigation';
import {Bot, deleteBot, getBotList} from '../storage';

type Props = NativeStackScreenProps<ProfilesStackParamList, 'ProfileList'>;

const errorMessage = (e: unknown) => (e instanceof Error ? e.message : String(e));

export default function ProfileListScreen({navigation}: Props) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [selected, setSelected] = useState<Bot | null>(null);

  const reload = useCallback(() => {
    getBotList().then(setBots);
  }, []);

  useFocusEffect(reload);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('Profile', {})} hitSlop={12}>
          <Text style={styles.addButton}>＋</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const actionsFor = (bot: Bot): SheetAction[] => {
    const actions: SheetAction[] = [
      {
        title: '🤖 Start Bot',
        onPress: () => startBot(bot).catch(e => Alert.alert('Error', errorMessage(e))),
      },
    ];
    // Same visibility rules as the iOS tester app.
    if (bot.apiKey && bot.ymAuthToken && bot.enableNotification) {
      actions.push({
        title: 'Register Device',
        onPress: () =>
          registerDevice(bot)
            .then(() => Alert.alert('', 'Device Registered Successfully'))
            .catch(e => Alert.alert('Error', errorMessage(e))),
      });
    }
    if (bot.apiKey && bot.enableNotification) {
      actions.push({
        title: 'Unlink Device Token',
        onPress: () =>
          unlinkDeviceToken(bot)
            .then(() => Alert.alert('', 'Device Unlinked Successfully'))
            .catch(e => Alert.alert('Error', errorMessage(e))),
      });
    }
    actions.push(
      {title: 'Edit', onPress: () => navigation.navigate('Profile', {botId: bot.id})},
      {
        title: 'Delete',
        destructive: true,
        onPress: () => deleteBot(bot.id).then(reload),
      },
    );
    return actions;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bots}
        keyExtractor={b => b.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No profiles yet. Tap ＋ to add a bot.</Text>
        }
        renderItem={({item}) => (
          <Pressable
            style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => setSelected(item)}>
            <View style={styles.rowText}>
              <Text style={styles.name}>{item.name || 'Unnamed'}</Text>
              <Text style={styles.botId}>{item.id}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        )}
      />
      <ActionSheet
        visible={selected !== null}
        title={selected?.id ?? ''}
        actions={selected ? actionsFor(selected) : []}
        onClose={() => setSelected(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.card},
  addButton: {fontSize: 26, color: colors.link},
  row: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14},
  rowPressed: {backgroundColor: colors.border},
  rowText: {flex: 1},
  name: {fontSize: 18, color: colors.text},
  botId: {fontSize: 15, color: colors.muted, marginTop: 2},
  chevron: {fontSize: 24, color: colors.muted},
  separator: {height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: 20},
  empty: {textAlign: 'center', color: colors.muted, marginTop: 40},
});
