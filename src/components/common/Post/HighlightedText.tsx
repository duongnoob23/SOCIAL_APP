import { Text, type FontWeight } from '@/components/common/Text/Text';
import { FontSize } from '@/theme/fonts';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { useWindowDimensions } from 'react-native';

type HighlightProps = {
  text: string;
  searchText?: string;
  numberOfLines?: number;
  style?: any;
  fontSize?: number;
  fontWeight?: FontWeight;
  color?: string;
  smartTruncation?: {
    enabled?: boolean;
    maxLength?: number;
    keywordPosition?: 'start' | 'center' | 'auto';
    contextPadding?: number;
    wordBoundary?: boolean;
    ellipsisStyle?: 'standard' | 'minimal';
  };
};

export const HighlightedText = ({
  text,
  searchText,
  numberOfLines = 2,
  style,
  fontSize = FontSize.MEDIUM,
  fontWeight,
  color,
  smartTruncation = {
    enabled: true,
    keywordPosition: 'auto',
    contextPadding: 50,
    wordBoundary: true,
    ellipsisStyle: 'standard',
  },
}: HighlightProps) => {
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const {
    enabled = true,
    maxLength,
    keywordPosition = 'auto',
    contextPadding = 50,
    wordBoundary = true,
    ellipsisStyle = 'standard',
  } = smartTruncation;

  const q = searchText?.trim();

  if (!q || !enabled) {
    return (
      <Text
        numberOfLines={numberOfLines}
        ellipsizeMode="tail"
        fontSize={fontSize}
        style={style}
        color={color ?? colors.text}
        fontWeight={fontWeight}
      >
        {text}
      </Text>
    );
  }

  const searchIndex = text.toLowerCase().indexOf(q.toLowerCase());

  if (searchIndex === -1) {
    return (
      <Text
        numberOfLines={numberOfLines}
        ellipsizeMode="tail"
        fontSize={fontSize}
        style={style}
        fontWeight={fontWeight}
      >
        {renderHighlightedParts(text, q, colors, color)}
      </Text>
    );
  }

  const effectiveWidth = screenWidth * 0.6; 
  const estimatedCharsPerLine = Math.max(
    20,
    Math.floor(effectiveWidth / Math.max(1, fontSize * 0.6)),
  );
  const baselineLines = numberOfLines === 1 ? 1 : Math.max(2, numberOfLines);
  const calculatedMaxLength = maxLength || estimatedCharsPerLine * baselineLines;

  let displayText = text;
  let showEllipsisStart = false;
  let showEllipsisEnd = false;

  const needsTruncation =
    text.length > calculatedMaxLength ||
    searchIndex > calculatedMaxLength * 0.8;

  if (needsTruncation) {
    const { startIndex, endIndex } = calculateTruncationIndices(
      text,
      searchIndex,
      q.length,
      calculatedMaxLength,
      keywordPosition,
      contextPadding,
    );

    const { adjustedStart, adjustedEnd } = wordBoundary
      ? adjustForWordBoundaries(
          text,
          startIndex,
          endIndex,
          searchIndex,
          q.length,
        )
      : { adjustedStart: startIndex, adjustedEnd: endIndex };

    displayText = text.substring(adjustedStart, adjustedEnd);
    showEllipsisStart = adjustedStart > 0;
    showEllipsisEnd = adjustedEnd < text.length;

    if (displayText.length < estimatedCharsPerLine * 2 && adjustedStart > 0) {
      const newStartIndex = Math.max(
        0,
        adjustedEnd - estimatedCharsPerLine * 2,
      );
      if (wordBoundary) {
        const readjusted = adjustForWordBoundaries(
          text,
          newStartIndex,
          adjustedEnd,
          searchIndex,
          q.length,
        );
        displayText = text.substring(
          readjusted.adjustedStart,
          readjusted.adjustedEnd,
        );
        showEllipsisStart = readjusted.adjustedStart > 0;
      } else {
        displayText = text.substring(newStartIndex, adjustedEnd);
        showEllipsisStart = newStartIndex > 0;
      }
    }
  }

  const ellipsisText = ellipsisStyle === 'minimal' ? '…' : '...';

  return (
    <Text
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      fontSize={fontSize}
      style={style}
      fontWeight={fontWeight}
    >
      {showEllipsisStart && (
        <Text color={color ?? colors.text}>{ellipsisText}</Text>
      )}
      {renderHighlightedParts(displayText, q, colors, color)}
      {showEllipsisEnd && (
        <Text color={color ?? colors.text}>{ellipsisText}</Text>
      )}
    </Text>
  );
};

