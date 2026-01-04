import { COLORS, SPACING } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

interface Props {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

function CircleButton({ iconName }: Props) {
  return (
    <Pressable style={styles.circle}>
      <Ionicons name={iconName} color={"#ffff"} size={70}></Ionicons>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: 90,
    backgroundColor: COLORS.secondary,
    aspectRatio: 1,
    // margin: SPACING.l,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.m,
  },
});

export default CircleButton;
