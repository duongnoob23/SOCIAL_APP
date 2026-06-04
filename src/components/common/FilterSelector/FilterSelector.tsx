import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import { BiFilterLeft } from '@/assets/icons/svg/BiFilterLeft';
import { FontSize } from '@/theme/fonts';
import Button from '@/components/common/Button/Button';
import { RadioGroup } from '@/components/common/RadioGroup/RadioGroup';
import { useBottomSheet } from '@/hooks/useBottomSheet';

export interface FilterOption<T = string> {
  key: T;
  label: string;
  translationKey?: string;
}

interface FilterSelectorProps<T = string> {
  options: FilterOption<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  
  placeholder?: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  
  resetValue?: T;
  resetLabel?: string;
  applyLabel?: string;
}

export default function FilterSelector<T = string>({
  options,
  selectedValue,
  onValueChange,
  placeholder = 'common.select',
  icon,
  style,
  containerStyle,
  buttonStyle,
  textStyle,
  resetValue,
  resetLabel = 'common.reset',
  applyLabel = 'common.apply',
}: FilterSelectorProps<T>) {
  const { colors } = useTheme();
  const { t } = useTranslation('overtime');
  const { t: tCommon } = useTranslation('common');
  const [tempValue, setTempValue] = React.useState<T>(selectedValue);
  const [currentValue, setCurrentValue] = React.useState<T>(selectedValue);
  const { ref: sheetRef, present } = useBottomSheet();

  React.useEffect(() => {
    setTempValue(selectedValue);
    setCurrentValue(selectedValue);
  }, [selectedValue]);

  const handlePresent = React.useCallback(() => {
    const hasRef = !!sheetRef.current;
    if (!hasRef) {
      return;
    }
    present();
  }, [present, sheetRef]);

  const selectedOption = options.find(option => option.key === currentValue);
  const displayLabel = selectedOption?.translationKey 
    ? t(selectedOption.translationKey as any)
    : selectedOption?.label || (placeholder.startsWith('common.') ? tCommon(placeholder.replace('common.', '') as any) : placeholder);

  const defaultIcon = (
    <BiFilterLeft
      size={24}
      strokeWidth={1}
      strokeColor={colors.textSecondary}
      color={colors.textSecondary}
    />
  );

  return (
    <Box pb={16} style={style}>
      <TouchableOpacity
        onPress={handlePresent}
        style={buttonStyle}
        accessibilityRole="button"
        accessibilityLabel={String(displayLabel)}
      >
        <Box
          flexDirection='row'
          alignItems='center'
          gap={8}
          px={12}
          py={5}
          borderRadius={9999}
          borderWidth={1}
          borderColor={colors.border}
          bgColor={colors.card}
          alignSelf='flex-start'
          style={containerStyle}
        >
          {icon || defaultIcon}
          <Text
            fontSize={FontSize.MEDIUM}
            fontWeight='medium'
            color={colors.text}
            style={textStyle ? textStyle : { lineHeight: 22 }}
          >
            {String(displayLabel)}
          </Text>
        </Box>
      </TouchableOpacity>

      <BottomSheet ref={sheetRef} initialIndex={0}>
        <Box px={16} pt={8} pb={24}>
          <RadioGroup
            options={options.map(option => ({
              key: option.key,
              label: option.translationKey ? t(option.translationKey as any) : option.label,
            }))}
            value={tempValue}
            onChange={setTempValue}
            style={{ marginBottom: 24 }}
          />

          <Box flexDirection='row' gap={16} mt={24}>
            {resetValue !== undefined && (
              <Button
                variant='tertiary-outline'
                text={resetLabel.startsWith('common.') ? tCommon(resetLabel.replace('common.', '') as any) : resetLabel}
                style={{ flex: 1 }}
                contentStyle={{
                  height: 48,
                  borderWidth: 1,
                  borderColor: colors.primary,
                }}
                outlineBaseColor={colors.primary}
                textStyle={{
                  color: colors.primary,
                  fontSize: FontSize.LARGE,
                  fontWeight: 'semibold',
                }}
                onPress={() => {
                  setTempValue(resetValue);
                }}
              />
            )}
            <Button
              variant='primary'
                text={applyLabel.startsWith('common.') ? tCommon(applyLabel.replace('common.', '') as any) : applyLabel}
              style={{ flex: 1 }}
              contentStyle={{
                height: 48,
                backgroundColor: colors.primary,
              }}
              textStyle={{
                fontSize: FontSize.LARGE,
                fontWeight: 'semibold',
                color: colors.background,
              }}
              onPress={() => {
                setCurrentValue(tempValue);
                onValueChange(tempValue);
                sheetRef.current?.dismiss();
              }}
            />
          </Box>
        </Box>
      </BottomSheet>
    </Box>
  );
}
