import { AlertItem, User } from "./types";

export const ALERT = {
  name: "Maciej",
  image: "../../assets/images/maciej.jpg",
  time: "16:20",
};

export const ALERTS: AlertItem[] = [
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

export const USERS: User[] = [
  {
    id: "1",
    name: "Maciej",
    image: require("../assets/images/maciej.jpg"),
  },
  {
    id: "2",
    name: "Lewy",
    image: require("../assets/images/lewy.jpg"),
  },
  {
    id: "3",
    name: "Kacper",
    image: require("../assets/images/kacper.jpg"),
  },
];
