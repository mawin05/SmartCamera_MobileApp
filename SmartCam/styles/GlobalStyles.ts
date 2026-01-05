import { COLORS, SPACING } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    padding: SPACING.m,
  },

  singleEntry: {
    width: "100%",
    // ZAMIAST height: "15%", używamy paddingu i opcjonalnie minHeight
    paddingVertical: SPACING.m, // Odstęp góra-dół
    paddingHorizontal: SPACING.m, // Odstęp lewo-prawo
    minHeight: 80, // Minimalna wysokość, żeby zawsze dobrze wyglądało

    borderRadius: 15, // Nieco mniejsze zaokrąglenie wygląda lepiej na paskach

    flexDirection: "row", // Przygotowanie pod ikonę obok tekstu
    justifyContent: "space-between", // Tekst zaczyna się od lewej
    alignItems: "center",
    backgroundColor: COLORS.primary,

    // USUWAMY margin, bo używamy 'gap' w FlatList

    // Dodajemy delikatny cień, żeby alert "wystawał"
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text_primary: {
    fontSize: 40,
    fontWeight: "600",
    color: "#ffff",
  },
  text_secondary: {
    fontSize: 30,
    fontWeight: "600",
    color: "#ffff",
  },

  pressed: {
    backgroundColor: COLORS.secondary,
    transform: [{ scale: 0.98 }],
  },

  mark: {
    position: "absolute", // Klucz do sukcesu!
    top: -8, // Ujemna wartość sprawia, że wystaje do góry
    right: -8, // Ujemna wartość sprawia, że wystaje w prawo
    zIndex: 1,
  },
});
