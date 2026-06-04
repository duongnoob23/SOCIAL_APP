import React from 'react';
import type { TextStyle } from 'react-native';
import { Text, type TextProps } from '@/components/common/Text/Text';

interface HighlightTextProps {
  text: string;
  searchText: string;
  highlightStyle?: TextStyle;
  normalStyle?: TextStyle;
  caseSensitive?: boolean;
  fontSize?: number;
  fontWeight?: TextProps['fontWeight'];
  color?: TextProps['color'];
}

export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  searchText,
  highlightStyle,
  normalStyle,
  caseSensitive = false,
  fontSize,
  fontWeight,
  color,
}) => {
  if (!searchText.trim()) {
    return (
      <Text 
        style={normalStyle}
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
      >
        {text}
      </Text>
    );
  }

  const normalizeText = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase();
  };

  const searchTerm = caseSensitive ? searchText : normalizeText(searchText);
  const normalizedText = caseSensitive ? text : normalizeText(text);

  const parts = [];
  let lastIndex = 0;
  let index = normalizedText.indexOf(searchTerm);

  while (index !== -1) {
    if (index > lastIndex) {
      parts.push(
        <Text 
          key={`normal-${lastIndex}`} 
          style={normalStyle}
          fontSize={fontSize}
          fontWeight={fontWeight}
          color={color}
        >
          {text.substring(lastIndex, index)}
        </Text>
      );
    }

    parts.push(
      <Text 
        key={`highlight-${index}`} 
        style={highlightStyle}
        fontSize={fontSize}
        fontWeight={fontWeight}
      >
        {text.substring(index, index + searchText.length)}
      </Text>
    );

    lastIndex = index + searchText.length;
    index = normalizedText.indexOf(searchTerm, lastIndex);
  }

  if (lastIndex < text.length) {
    parts.push(
      <Text 
        key={`normal-${lastIndex}`} 
        style={normalStyle}
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
      >
        {text.substring(lastIndex)}
      </Text>
    );
  }

  return (
    <Text 
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={color}
    >
      {parts}
    </Text>
  );
};
