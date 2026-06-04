import React from 'react';
import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import { useTheme } from '@react-navigation/native';
import { Modal, useWindowDimensions, StyleSheet } from 'react-native';
import Button from '@/components/common/Button';
import { useTranslation } from 'react-i18next';
import SuccessSvg from '@/assets/icon/SuccessSvg';
import { BREAKPOINTS } from '@/constants/global-constants';

interface SuccessModalProps {
  visible: boolean;
  handleClose: () => void;
  handlePressButton: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export default function SuccessModal({
  visible,
  handleClose,
  handlePressButton,
  title,
  message,
  buttonText,
}: SuccessModalProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { t } = useTranslation(['common']);

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
          p={14}
          style={[styles.modalContent, { maxHeight: modalMaxHeight }]}
        >
          <Box pt={16} gap={20} alignItems="center">
            <SuccessSvg />
            <Text fontSize={20} align="center">
              {title}
            </Text>
          </Box>

          <Box mt={12} mb={24}>
            <Text fontSize={14} fontWeight="regular" align="center">
              {message}
            </Text>
          </Box>

          <Button
            text={buttonText || t('common:ok')}
            onPress={handlePressButton}
          />
        </Box>
      </Box>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 24,
  },
  modalContent: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
