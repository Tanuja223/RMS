import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import API from "./api";

export default function Register() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {

      await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim()
      });

      Alert.alert(
        "Success",
        "Registration successful. Please login."
      );

      router.replace("/login");

    }
    catch (err) {

      Alert.alert(
        "Error",
        err.response?.data?.message || "Registration failed"
      );

    }

  };

  return (

    <View style={styles.container}>

      <View style={styles.card}>

        <Text style={styles.title}>Register</Text>

        {/* Name */}
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        {/* Email */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        {/* Password */}
        <View style={styles.passwordContainer}>

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />

          <TouchableOpacity
            onPress={() =>
              setShowPassword(!showPassword)
            }
          >
            <Text style={styles.eye}>
              {showPassword ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>

        </View>

        {/* Confirm Password */}
        <View style={styles.passwordContainer}>

          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.passwordInput}
          />

          <TouchableOpacity
            onPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            <Text style={styles.eye}>
              {showConfirmPassword ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>

        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>
            Register
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.loginText}>
            Already have an account? Login
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

  loginText: {
    marginTop: 15,
    textAlign: "center",
    color: "#388e5c"
  }

});
