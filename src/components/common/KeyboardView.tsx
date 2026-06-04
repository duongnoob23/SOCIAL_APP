import React from 'react';
import type { KeyboardAvoidingViewProps } from 'react-native-keyboard-controller';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type KeyboardViewProps = KeyboardAvoidingViewProps & {
  children: React.ReactNode;

  disableKeyboardAvoid?: boolean;

  maintainScrollPosition?: boolean;

  keyboardOffset?: number;
};

const KeyboardView = ({ 
  children, 
  disableKeyboardAvoid = true,
  keyboardOffset = 0,
  ...props 
}: KeyboardViewProps) => (
  <KeyboardAwareScrollView
    keyboardShouldPersistTaps='handled'
    keyboardDismissMode='interactive'
    alwaysBounceVertical={false}
    // Disable keyboard avoiding nếu cần
    enabled={!disableKeyboardAvoid}
    // Control scroll behavior
    bottomOffset={keyboardOffset}
    // Thêm extraKeyboardSpace để tránh đẩy content lên quá cao
    extraKeyboardSpace={disableKeyboardAvoid ? 0 : 120}
    {...props}
  >
    {children}
  </KeyboardAwareScrollView>
);

export default KeyboardView;