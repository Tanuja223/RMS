import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";


export default function Home() {

  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);

  const [name, setName] = useState("Customer");
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    loadUser();
  }, []);


  const loadUser = async () => {

    const token = await AsyncStorage.getItem("token");
    const storedName = await AsyncStorage.getItem("name");
    const storedEmail = await AsyncStorage.getItem("email");

    if (token) {
      setIsLoggedIn(true);
      setName(storedName || "Customer");
      setEmail(storedEmail || "");
    }

  };


  const logout = async () => {

    await AsyncStorage.clear();

    setIsLoggedIn(false);
    setProfileOpen(false);

    router.replace("/login");

  };


  return (

    <View style={{ flex: 1 }}>


      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.logo}>
          Serve Smart
        </Text>

      </View>


      {/* PROFILE DROPDOWN */}

      {profileOpen && (

        <View style={styles.dropdown}>

          <Text style={styles.dropdownText}>
            {name}
          </Text>

          <Text style={styles.dropdownText}>
            {email}
          </Text>

          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => router.push("/orders")}
          >
            <Text>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={logout}
          >
            <Text>Logout</Text>
          </TouchableOpacity>

        </View>

      )}


      {/* MAIN CONTENT */}

      <ScrollView style={styles.container}>

        {/* HERO SECTION */}

        <ImageBackground
          source={{
            uri: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"
          }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >

          <View style={styles.heroOverlay}>

            <Text style={styles.heroTitle}>
              Delicious Food
            </Text>

            <Text style={styles.heroSubtitle}>
              Order fresh food directly from your table
            </Text>

          </View>

        </ImageBackground>


        {/* MENU */}

        <Text style={styles.sectionTitle}>
          Our Menu
        </Text>


        <MenuCard
          title="Veg Starters"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK9AipkI1X_82O6ZeY_u6GvKjZYrpHmVrNcQ&s"
          onPress={() => router.push("/customerorder?category=veg")}
        />

        <MenuCard
          title="Non-Veg Starters"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmEIQYVBoHKeq-n_GPa6UfiLP9Gws9EIxTIQ&s"
          onPress={() => router.push("/customerorder?category=nonveg_starters")}
        />

        <MenuCard
          title="Main Course (Veg)"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtg5mIsKoCIOAPR-LwNk001kEdZmaVRu1chA&s"
          onPress={() => router.push("/customerorder?category=main_veg")}
        />

        <MenuCard
          title="Main Course (Non-Veg)"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0qdyMwcMmfnjU0qQG2f15UCGW9DqMp7N7Hw&s"
          onPress={() => router.push("/customerorder?category=nonveg")}
        />

        <MenuCard
          title="Desserts"
          image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxpR7Ebfhvn1Bdu6TlQd_hrgExg2lbDDSYlQ&s"
          onPress={() => router.push("/customerorder?category=desserts")}
        />


        {/* ABOUT */}

        <View style={styles.about}>

          <Text style={styles.aboutTitle}>
            About Us
          </Text>

          <Text>
            Location: Hyderabad{"\n"}
            Hi-Tech City{"\n"}
            Contact: 9854626562
          </Text>

        </View>


        {/* FOOTER */}

        <View style={styles.footer}>

          <Text style={styles.footerText}>
            Thank You | Visit Again
          </Text>

        </View>

      </ScrollView>

    </View>

  );

}



/* MENU CARD COMPONENT */

function MenuCard({ title, image, onPress }) {

  return (

    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >

      <Image
        source={{ uri: image }}
        style={styles.image}
      />

      <Text style={styles.cardText}>
        {title}
      </Text>

    </TouchableOpacity>

  );

}



/* STYLES */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff"
  },

  header: {
    backgroundColor: "#2e8b57",
    padding: 15,
    alignItems: "center"
  },

  logo: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold"
  },

  dropdown: {
    backgroundColor: "#388e5c",
    padding: 10,
    borderRadius: 8,
    margin: 10
  },

  dropdownText: {
    color: "white"
  },

  dropdownBtn: {
    backgroundColor: "white",
    padding: 8,
    marginTop: 5,
    borderRadius: 5
  },


  /* HERO */

  hero: {
    height: 300,
    justifyContent: "center",
    alignItems: "center"
  },

  heroImage: {
    resizeMode: "cover"
  },

  heroOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },

  heroTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold"
  },

  heroSubtitle: {
    color: "white",
    fontSize: 16,
    marginTop: 10
  },


  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20
  },

  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 3
  },

  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },

  cardText: {
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },

  about: {
    padding: 20,
    backgroundColor: "#f5f5f5"
  },

  aboutTitle: {
    fontSize: 22,
    fontWeight: "bold"
  },

  footer: {
    backgroundColor: "#2e8b57",
    padding: 15,
    alignItems: "center"
  },

  footerText: {
    color: "white"
  }

});