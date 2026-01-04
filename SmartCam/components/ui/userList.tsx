import { USERS } from "@/constants/object";
import { SPACING } from "@/constants/theme";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import UserEntry from "./userEntry";

function UserList() {
  return (
    <FlatList
      data={USERS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <UserEntry user={item}></UserEntry>}
      contentContainerStyle={styles.listContent}
      style={{ flex: 1, width: "100%" }}
    ></FlatList>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
    paddingBottom: 40,
    gap: SPACING.m,
  },
});

export default UserList;
