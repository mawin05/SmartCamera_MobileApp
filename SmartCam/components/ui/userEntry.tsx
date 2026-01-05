import { COLORS } from "@/constants/theme";
import { User } from "@/constants/types";
import { GlobalStyles } from "@/styles/GlobalStyles";
import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";

interface Props {
  user: User;
}

function UserEntry({ user }: Props) {
  const imageSource =
    typeof user.image === "string" ? { uri: user.image } : user.image;

  return (
    <Pressable
      style={({ pressed }) => [
        GlobalStyles.singleEntry,
        pressed && GlobalStyles.pressed,
      ]}
    >
      <Image source={imageSource} style={styles.image}></Image>
      <Text style={GlobalStyles.text_primary}>{user.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: COLORS.background,
  },
});

export default UserEntry;