const renderHighlightedParts = (
  text: string,
  searchText: string,
  colors: any,
  color?: string,
) => {
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapeRegExp(searchText)})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === searchText.toLowerCase();
    return (
      <Text
        key={index}
        color={isMatch ? colors.primary : (color ?? colors.text)}
      >
        {part}
      </Text>
    );
  });
};

const calculateTruncationIndices = (
  text: string,
  searchIndex: number,
  keywordLength: number,
  maxLength: number,
  keywordPosition: 'start' | 'center' | 'auto',
  contextPadding: number,
) => {
  let startIndex: number;
  let endIndex: number;

  switch (keywordPosition) {
    case 'start':
      startIndex = Math.max(0, searchIndex - Math.floor(maxLength * 0.15));
      endIndex = Math.min(text.length, startIndex + maxLength);
      break;

    case 'center': {
      const halfLength = Math.floor(maxLength / 2);
      startIndex = Math.max(0, searchIndex - halfLength);
      endIndex = Math.min(
        text.length,
        searchIndex + keywordLength + halfLength,
      );
      break;
    }

    case 'auto':
    default:
      if (searchIndex <= maxLength * 0.3) {
        startIndex = 0;
        endIndex = Math.min(text.length, maxLength);
      } else if (searchIndex + keywordLength >= text.length - maxLength * 0.3) {
        endIndex = text.length;
        startIndex = Math.max(0, endIndex - maxLength);
      } else {
        const availableSpace = maxLength - keywordLength;
        const beforeKeyword = Math.min(contextPadding, availableSpace * 0.4);
        const afterKeyword = availableSpace - beforeKeyword;

        startIndex = Math.max(0, searchIndex - beforeKeyword);
        endIndex = Math.min(
          text.length,
          searchIndex + keywordLength + afterKeyword,
        );
      }
      break;
  }

  if (endIndex - startIndex > maxLength) {
    if (searchIndex - startIndex > endIndex - searchIndex - keywordLength) {
      startIndex = endIndex - maxLength;
    } else {
      endIndex = startIndex + maxLength;
    }
  }

  return { startIndex, endIndex };
};

const adjustForWordBoundaries = (
  text: string,
  startIndex: number,
  endIndex: number,
  searchIndex: number,
  keywordLength: number,
) => {
  let adjustedStart = startIndex;
  let adjustedEnd = endIndex;

  if (adjustedStart > 0 && text[adjustedStart] !== ' ') {
    const spaceIndex = text.lastIndexOf(' ', adjustedStart + 15);
    if (spaceIndex > Math.max(0, adjustedStart - 10)) {
      adjustedStart = spaceIndex + 1;
    }
  }

  if (adjustedEnd < text.length && text[adjustedEnd] !== ' ') {
    const spaceIndex = text.indexOf(' ', adjustedEnd - 15);
    if (spaceIndex !== -1 && spaceIndex < adjustedEnd + 10) {
      adjustedEnd = spaceIndex;
    }
  }
  if (adjustedStart > searchIndex) {
    adjustedStart = startIndex;
  }

  if (adjustedEnd < searchIndex + keywordLength) {
    adjustedEnd = endIndex;
  }
  return { adjustedStart, adjustedEnd };
};