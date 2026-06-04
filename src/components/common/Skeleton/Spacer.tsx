import React from 'react';
import { Box } from '../Layout/Box';

interface SpacerProps {
  height?: number;
  width?: number;
  size?: number;
}

export const Spacer: React.FC<SpacerProps> = ({ 
  height, 
  width, 
  size 
}) => {
  const finalHeight = size ?? height;
  return <Box height={finalHeight} width={width} />;
};