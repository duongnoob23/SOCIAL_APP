import IconX from '@/assets/icon/IconX';
import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import { BREAKPOINTS } from '@/constants/global-constants';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Button from '../common/Button';
import type { ButtonVariant } from '../common/Button/types';

export interface ButtonModalProps {
  header: string;
  visible: boolean;
  showCloseButton?: boolean;
  handleClose: () => void;
  handlePressButton: () => void;
  buttonVariant?: ButtonVariant;
  contentText?: string;
  buttonText: string;
  contentComponent?: React.ReactNode;
  secondaryButtonText?: string;
  onPressSecondaryButton?: () => void;
  loading?: boolean;
}

export default function ButtonModal({
  header,
  visible,
  showCloseButton = true,
  handleClose,
  handlePressButton,
  buttonVariant = 'primary',
  contentText,
  buttonText,
  contentComponent,
  secondaryButtonText,
  onPressSecondaryButton,
  loading = false,
}: ButtonModalProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const isWideScreen = width > BREAKPOINTS.MD;
  const modalWidth = isWideScreen ? Math.min(500, width - 48) : width - 48;
  const modalMaxHeight = isWideScreen ? '80%' : undefined;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Box
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor={colors.blackTransparent}
        style={styles.modalContainer}
      >
        <Box
          width={modalWidth}
          maxWidth={500}
          backgroundColor={colors.white}
          borderRadius={2}
          p={16}
          style={{ maxHeight: modalMaxHeight }}
        >
          {showCloseButton && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.closeButton}
              onPress={handleClose}
              hitSlop={10}
            >
              <IconX size={20} />
            </TouchableOpacity>
          )}
          <Text fontSize={20} align="left">
            {header}
          </Text>

          <Box mt={12} mb={24}>
            {contentComponent || (
              <Text fontSize={14} fontWeight="regular">
                {contentText}
              </Text>
            )}
          </Box>

          <Box gap={16}>
            <Button
              text={buttonText}
              variant={buttonVariant}
              onPress={handlePressButton}
              loading={loading}
            />
            {secondaryButtonText && onPressSecondaryButton && (
              <Button
                text={secondaryButtonText}
                onPress={onPressSecondaryButton}
                variant={'secondary'}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
  },
});
