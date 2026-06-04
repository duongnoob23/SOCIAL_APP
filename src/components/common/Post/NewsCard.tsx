import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import { BorderRadius } from '@/theme/borderRadius';
import { useTheme } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import { HighlightedText } from './HighlightedText';
import { FontSize } from '@/theme/fonts';
import { useRouter } from 'expo-router';
import { cleanString } from '@/utils';
import type { Post } from '@/features/post/types';

const NewsCard = ({
  data,
  searchText,
}: {
  data: Post;
  searchText?: string;
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation('saved');
  const router = useRouter();

  const handleNavigatePostDetail = useCallback(() => {
    router.push({
      pathname: '/news/[id]',
      params: { id: encodeURIComponent(data.id.toString()) },
    });
  }, [router, data.id]);

  return (
    <Box
      flexDirection='row'
      gap={14}
      alignItems='center'
      justifyContent='space-between'
      padding={12}
      backgroundColor={colors.background}
      borderRadius={12}
      onPress={() => handleNavigatePostDetail()}
    >
      <Image
        source={{
          uri: data.imageUrl,
        }}
        style={{
          width: 80,
          height: 80,
          borderRadius: BorderRadius.MEDIUM,
        }}
      />

      <Box flex={1}>
        <HighlightedText
          text={
            !searchText || searchText.trim() === ''
              ? data.title?.trim() || data.content?.trim() || ''
              : cleanString(data.content)
          }
          searchText={searchText}
          fontWeight='medium'
        />
        <Box flexDirection='row' alignItems='center' marginTop={6}>
          <HighlightedText
            text={data.author ? `${data.author} • ` : ''}
            searchText={searchText}
            numberOfLines={1}
            fontSize={FontSize.SMALL}
            color={colors.textSecondary}
            style={{ flexShrink: 1, marginRight: 4 }}
            smartTruncation={{
              keywordPosition: 'auto',
              enabled: true,
              contextPadding: 100,
              wordBoundary: true,
              ellipsisStyle: 'standard',
            }}
          />

          <Text fontSize={12} color={colors.textSecondary}>
            {t('minsRead', {
              count: Math.max(1, Math.ceil((data.content?.length || 0) / 500)),
            })}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default NewsCard;
