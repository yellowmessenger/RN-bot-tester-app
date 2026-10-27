import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

export const colors = {
  primary: '#F97316',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  background: '#F9FAFB',
  card: '#FFFFFF',
  danger: '#DC2626',
  link: '#2563EB',
};

export function Field({label, children}: {label: string; children: React.ReactNode}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

export function Input(props: TextInputProps) {
  return (
    <TextInput
      autoCapitalize="none"
      autoCorrect={false}
      placeholderTextColor={colors.muted}
      {...props}
      style={[styles.input, props.editable === false && styles.inputDisabled, props.style]}
    />
  );
}

export function SwitchRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={[styles.field, styles.switchRow]}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: {label: string; value: T}[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map(o => {
        const selected = o.value === value;
        return (
          <Pressable
            key={String(o.value)}
            onPress={() => onChange(o.value)}
            style={[styles.segment, selected && styles.segmentSelected]}>
            <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function PrimaryButton({title, onPress}: {title: string; onPress: () => void}) {
  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [styles.button, pressed && styles.buttonPressed]}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export type SheetAction = {title: string; onPress: () => void; destructive?: boolean};

// Cross-platform replacement for the iOS app's UIAlertController action sheet
// (Android's Alert only supports three buttons).
export function ActionSheet({
  visible,
  title,
  actions,
  onClose,
}: {
  visible: boolean;
  title: string;
  actions: SheetAction[];
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{title}</Text>
          {actions.map(a => (
            <Pressable
              key={a.title}
              style={styles.sheetButton}
              onPress={() => {
                onClose();
                // Let the modal finish dismissing first: on iOS the SDK presents
                // the bot on the top-most view controller.
                setTimeout(a.onPress, 400);
              }}>
              <Text style={[styles.sheetButtonText, a.destructive && {color: colors.danger}]}>
                {a.title}
              </Text>
            </Pressable>
          ))}
          <Pressable style={styles.sheetButton} onPress={onClose}>
            <Text style={[styles.sheetButtonText, styles.cancelText]}>Cancel</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {fontSize: 13, color: colors.muted, marginBottom: 6},
  input: {
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.card,
  },
  inputDisabled: {backgroundColor: colors.background, color: colors.muted},
  switchRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  segmented: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  segment: {flex: 1, paddingVertical: 8, alignItems: 'center'},
  segmentSelected: {backgroundColor: colors.primary},
  segmentText: {color: colors.primary, fontWeight: '600'},
  segmentTextSelected: {color: '#FFFFFF'},
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonPressed: {opacity: 0.8},
  buttonText: {color: '#FFFFFF', fontSize: 17, fontWeight: '600'},
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  sheet: {backgroundColor: colors.card, borderRadius: 14, overflow: 'hidden', marginBottom: 12},
  sheetTitle: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 13,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  sheetButton: {
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  sheetButtonText: {fontSize: 17, color: colors.link},
  cancelText: {fontWeight: '600'},
});
