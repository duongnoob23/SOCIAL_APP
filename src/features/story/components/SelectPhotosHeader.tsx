
import ArrowLeftIcon from '@/assets/Icon/ArrowLeftIcon';
import ArrowUpIcon from '@/assets/Icon/ArrowUpIcon';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';



export interface SelectPhotosHeaderProps {
    currentCount:number;
    maxCount:number;
    albumName:string;
    onBackPress: () => void;
    onDropdownPress: () => void;
}

export const SelectPhotosHeader = ({
    currentCount,
    maxCount,
    albumName,
    onBackPress,
    onDropdownPress,
}:SelectPhotosHeaderProps) => {


    return (
        <View 
        style={{ flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingHorizontal:20,paddingVertical:6,
        }}>
            <View 
            style={{
                gap:12,
                flexDirection:"row",
                alignItems:"center",
            }} >
                <TouchableOpacity onPress={onBackPress}>
                    <ArrowLeftIcon/>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDropdownPress}>
                    <View style={{gap:4}}>
                        <Text style={{ fontSize:20,fontWeight:"semibold",color:"#2B2B2B"
                        }}>{albumName}</Text>
                        <ArrowUpIcon />
                    </View>
                </TouchableOpacity>
            </View>
            <View>
                <Text style={{fontSize:20,fontWeight:"semibold",color:"#2B2B2B"
                }}>
                    {currentCount}/{maxCount}
                </Text>
            </View>
        </View>
    )
}

