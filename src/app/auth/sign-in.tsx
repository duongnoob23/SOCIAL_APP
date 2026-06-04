
import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function SignInScreen ()  {
  const router = useRouter();
  const handleNavigate = () => {
    router.push({
      pathname:'/story/select-photos',
    });
  }
  return (
   <View style={style.container}>
      <Text >
        Sign In
      </Text>
      <Button title="Add Momenst" color={"blue"} onPress={handleNavigate}/>
   </View>
  );
};

const style = StyleSheet.create({
  container:{
    width:"100%",
    height:"100%",
    justifyContent:"center",
    alignItems:"center",
  }
})


