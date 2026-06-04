
import { useMediaGallery } from "@/hooks/useMediaGallery";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SelectPhotos ()  {
  const router = useRouter();
  const {
    permissionStatus, 
    handleCheckAndRequestPermission,
    checkCurrentPermission,
  } = useMediaGallery();

  useEffect( () => {
    handleCheckAndRequestPermission();
  },[handleCheckAndRequestPermission])
  console.log("AAAA",permissionStatus,);


  return (
   <View style={style.container}>
      <Text >
          Permission: {permissionStatus}
      </Text>
   </View>
  );
};

const style = StyleSheet.create({
  container:{
    width:"100%",
    height:"100%",
    justifyContent:"flex-start",
    alignItems:"center",
  }
})


