import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import TextField from './TextField';
import type { TextAreaWithCounterProps } from './types';
import { FontSize } from '@/theme/fonts';

const TextAreaWithCounter = forwardRef<TextInput, TextAreaWithCounterProps>(
  (
    {
      label,
      placeholder,
      value = '',
      onChangeText,
      maxLength = 200,
      visibleLines = 4,
      lineHeightPx,
      counterHeightPx,
      containerStyle,
      textAreaStyle,
      counterStyle,
      counterPosition = 'bottom-left',
      showCounter = true,
      counterColor,
      backgroundColor,
      padding,
      paddingHorizontal,
      paddingVertical,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      margin,
      marginHorizontal,
      marginVertical,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      isRequired,
      error,
      ...props
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const { t } = useTranslation('common');
    const [hasBlurred, setHasBlurred] = useState<boolean>(false);
    const innerInputRef = useRef<TextInput | null>(null);

    // Expose the inner input ref to
    useImperativeHandle(ref, () => innerInputRef.current as TextInput);

    const characterCount = value?.length || 0;

    const computedLineHeight = Math.max(1, lineHeightPx ?? 24);
    const safeVisibleLines = Math.max(1, visibleLines ?? 4);
    const computedCounterHeight = showCounter ? Math.max(0, counterHeightPx ?? 20) : 0;
    const computedMinHeight =
      safeVisibleLines * computedLineHeight +
      computedCounterHeight +
      (showCounter ? 8 : 0);

    const getCounterPositionStyle = () => {
      const baseStyle = {
        position: 'absolute' as const,
        zIndex: 1,
        pointerEvents: 'none' as const,
      };

      switch (counterPosition) {
        case 'bottom-right':
          return { ...baseStyle, bottom: 8, right: 12 };
        case 'top-left':
          return { ...baseStyle, top: 8, left: 12 };
        case 'top-right':
          return { ...baseStyle, top: 8, right: 12 };
        case 'bottom-left':
        default:
          return { ...baseStyle, bottom: 8, left: 12 };
      }
    };

    const isValueEmpty = !value || value.toString().trim().length === 0;
    const shouldShowRequiredError = Boolean(
      isRequired && hasBlurred && isValueEmpty,
    );

    return (
      <Box
        style={containerStyle}
        onPress={() => {
          innerInputRef.current?.focus?.();
        }}
        m={margin}
        mx={marginHorizontal}
        my={marginVertical}
        mt={marginTop}
        mr={marginRight}
        mb={marginBottom}
        ml={marginLeft}
        p={padding}
        px={paddingHorizontal}
        py={paddingVertical}
        pt={paddingTop}
        pr={paddingRight}
        pb={paddingBottom}
        pl={paddingLeft}
      >
        <Box position='relative'>
          <TextField
            {...props}
            ref={innerInputRef}
            label={label}
            toolTip={
              isRequired
                ? props.toolTip
                  ? (
                    <Box flexDirection='row' alignItems='center' gap={4}>
                      <Text color={colors.error}> *</Text>
                      {typeof props.toolTip === 'string' ? (
                        <Text>{props.toolTip}</Text>
                      ) : (
                        props.toolTip as React.ReactElement
                      )}
                    </Box>
                  )
                  : <Text color={colors.error}>*</Text>
                : props.toolTip
            }
            toolTipStyle={props.toolTipStyle}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            maxLength={maxLength}
            multiline
            numberOfLines={safeVisibleLines}
            textAlignVertical='top'
            onBlur={() => {
              setHasBlurred(true);
              props.onBlur?.();
            }}
            error={
              error ?? (shouldShowRequiredError ? t('required') : undefined)
            }
            right={
              showCounter ? (
                <Text
                  fontSize={FontSize.SMALL}
                  color={counterColor || colors.textSecondary}
                  style={counterStyle}
                >
                  {characterCount}/{maxLength}
                </Text>
              ) : undefined
            }
            iconRightStyle={getCounterPositionStyle()}
            innerInputWrapper={{
              backgroundColor: backgroundColor || colors.card,
              borderRadius: 12,
              minHeight: computedMinHeight,
              paddingTop: 0,
              alignItems: 'flex-start',
              // paddingBottom: showCounter ? 28 : 18, // Tạo space cho counter
              ...textAreaStyle,
            }}
          />
        </Box>
      </Box>
    );
  },
);

TextAreaWithCounter.displayName = 'TextAreaWithCounter';

export default memo(TextAreaWithCounter);
