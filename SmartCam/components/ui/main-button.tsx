import { COLORS } from "@/constants/theme";
import { GlobalStyles } from "@/styles/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

interface Props {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

function MainButton({ iconName, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && GlobalStyles.pressed,
      ]}
      onPress={onPress}
    >
      <Ionicons name={iconName} size={150} color="#ffff"></Ionicons>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "35%",
    height: "35%",
    borderRadius: 20,
    aspectRatio: 1,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    margin: 20,
  },
});

export default MainButton;
