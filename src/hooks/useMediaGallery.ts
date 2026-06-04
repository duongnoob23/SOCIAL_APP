import * as MediaLibrary from 'expo-media-library';
import { useCallback, useEffect, useState } from "react";
import { Alert, AppState, AppStateStatus, Linking } from 'react-native';

export const useMediaGallery = () => {
    const [permissionStatus, setPermissionStatus] = useState<MediaLibrary.PermissionStatus | 'undetermined' | 'denied'>('undetermined');

    const checkCurrentPermission = useCallback(async () => {
        try {
            const currentStatus = await MediaLibrary.getPermissionsAsync();
            setPermissionStatus(currentStatus.status);
        } catch (error) {
            console.log("Error when check current permission");
        }
    }, []);

    const handleCheckAndRequestPermission = useCallback(async () => {
        try {
            const currentStatus = await MediaLibrary.getPermissionsAsync();

            if (currentStatus.status === 'granted') {
                setPermissionStatus(currentStatus.status);
                return true;
            }

            if (currentStatus.canAskAgain) {
                const firstAsk = await MediaLibrary.requestPermissionsAsync();

                if (firstAsk.status === 'granted') {
                    setPermissionStatus(firstAsk.status);
                    return true;
                }

                if (firstAsk.canAskAgain) {
                    const secondAsk = await MediaLibrary.requestPermissionsAsync();

                    if (secondAsk.status === 'granted') {
                        setPermissionStatus(secondAsk.status);
                        return true;
                    }
                   
                }
            }

            setPermissionStatus('denied');
            Alert.alert(
                "Thiếu quyền lấy ảnh",
                "Bạn đã từ chối cho App lấy ảnh. Vui lòng vào Cài Đặt để mở lại quyền!",
                [
                    { text: "Để sau", style: "cancel" },
                    {
                        text: "Mở Cài đặt",
                        onPress: () => Linking.openSettings(),
                    }
                ]
            );
            return false;

        } catch (error) {
            console.error("Error when requestPermission", error);
            return false;
        }
    }, []);

  
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                checkCurrentPermission();
            }
        });

        return () => {
            subscription.remove();
        };
    }, [checkCurrentPermission]);

    return {
        permissionStatus,
        handleCheckAndRequestPermission,
        checkCurrentPermission,
    };
};