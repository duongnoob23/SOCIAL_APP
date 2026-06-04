import React from 'react';
import { Box } from '@/components/common/Layout/Box';
import { Text } from '@/components/common/Text/Text';
import { useTheme } from '@react-navigation/native';
import {
    Modal,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import Button from '@/components/common/Button';
import { BREAKPOINTS } from '@/constants/global-constants';
import { Svg, Circle, Path } from 'react-native-svg';

interface PaymentFailedModalProps {
    visible: boolean;
    handleClose: () => void;
    handlePressButton: () => void;
    title: string;
    message: string;
    buttonText: string;
}

const ErrorIcon = () => {
    const { colors } = useTheme();
    return (
        <Svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <Circle cx="32" cy="32" r="30" stroke={colors.error} strokeWidth="4" fill="transparent" />
            <Path
                d="M32 20 L32 36"
                stroke={colors.error}
                strokeWidth="4"
                strokeLinecap="round"
            />
            <Circle cx="32" cy="44" r="2.5" fill={colors.error} />
        </Svg>
    );
};

export default function PaymentFailedModal({
    visible,
    handleClose,
    handlePressButton,
    title,
    message,
    buttonText,
}: PaymentFailedModalProps) {
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
                    p={14}
                    style={[styles.modalContent, { maxHeight: modalMaxHeight }]}
                >
                    <Box pt={16} gap={20} alignItems="center">
                        <ErrorIcon />
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
                        text={buttonText}
                        onPress={handlePressButton}
                        variant="primary"
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
