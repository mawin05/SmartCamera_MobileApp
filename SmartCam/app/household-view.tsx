import UserList from "@/components/ui/userList";
import { GlobalStyles } from "@/styles/GlobalStyles";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

function HouseholdView() {
  return (
    <SafeAreaView style={GlobalStyles.container}>
      <UserList></UserList>
    </SafeAreaView>
  );
}

export default HouseholdView;
