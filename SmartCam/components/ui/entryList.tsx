import { SPACING } from "@/constants/theme";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import AlertMin from "./alertMin";

const ALERTS = [
  { id: "1", title: "Ruch wykryty - 12:00" },
  { id: "2", title: "Ruch wykryty - 12:05" },
  { id: "3", title: "Bateria słaba - 13:00" },
  { id: "4", title: "Bateria słaba - 13:00" },
  { id: "5", title: "Bateria słaba - 13:00" },
  { id: "6", title: "Bateria słaba - 13:00" },
  { id: "7", title: "Bateria słaba - 13:00" },
  { id: "8", title: "Bateria słaba - 13:00" },
  { id: "9", title: "Bateria słaba - 13:00" },
];

function EntryList() {
  return (
    <FlatList
      data={ALERTS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AlertMin>{item.title}</AlertMin>}
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

export default EntryList;
