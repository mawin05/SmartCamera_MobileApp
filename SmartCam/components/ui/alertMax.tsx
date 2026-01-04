import { COLORS } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

function AlertMax() {
  return (
    <View style={styles.container}>
      <Text>11:30</Text>
      <Image
        source={require("../../assets/images/maciej.jpg")}
        style={styles.image}
      ></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    height: "80%",
    width: "95%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300, // Musisz podać szerokość
    height: 300, // I wysokość
    borderRadius: 20, // Opcjonalnie zaokrąglenie, żeby pasowało do stylu SmartCam
  },
});

export default AlertMax;
