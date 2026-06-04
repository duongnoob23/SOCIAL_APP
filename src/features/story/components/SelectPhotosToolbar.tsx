import FourColumnGrid from "@/assets/Icon/FourColumnGrid";
import HasBorderIcon from "@/assets/Icon/HasBroderIcon";
import NotBorderIcon from "@/assets/Icon/NotBorderIcon";
import TwoColumnGrid from "@/assets/Icon/TwoColumnGrid";
import UploadIcon from "@/assets/Icon/UploadIcon";
import { Text, TouchableOpacity, View } from "react-native";



export interface SelectPhotosToolbarProps {
    isFourColumnGrid: boolean;
    isBorder:boolean;
    onToggleColumn: () => void;
    onToggleBorder:() => void;
    onUploadPress:() => void;
}

export const SelectPhotosToolbar = ({
    isFourColumnGrid,
    isBorder,
    onToggleBorder,
    onToggleColumn,
    onUploadPress,
}:SelectPhotosToolbarProps) => {

    return(
        <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center",
            marginVertical:16,
        }}>
            <View style={{gap:10, flexDirection:'row', alignItems:"center"}}>
                <TouchableOpacity onPress={onToggleColumn}>
                    {isFourColumnGrid ? <FourColumnGrid/> : <TwoColumnGrid/>}  
                </TouchableOpacity>
                <TouchableOpacity onPress={onToggleBorder}>
                    {isBorder ? <HasBorderIcon/> : <NotBorderIcon/>}
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={{gap:4, justifyContent:"center", alignItems:"center", flexDirection:"row"}} onPress={onUploadPress}>
                <UploadIcon/>
                <Text>
                    Upload Moments
                </Text>
            </TouchableOpacity>
        </View>
    )
}