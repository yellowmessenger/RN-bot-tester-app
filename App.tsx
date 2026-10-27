import React, {useEffect} from 'react';
import {Alert, StyleSheet, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {YMChatEvents} from './src/chatbot';
import {colors} from './src/components';
import type {ProfilesStackParamList} from './src/navigation';
import {initPush} from './src/push';
import InfoScreen from './src/screens/InfoScreen';
import PayloadScreen from './src/screens/PayloadScreen';
import ProfileListScreen from './src/screens/ProfileListScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import QuickStartScreen from './src/screens/QuickStartScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<ProfilesStackParamList>();

function ProfilesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileList" component={ProfileListScreen} options={{title: 'Profiles'}} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Payload" component={PayloadScreen} />
    </Stack.Navigator>
  );
}

const tabIcon = (glyph: string) => () => <Text style={styles.tabIcon}>{glyph}</Text>;

export default function App() {
  useEffect(() => {
    initPush();

    if (!YMChatEvents) {
      console.warn('[YMChat] native module not found — rebuild the app');
      return;
    }
    const subs = [
      YMChatEvents.addListener('YMChatEvent', e =>
        console.log('[YMChat] event', e?.code, JSON.stringify(e?.data ?? null)),
      ),
      YMChatEvents.addListener('YMBotCloseEvent', () => console.log('[YMChat] bot closed')),
      YMChatEvents.addListener('YMBotLoadFailedEvent', () =>
        Alert.alert('Error', 'Bot failed to load. Check the bot id and network.'),
      ),
    ];
    return () => subs.forEach(s => s.remove());
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{tabBarActiveTintColor: colors.link}}>
          <Tab.Screen
            name="QuickStart"
            component={QuickStartScreen}
            options={{title: 'Quick Start', tabBarIcon: tabIcon('⚡')}}
          />
          <Tab.Screen
            name="Profiles"
            component={ProfilesStack}
            options={{headerShown: false, tabBarIcon: tabIcon('🗂️')}}
          />
          <Tab.Screen name="Info" component={InfoScreen} options={{tabBarIcon: tabIcon('ℹ️')}} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabIcon: {fontSize: 20},
});
