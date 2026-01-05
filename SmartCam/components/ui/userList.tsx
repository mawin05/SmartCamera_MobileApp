import { SPACING } from "@/constants/theme";
import { User } from "@/constants/types";
import {
  fetchUsers,
  getUsersFromCache,
  saveUsersToCache,
} from "@/services/userService";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import UserEntry from "./userEntry";

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);

    const freshData = await fetchUsers();
    await saveUsersToCache(freshData);

    setUsers(freshData);
    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    loadData(true);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);

      const cachedData = await getUsersFromCache();

      if (cachedData && cachedData.length > 0) {
        setUsers(cachedData);
        setLoading(false);
        return;
      }

      const freshData = await fetchUsers();
      setUsers(freshData);
      saveUsersToCache(freshData);
      setLoading(false);
    };

    loadInitialData();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <UserEntry user={item}></UserEntry>}
      onRefresh={handleRefresh}
      refreshing={isRefreshing}
      contentContainerStyle={styles.listContent}
      style={{ flex: 1, width: "100%" }}
    ></FlatList>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 20,
    paddingBottom: 40,
    gap: SPACING.m,
  },
});

export default UserList;
