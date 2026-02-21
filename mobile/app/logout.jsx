import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Logout() {

  const router = useRouter();

  useEffect(() => {

    const logoutUser = async () => {

      await AsyncStorage.clear();

      setTimeout(() => {
        router.replace("/(tabs)");
      }, 2000);

    };

    logoutUser();

  }, []);

  return (

    <View style={styles.container}>

      <View style={styles.box}>

        <Text style={styles.title}>
          You have been logged out
        </Text>

        <Text style={styles.subtitle}>
          Redirecting to home page...
        </Text>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8"
  },

  box: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    elevation: 5
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center"
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "gray"
  }

});
