import { User } from "@/constants/types";
import { GlobalStyles } from "@/styles/GlobalStyles";
import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";

interface Props {
  user: User;
}

function UserEntry({ user }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        GlobalStyles.singleEntry,
        pressed && GlobalStyles.pressed,
      ]}
    >
      <Image source={user.image} style={styles.image}></Image>
      <Text style={GlobalStyles.text_primary}>{user.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default UserEntry;
