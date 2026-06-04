
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
export interface TabsItem {
    id:string;
    tabName:string;
}


export interface SelectPhotosTabsProps {
    tabs:TabsItem[];
    activeTabs:string;
    onTabChange: (tabId:string) => void;
}

export const SelectPhotosTabs = ({
    tabs,
    activeTabs,
    onTabChange,
}:SelectPhotosTabsProps) => {
        return (
            <View style={{flexDirection:"row" , alignItems:"center" , justifyContent:"space-around"}}>
                {tabs.map((item,index) => {

                    const isSelected = activeTabs === item.id;
                    return (
                        <TouchableOpacity key={index} onPress={() => onTabChange(item.id)}
                        style={[
                            {
                                justifyContent:"center" , 
                                alignItems:"center", 
                                paddingVertical:6,
                            },
                            isSelected ? {
                                borderBottomColor:"#0066B9", 
                                borderBottomWidth:2,
                            } : {
                                 borderBottomColor:"#DDE0E4", 
                                borderBottomWidth:1,
                            }
                            ]}>
                            <Text style={[
                                {
                                    fontWeight:"medium", 
                                    fontSize:14, 
                                },
                                isSelected ? {
                                    color:"#0066B9"
                                } : {
                                    color:"#2B2B2B"
                                }
                            ]}>
                                {item.tabName}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
}