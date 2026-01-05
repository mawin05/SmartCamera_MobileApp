import { COLORS, SPACING } from "@/constants/theme";
import { AlertItem } from "@/constants/types";
import { getAlertsFromCache } from "@/services/alertService"; // Importujemy Twój cache
import { GlobalStyles } from "@/styles/GlobalStyles";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import CircleButton from "./circleButton";
import NotificationMark from "./notificationMark";

function AlertMax() {
  const { id } = useLocalSearchParams();
  const [alert, setAlert] = useState<AlertItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlert = async () => {
      const cachedAlerts = await getAlertsFromCache();
      if (cachedAlerts) {
        const found = cachedAlerts.find((a) => a.id === id);
        setAlert(found || null);
      }
      setLoading(false);
    };

    loadAlert();
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={COLORS.secondary}
        style={{ flex: 1 }}
      />
    );
  }

  if (!alert) {
    return (
      <View style={styles.container}>
        <Text style={GlobalStyles.text_primary}>Nie znaleziono alertu</Text>
      </View>
    );
  }

  // Obsługa źródła obrazu: URL z serwera lub lokalny require z mocka
  const imageSource =
    typeof alert.image === "string" ? { uri: alert.image } : alert.image;

  return (
    <View style={styles.container}>
      <Text style={GlobalStyles.text_primary}>{alert.title}</Text>
      <Text style={GlobalStyles.text_secondary}>{alert.time}</Text>

      <Image source={imageSource} style={styles.image} />

      <View style={styles.button_container}>
        <CircleButton iconName="trash" />
        <CircleButton iconName="settings" />
      </View>

      {alert.isNew && (
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
