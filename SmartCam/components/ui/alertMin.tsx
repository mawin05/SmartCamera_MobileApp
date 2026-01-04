import { GlobalStyles } from "@/styles/GlobalStyles";
import React from "react";
import { Pressable, Text } from "react-native";

interface Props {
  children: string;
}

function AlertMin({ children }: Props) {
  return (
    <Pressable style={GlobalStyles.singleEntry}>
      <Text>{children}</Text>
    </Pressable>
  );
}

export default AlertMin;
