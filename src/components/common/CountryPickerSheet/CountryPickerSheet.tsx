import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Pressable, Dimensions } from 'react-native';
import {
  BottomSheetFlashList,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Box } from '@/components/common/Layout/Box';
import { Text, getFontFamily } from '@/components/common/Text/Text';
import { FontSize } from '@/theme/fonts';
import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import { COUNTRIES, type Country } from '@/constants/countries';
import SearchIcon from '@/assets/icons/IconSearch';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { FlatList } from 'react-native-gesture-handler';

export interface CountryPickerSheetRef {
  present: () => void;
  dismiss: () => void;
  close: () => void;
}

export interface CountryPickerSheetProps {
  onSelectCountry?: (country: Country) => void;
  selectedCountry?: Country | null;
  onDismiss?: () => void;
}

const CountryPickerSheet = forwardRef<
  CountryPickerSheetRef,
  CountryPickerSheetProps
>(({ onSelectCountry, selectedCountry, onDismiss }, ref) => {
  const { ref: bottomSheetRef, present, dismiss, close } = useBottomSheet();
  const [searchQuery, setSearchQuery] = useState('');
  const { colors } = useTheme();
  const { t } = useTranslation('common');
  const insets = useSafeAreaInsets();

  const screenHeight = Dimensions.get('window').height;
  const searchInputHeight = 52;
  const searchInputMarginBottom = 8;
  const flatListHeight =
    screenHeight - insets.top - searchInputHeight - searchInputMarginBottom;

  useImperativeHandle(ref, () => ({
    present,
    dismiss,
    close,
  }));

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return COUNTRIES;
    }

    const q = searchQuery.toLowerCase();
    return COUNTRIES.filter(country => {
      const name = country.name.toLowerCase();
      const code = country.code.toLowerCase();
      return (
        name.includes(q) ||
        code.includes(q) ||
        country.dial_code.includes(searchQuery)
      );
    });
  }, [searchQuery]);

  const handleSelectCountry = useCallback(
    (country: Country) => {
      onSelectCountry?.(country);
      close();
    },
    [onSelectCountry, close],
  );

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const renderCountryItem = useCallback(
    ({ item }: { item: Country }) => (
      <Box mx={24}>
        <Pressable
          accessibilityRole='button'
          accessibilityState={{
            selected: selectedCountry?.code === item.code,
          }}
          onPress={() => handleSelectCountry(item)}
        >
          <Box flexDirection='row' alignItems='center' paddingY={16}>
            <Text
              fontSize={FontSize.EXTRA_EXTRA_LARGE}
              style={{
                marginRight: 12,
              }}
            >
              {item.flag}
            </Text>
            <Text
              fontSize={FontSize.MEDIUM}
              color={colors.text}
              style={{
                flex: 1,
                fontFamily: getFontFamily(),
              }}
            >
              {item.name}
            </Text>
          </Box>
        </Pressable>
        <Box height={1} backgroundColor={colors.border} />
      </Box>
    ),
    [selectedCountry, colors, handleSelectCountry],
  );

  const renderSearchInput = () => (
    <Box
      flexDirection='row'
      alignItems='center'
      marginX={16}
      marginBottom={8}
      paddingX={18}
      h={52}
      borderWidth={1}
      borderRadius={100}
      borderColor={colors.border}
      backgroundColor={colors.surface}
    >
      <SearchIcon size={18} color={colors.textSecondary} />
      <BottomSheetTextInput
        style={{
          flex: 1,
          fontSize: FontSize.MEDIUM,
          fontFamily: getFontFamily(),
          paddingHorizontal: 12,
          paddingVertical: 8,
          color: colors.text,
        }}
        placeholder={t('search')}
        placeholderTextColor={colors.placeholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCorrect={false}
        autoCapitalize='none'
      />
      {searchQuery.length > 0 && (
        <Pressable
          accessibilityRole='button'
          accessibilityLabel={t('clear')}
          onPress={clearSearch}
          style={{
            padding: 4,
            marginLeft: 8,
          }}
        >
          <Text fontSize={FontSize.LARGE} color={colors.textSecondary}>
            ×
          </Text>
        </Pressable>
      )}
    </Box>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      keyboardBehavior='interactive'
      keyboardBlurBehavior='restore'
      onDismiss={() => {
        setSearchQuery('');
        onDismiss?.();
      }}
    >
      <Box flex={1} paddingX={0} paddingY={0}>
        {renderSearchInput()}
        <FlatList
          data={filteredCountries}
          keyExtractor={(item: Country) => item.code}
          renderItem={renderCountryItem}
          showsVerticalScrollIndicator={true}
          style={{
            height: flatListHeight,
          }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Math.max(insets.bottom, 16),
          }}
          ListEmptyComponent={
            <Box alignItems='center' justifyContent='center' paddingY={40}>
              <Text fontSize={FontSize.MEDIUM} color={colors.textSecondary}>
                {t('noResults')}
              </Text>
            </Box>
          }
          keyboardShouldPersistTaps='handled'
        />
      </Box>
    </BottomSheet>
  );
});

CountryPickerSheet.displayName = 'CountryPickerSheet';

export default CountryPickerSheet;
