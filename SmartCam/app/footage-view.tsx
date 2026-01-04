import EntryList from "@/components/ui/entryList";
import { GlobalStyles } from "@/styles/GlobalStyles";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

function FootageView() {
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <EntryList></EntryList>
    </SafeAreaView>
  );
}

export default FootageView;
