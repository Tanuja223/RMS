import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Profile() {

  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {

    const token = await AsyncStorage.getItem("token");
    const storedName = await AsyncStorage.getItem("name");
    const storedEmail = await AsyncStorage.getItem("email");

    if (token) {
      setIsLoggedIn(true);
      setName(storedName || "User");
      setEmail(storedEmail || "");
    } else {
      setIsLoggedIn(false);
    }

  };

  const logout = async () => {

    await AsyncStorage.clear();

    Alert.alert("Logged out successfully");

    router.replace("/login");

  };

  const firstLetter = name ? name.charAt(0).toUpperCase() : "U";

  return (

    <ScrollView style={styles.container}>

      {/* TOP PROFILE SECTION */}

      <View style={styles.profileHeader}>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {firstLetter}
          </Text>
        </View>

        {isLoggedIn ? (
          <>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </>
        ) : (
          <>
            <Text style={styles.name}>Welcome</Text>
            <Text style={styles.email}>Login to continue</Text>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/register")}
            >
              <Text style={styles.signupText}>
                Create an account
              </Text>
            </TouchableOpacity>

          </>
        )}

      </View>

      {/* MENU SECTION */}

      {isLoggedIn && (

        <View style={styles.card}>

          <MenuItem
            icon="📦"
            title="My Orders"
            onPress={() => router.push("/orders")}
          />

          <MenuItem
            icon="👤"
            title="Profile Details"
            onPress={() => {}}
          />

          <MenuItem
            icon="🚪"
            title="Logout"
            onPress={logout}
            danger
          />

        </View>

      )}

    </ScrollView>

  );

}

function MenuItem({ icon, title, onPress, danger }) {

  return (

    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
    >

      <Text style={styles.menuIcon}>
        {icon}
      </Text>

      <Text style={[
        styles.menuText,
        danger && { color: "#ff5200" }
      ]}>
        {title}
      </Text>

    </TouchableOpacity>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f2f2f2"
  },

  profileHeader: {
    backgroundColor: "white",
    padding: 30,
    alignItems: "center",
    marginBottom: 10
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ff5200",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },

  avatarText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold"
  },

  name: {
    fontSize: 22,
    fontWeight: "bold"
  },

  email: {
    color: "gray",
    marginTop: 4,
    marginBottom: 10
  },

  loginBtn: {
    borderWidth: 1,
    borderColor: "#ff5200",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10
  },

  loginText: {
    color: "#ff5200",
    fontWeight: "bold"
  },

  signupText: {
    color: "#ff5200",
    marginTop: 10
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 15,
    borderRadius: 10,
    paddingVertical: 10
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },

  menuIcon: {
    fontSize: 20,
    marginRight: 15
  },

  menuText: {
    fontSize: 16
  }

});