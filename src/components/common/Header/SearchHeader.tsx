import React, { useRef } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Box } from '@/components/common/Layout/Box';
import { BackButton } from '../Button/BackButton';
import { BorderRadius } from '@/theme/borderRadius';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontSize } from '@/theme/fonts';
import SearchIcon from '@/assets/icons/svg/SearchIcon';

interface SearchHeaderProps {
  inputSearchText: string;
  setInputSearchText: (text: string) => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
  placeholder: string;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  inputSearchText,
  setInputSearchText,
  onSubmit,
  placeholder,
  autoFocus = true,
}) => {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  return (
    <Box
      flexDirection='row'
      alignItems='center'
      justifyContent='center'
      paddingTop={top}
      backgroundColor={colors.surface}
      mb={24}
    >
      <BackButton />

      <Box
        flex={1}
        flexDirection='row'
        alignItems='center'
        backgroundColor={colors.card}
        marginLeft={12}
        p={16}
        marginY={10}
        h={52}
        borderColor={colors.primary}
        borderRadius={BorderRadius.FULL}
        onPress={() => inputRef.current?.focus()}
      >
        <SearchIcon color={colors.textSecondary} size={18} />
        <TextInput
          ref={inputRef}
          value={inputSearchText}
          onChangeText={setInputSearchText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          style={[styles.searchInput, { color: colors.text }]}
          selectionColor={colors.text}
          autoFocus={autoFocus}
          returnKeyType='search'
          onSubmitEditing={onSubmit}
        />
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    marginLeft: 8,
  },
  scrollContainer: {
    gap: 12,
  },
  input: {
    fontSize: FontSize.MEDIUM,
  },
});
