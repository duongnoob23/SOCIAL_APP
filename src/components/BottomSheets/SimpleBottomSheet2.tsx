import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback } from "react";
import { Text } from "react-native";

interface Props {
    message:string;
    onDismiss?: () => void;
    onOpen?:() => void;
}

const SimpleBottomSheet2 = forwardRef<BottomSheetModal,Props>(({message,onDismiss,onOpen},ref) => {

    const snapPoints = React.useMemo(() => {
        return ['50%'];
    },[])

 const renderBackdrop = useCallback((props:any) => {
   return(
     <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={"close"}
        opacity={0.5}
    />
   )
 },[])

    return (
         <BottomSheetModal
         ref={ref}
         snapPoints={snapPoints}
         backdropComponent={renderBackdrop}
         onDismiss={onDismiss}
         onAnimate={(_,toIndex) => {
            if(toIndex >= 0) onOpen?.();
         }}
         >
            <BottomSheetView>
                <Text>{message}</Text>
            </BottomSheetView>
        </BottomSheetModal>
    )
})

export default SimpleBottomSheet2;