// ymchat-react-native ships index.js without typings; reuse its codegen Spec.
declare module 'ymchat-react-native' {
  import type {NativeEventEmitter} from 'react-native';
  import type {Spec} from 'ymchat-react-native/src/NativeYMChat';

  export const YMChat: Spec;
  export const YMChatEvents: NativeEventEmitter | null;
}
