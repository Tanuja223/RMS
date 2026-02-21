import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./api";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // Clear old token on login load
  useEffect(() => {
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("role");
  }, []);

  const handleLogin = async () => {

    try {
const res = await API.post("/auth/login", {
  email: email.trim(),
  password: password.trim()
});


      const { token, user } = res.data;

      // Store in AsyncStorage (React Native version of localStorage)
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("role", user.role);
      await AsyncStorage.setItem("name", user.name);
      await AsyncStorage.setItem("email", user.email);
      await AsyncStorage.setItem("userId", user.id.toString());

      // Role-based navigation
      if (user.role === "customer") {
       router.replace("/(tabs)");

      }
      else if (user.role === "waiter") {
  router.replace("/waiterdashboard");
}
else if (user.role === "chef") {
  router.replace("/chefdashboard");
}
      else if (user.role === "admin") {
        router.replace("/admin");
      }
      else {
       router.replace("/(tabs)");

      }

    }
    catch (err) {
      Alert.alert("Error", "Invalid credentials");
    }

  };

  return (

    <View style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        {/* Password with eye toggle */}

        <View style={styles.passwordContainer}>

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eye}>
              {showPassword ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>
            Login
          </Text>
        </TouchableOpacity>
<TouchableOpacity
  onPress={() => router.push("/register")}
>
  <Text style={{ textAlign: "center", marginTop: 10 }}>
    New customer? Register here
  </Text>
</TouchableOpacity>


      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f4f6f8",
    padding: 20
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12
  },

  eye: {
    fontSize: 18
  },

  button: {
    backgroundColor: "#388e5c",
    padding: 15,
    borderRadius: 8,
    marginTop: 10
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },

  registerText: {
    marginTop: 15,
    textAlign: "center",
    color: "#388e5c"
  }

});
