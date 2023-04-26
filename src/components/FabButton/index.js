import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import {} from "react-native";

export function FabButton({ setVisibly, userStatus }) {
  const navigation = useNavigation();

  function handleNavigateButton() {
    userStatus ? setVisibly() : navigation.navigate("SignIn");
  }

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.container}
      onPress={handleNavigateButton}
    >
      <View>
        <Text style={styles.text}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2e54d4",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "5%",
    right: "6%",
  },
  text: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
});
