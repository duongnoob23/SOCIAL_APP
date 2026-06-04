import React from 'react';
import { TextInput } from 'react-native';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Box } from '@/components/common/Layout/Box';
import { useTheme } from '@react-navigation/native';
import { Search01 } from '@/assets/icons/svg/Search01';
import { FontSize } from '@/theme/fonts';

interface SearchBarVariant {
  default: {
    height: number;
    borderRadius: number;
    paddingHorizontal: number;
    fontSize: number;
  };
  compact: {
    height: number;
    borderRadius: number;
    paddingHorizontal: number;
    fontSize: number;
  };
  large: {
    height: number;
    borderRadius: number;
    paddingHorizontal: number;
    fontSize: number;
  };
}

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
  variant?: keyof SearchBarVariant;
  placeholder?: string;

  showSearchIcon?: boolean;
  searchIcon?: React.ReactNode;
  showClearButton?: boolean;
  clearIcon?: React.ReactNode;

  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;

  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  textColor?: string;
  placeholderColor?: string;
  iconColor?: string;
  editable?: boolean;
  marginHorizontal?: number;
  height?: number;
  borderRadius?: number;
  paddingHorizontal?: number;

  searchA11yLabel?: string;
  clearA11yLabel?: string;

  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  onSearchPress?: () => void;
}

const variants: SearchBarVariant = {
  default: {
    height: 52,
    borderRadius: 40,
    paddingHorizontal: 16,
    fontSize: FontSize.LARGE,
  },
  compact: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: FontSize.MEDIUM,
  },
  large: {
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: FontSize.EXTRA_EXTRA_LARGE,
  },
};

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,

  variant = 'default',
  placeholder = 'Search...',
  editable = true,
  showSearchIcon = true,
  searchIcon,
  autoFocus = false,
  containerStyle,
  inputStyle,

  backgroundColor,
  borderColor,
  borderWidth = 0,
  textColor,
  placeholderColor,
  iconColor,

  marginHorizontal,
  height,
  borderRadius,
  paddingHorizontal,

  searchA11yLabel,

  onFocus,
  onBlur,
  onSearchPress,

  ...textInputProps
}) => {
  const { colors } = useTheme();
  const inputRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);

  const variantStyles = variants[variant];

  const finalHeight = height ?? variantStyles.height;
  const finalBorderRadius = borderRadius ?? variantStyles.borderRadius;
  const finalPaddingHorizontal =
    paddingHorizontal ?? variantStyles.paddingHorizontal;
  const finalFontSize = variantStyles.fontSize;

  const finalBackgroundColor = backgroundColor ?? colors.card;
  const finalTextColor = textColor ?? colors.text;
  const finalPlaceholderColor = placeholderColor ?? colors.textTertiary;
  const finalIconColor = iconColor ?? colors.textSecondary;

  return (
    <Box
      mx={marginHorizontal}
      flexDirection='row'
      alignItems='center'
      backgroundColor={finalBackgroundColor}
      borderRadius={finalBorderRadius}
      px={finalPaddingHorizontal}
      h={finalHeight}
      style={[
        borderWidth > 0 && {
          borderWidth,
          borderColor: borderColor ?? colors.border,
        },
        containerStyle,
      ]}
    >
      <Box mr={12}>
        <Search01
          size={variant === 'compact' ? 20 : variant === 'large' ? 32 : 28}
          color={finalIconColor}
        />
      </Box>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        editable={editable}
        autoFocus={autoFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={finalPlaceholderColor}
        returnKeyType='search'
        onSubmitEditing={() => onSearchPress?.()}
        autoCapitalize='none'
        autoCorrect={false}
        accessibilityLabel={placeholder}
        testID='searchBar.input'
        style={[
          {
            flex: 1,
            fontSize: finalFontSize,
            color: finalTextColor,
          },
          inputStyle,
        ]}
        {...textInputProps}
      />
    </Box>
  );
};
