import React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {colors} from '../components';

const appVersion: string = require('../../package.json').version;
const pluginVersion: string = require('ymchat-react-native/package.json').version;
const rnVersion = Platform.constants.reactNativeVersion;

function Row({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export default function InfoScreen() {
  return (
    <View style={styles.container}>
      <Row label="App Version" value={appVersion} />
      <Row label="ymchat-react-native" value={pluginVersion} />
      <Row label="React Native" value={`${rnVersion.major}.${rnVersion.minor}.${rnVersion.patch}`} />
      <Row label="Platform" value={`${Platform.OS} ${Platform.Version}`} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, paddingTop: 12},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {fontSize: 16, color: colors.text},
  value: {fontSize: 16, color: colors.muted},
});
