import React from "react";
import { StyleSheet, View } from "react-native";

function NotificationMark() {
  return <View style={styles.box}></View>;
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "red",
    borderRadius: 90,
    width: 30,
    aspectRatio: 1,
  },
});

export default NotificationMark;
