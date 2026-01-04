// types/alert.ts
import { ImageSourcePropType } from "react-native";

export interface AlertItem {
  id: string;
  title: string;
  image: ImageSourcePropType; // Obsłuży zarówno require(...), jak i { uri: '...' }
  time: string;
  isNew: boolean;
}

export interface User {
  id: string;
  name: string;
  image: ImageSourcePropType;
}
