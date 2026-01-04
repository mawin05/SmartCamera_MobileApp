import AlertMax from "@/components/ui/alertMax";
import { GlobalStyles } from "@/styles/GlobalStyles";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

function AlertDetails() {
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <AlertMax></AlertMax>
    </SafeAreaView>
  );
}

export default AlertDetails;
