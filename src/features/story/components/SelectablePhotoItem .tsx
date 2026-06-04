

import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

export interface PhotoItemData {
    id:string;
    url:string;
    height:number;
}

export interface SelectablePhotoItemProps {
    item:PhotoItemData;
    imageUrl:string;
    isBorder:boolean;
    isSelected:boolean;
    selectionIndex?:number;
    onToggle: () => void;
}

export const SelectablePhotoItem = ({
    item,
    imageUrl,
    isBorder,
    isSelected,
    selectionIndex,
    onToggle,
}:SelectablePhotoItemProps) => {
    return (
        <TouchableOpacity onPress={onToggle}>
            <View style={[
                {
                    overflow:'hidden',
                    position:'relative',
                    backgroundColor:"#EAEAEA",
                    borderWidth: 2,
                    borderColor: 'transparent',
                }
            ]}>
                <Image source={{uri : item.url}} resizeMode='cover'/>
            </View>
        </TouchableOpacity>
    )
}