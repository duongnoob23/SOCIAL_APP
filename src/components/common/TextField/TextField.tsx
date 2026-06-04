import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { forwardRef, memo, useEffect, useRef, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet, TextInput } from 'react-native';
import { mask as rnmtMask, unMask as rnmtUnMask } from 'react-native-mask-text';
import { Box } from '@/components/common/Layout/Box';
import { getFontFamily, Text } from '@/components/common/Text/Text';
import { useTheme } from '@react-navigation/native';
import type { TextFieldProps } from '@/components/common/TextField/types';
import { FontSize } from '@/theme/fonts';
import { ErrorText } from '@/features/auth/components/ErrorText';

const TextField = forwardRef<any, TextFieldProps>(
  (
    {
      label,
      error,
      hint,
      left,
      right,
      onChange,
      inputStyle,
      editable = true,
      disabled = false,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      onLayout: onLayoutProp,
      isOptional,
      onPressIconRight,
      onPressIconLeft,
      innerInputWrapper,
      inputErrorStyle,
      containerStyle,
      value,
      mask,
      borderBottomColor,
      iconRightStyle,
      labelColor,
      useBottomSheetInput,
      toolTip,
      toolTipStyle,
      onPressToolTip,
      ...props
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [placeholder, setPlaceholder] = useState<string>('');
    const InputComponent = useBottomSheetInput
      ? BottomSheetTextInput
      : TextInput;

    const handleOnChangeText = (text: string) => {
      if (typeof onChange === 'function') {
        onChange(text, mask ? rnmtUnMask(text, mask.type) : undefined);
      }
      if (typeof props.onChangeText === 'function') {
        props.onChangeText(text);
      }
    };

    const onFocus = () => {
      onFocusProp?.();
      setIsFocused(true);
    };

    const onBlur = () => {
      onBlurProp?.();
      setIsFocused(false);
    };

    const onLayout = (e: LayoutChangeEvent) => {
      onLayoutProp?.(e);
    };
    const placeholderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const displayedValue =
      mask && value
        ? rnmtMask(value, mask.pattern, mask.type, mask.options)
        : value?.toString();

    useEffect(() => {
      if (!isFocused) {
        const placeholderProp = props.placeholder;
        if (placeholderProp) {
          // Show placeholder immediately if there's no value, otherwise use the delay
          if (!value || value.length === 0) {
            setPlaceholder(placeholderProp);
          } else {
            placeholderTimer.current = setTimeout(
              () => setPlaceholder(placeholderProp),
              50,
            );
          }
        }
      } else {
        setPlaceholder('');
      }

      return () => {
        if (placeholderTimer.current) {
          clearTimeout(placeholderTimer.current);
          placeholderTimer.current = null;
        }
      };
    }, [isFocused, label, props.placeholder, value]);

    return (
      <Box
        mb={16}
        gap={6}
        opacity={disabled ? 0.7 : 1}
        style={[styles.inputContainerStyle, containerStyle]}
      >
        <Box flexDirection={'row'} alignItems='center'>
          <Text
            fontSize={FontSize.MEDIUM}
            fontWeight='medium'
            color={labelColor ? labelColor : colors.text}
          >
            {label}
            {isOptional && (
              <Text color={labelColor ? labelColor : colors.text}>
                {' (optional)'}
              </Text>
            )}
          </Text>
          {toolTip && (
            <Box onPress={onPressToolTip} style={toolTipStyle}>
              {React.isValidElement(toolTip)
                ? toolTip
                : React.createElement(toolTip)}
            </Box>
          )}
        </Box>

        <Box
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          w={'100%'}
          minH={48}
          // mb={12}
          gap={8}
          style={[
            styles.containerInput,
            {
              borderColor: error
                ? colors.error
                : isFocused
                  ? colors.primary
                  : colors.border,
              backgroundColor: error
                ? colors.errorInputBg
                : isFocused
                  ? colors.authentication.inputFocusBg
                  : colors.authentication.card,
            },
            innerInputWrapper,
          ]}
        >
          {left && (
            <Box onPress={onPressIconLeft}>
              {React.isValidElement(left) ? left : React.createElement(left)}
            </Box>
          )}

          <InputComponent
            {...props}
            ref={ref}
            autoCorrect={false}
            selectionColor={props?.selectionColor}
            placeholderTextColor={
              props?.placeholderTextColor || colors.placeholder
            }
            value={displayedValue}
            placeholder={placeholder}
            onLayout={onLayout}
            onChangeText={handleOnChangeText}
            onChange={props.onChangeEvent}
            onFocus={onFocus}
            onBlur={onBlur}
            style={[
              styles.inputText,
              { color: disabled ? colors.text : colors.text },
              inputStyle,
              inputErrorStyle,
            ]}
            editable={!disabled && editable}
          />

          {right && (
            <Box onPress={onPressIconRight} style={iconRightStyle}>
              {React.isValidElement(right) ? right : React.createElement(right)}
            </Box>
          )}
        </Box>
        {(!isEmpty(hint) || !isEmpty(error)) && (
          // <Text color={colors.error}>{error || hint}</Text>
          <ErrorText>{error || hint}</ErrorText>
        )}
      </Box>
    );
  },
);

TextField.displayName = 'TextField';

export default memo(TextField);

const styles = StyleSheet.create({
  inputContainerStyle: {},
  inputText: {
    flex: 1,
    fontSize: FontSize.LARGE,
    fontFamily: getFontFamily(),
    paddingHorizontal: 12, // fix padding in android input
  },
  inputStyleError: {
    fontSize: FontSize.LARGE,
    lineHeight: 24,
  },
  containerInput: {
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 6,
  },
  mgBottom: {
    marginBottom: 12,
  },
});
