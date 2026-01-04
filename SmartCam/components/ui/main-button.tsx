import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

interface Props {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

function MainButton({ iconName, onPress }: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Ionicons name={iconName} size={100} color="#ffff"></Ionicons>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "25%",
    height: "25%",
    borderRadius: 20,
    aspectRatio: 1,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    margin: 20,
  },
});

export default MainButton;
