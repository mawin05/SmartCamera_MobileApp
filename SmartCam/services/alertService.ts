import { AlertItem } from "@/constants/types";

const MOCK_ALERTS: AlertItem[] = [
  {
    id: "1",
    title: "Maciej",
    time: "16:20",
    image: require("../assets/images/maciej.jpg"),
    isNew: true,
  },
  {
    id: "2",
    title: "Krzysztof",
    time: "14:20",
    image: require("../assets/images/maciej.jpg"),
    isNew: true,
  },
  {
    id: "3",
    title: "Kacper",
    time: "12:20",
    image: require("../assets/images/kacper.jpg"),
    isNew: false,
  },
  {
    id: "4",
    title: "Lewy",
    time: "10:20",
    image: require("../assets/images/lewy.jpg"),
    isNew: false,
  },
  {
    id: "5",
    title: "Zupa",
    time: "69:67",
    image: require("../assets/images/zupa.jpg"),
    isNew: false,
  },
];

export const fetchAlerts = async (): Promise<AlertItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ALERTS);
    }, 1500); // Udajemy, że serwer myśli przez 1.5 sekundy
  });
};
