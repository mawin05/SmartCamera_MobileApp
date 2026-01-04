import { ALERTS } from "@/constants/object";
import { SPACING } from "@/constants/theme";
import { AlertItem } from "@/constants/types";
import { fetchAlerts } from "@/services/alertService";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import AlertMin from "./alertMin";

function EntryList() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAlerts();
      setAlerts(data);
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="coral" />
      </View>
    );
  }

  return (
    <FlatList
      data={ALERTS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AlertMin alert={item}></AlertMin>}
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
