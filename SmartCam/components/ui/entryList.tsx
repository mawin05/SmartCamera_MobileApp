import { SPACING } from "@/constants/theme";
import { AlertItem } from "@/constants/types";
import {
  fetchAlerts,
  getAlertsFromCache,
  saveAlertsToCache,
} from "@/services/alertService";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import AlertMin from "./alertMin";

function EntryList() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);

    // 1. Pobierz świeże dane z "serwera"
    const freshData = await fetchAlerts();

    // 2. Zaktualizuj stan i pamięć telefonu
    setAlerts(freshData);
    await saveAlertsToCache(freshData);

    setIsLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    loadData(true);
  };

  const markAsRead = async (id: string) => {
    const updatedAlerts = alerts.map((alert) =>
      alert.id === id ? { ...alert, isNew: false } : alert
    );
    setAlerts(updatedAlerts);
    await saveAlertsToCache(updatedAlerts);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);

      // 1. Najpierw sprawdź, co mamy w pamięci telefonu
      const cachedData = await getAlertsFromCache();

      // 2. LOGIKA: Jeśli mamy coś w cache, to to pokazujemy i KONIEC.
      // Nie pobieramy freshData, bo one nadpiszą nam status "przeczytane".
      if (cachedData && cachedData.length > 0) {
        setAlerts(cachedData);
        setIsLoading(false);
        return; // Wychodzimy z funkcji, nie idziemy dalej
      }

      // 3. Jeśli cache jest pusty (pierwsze włączenie aplikacji),
      // dopiero wtedy pobieramy dane z "serwera"
      const freshData = await fetchAlerts();
      await saveAlertsToCache(freshData);
      setAlerts(freshData);
      setIsLoading(false);
    };

    loadInitialData();
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
      data={alerts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AlertMin alert={item} markAsRead={markAsRead}></AlertMin>
      )}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
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
