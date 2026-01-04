import { ALERTS } from "@/constants/object";
import { COLORS, SPACING } from "@/constants/theme";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import CircleButton from "./circleButton";
import NotificationMark from "./notificationMark";

function AlertMax() {
  const { id } = useLocalSearchParams();
  const alert = ALERTS.find((a) => a.id === id);

  return (
    <View style={styles.container}>
      <Text style={GlobalStyles.text_primary}>{alert?.title}</Text>
      <Text style={GlobalStyles.text_secondary}>{alert?.time}</Text>
      <Image source={alert?.image} style={styles.image}></Image>
      <View style={styles.button_container}>
        <CircleButton iconName="trash"></CircleButton>
        <CircleButton iconName="settings"></CircleButton>
      </View>
      {alert?.isNew && (
        <View style={GlobalStyles.mark}>
          <NotificationMark />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    height: "80%",
    width: "95%",
    borderRadius: 20,
    alignItems: "center",
    paddingTop: SPACING.xl,
  },
  button_container: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // padding: 10,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 20,
    marginVertical: SPACING.l,
  },
});

export default AlertMax;
