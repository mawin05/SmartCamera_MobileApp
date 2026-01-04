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
    paddingHorizontal: SPACING.l, // Odstęp lewo-prawo
    minHeight: 80, // Minimalna wysokość, żeby zawsze dobrze wyglądało

    borderRadius: 15, // Nieco mniejsze zaokrąglenie wygląda lepiej na paskach

    flexDirection: "row", // Przygotowanie pod ikonę obok tekstu
    justifyContent: "flex-start", // Tekst zaczyna się od lewej
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
});
