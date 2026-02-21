import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";

import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


const categoryLabels = {
  veg: "Veg Starters",
  nonveg_starters: "Non-Veg Starters",
  main_veg: "Veg Main Items",
  nonveg: "Non-Veg Main Items",
  desserts: "Desserts"
};


export default function CustomerOrder() {

  const { category } = useLocalSearchParams();

  const router = useRouter();

  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  const BASE_URL = "http://10.60.247.229:4300/api";


  /* AUTH CHECK */

  useEffect(() => {
    checkAuth();
  }, []);


  const checkAuth = async () => {

    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role");

    if (!token || role !== "customer") {
      router.replace("/login");
    }

  };


  /* FETCH MENU */

  useEffect(() => {
    fetchMenu();
  }, [category]);


  const fetchMenu = async () => {

    try {

      const res = await axios.get(
        `${BASE_URL}/menuitems/${category}`
      );

      setItems(res.data);

      const qty = {};

      res.data.forEach(item => {
        qty[item.id] = 0;
      });

      setQuantities(qty);

    } catch (err) {
      console.log(err);
    }

  };


  /* INCREASE */

  const increaseQty = (id) => {

    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] + 1
    }));

  };


  /* DECREASE */

  const decreaseQty = (id) => {

    setQuantities(prev => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0
    }));

  };


  /* ADD TO CART */

  const handleAddToCart = async (item) => {

    const qty = quantities[item.id];

    if (qty === 0) return;

    try {

      let cart = await AsyncStorage.getItem("cart");

      cart = cart ? JSON.parse(cart) : [];

      const existing = cart.find(i => i.id === item.id);

      if (existing) {

        existing.quantity += qty;

      } else {

        cart.push({
          ...item,
          quantity: qty
        });

      }

      await AsyncStorage.setItem(
        "cart",
        JSON.stringify(cart)
      );

      Alert.alert("Added", `${item.name} added to cart`);

      setQuantities(prev => ({
        ...prev,
        [item.id]: 0
      }));

    } catch {

      Alert.alert("Error", "Failed to add to cart");

    }

  };


  /* UI */

  return (

    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.headerContainer}>

        <Text style={styles.header}>
          {categoryLabels[category] || "Menu"}
        </Text>

      </View>


      {/* CART BUTTON */}

      <TouchableOpacity
        style={styles.cartBtn}
        onPress={() => router.push("/cart")}
      >

        <Text style={styles.cartText}>
          🛒 Go to Cart
        </Text>

      </TouchableOpacity>


      {/* MENU LIST */}

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {items.map(item => {

          const qty = quantities[item.id] || 0;
          const total = qty * item.price;

          return (

            <View
              key={item.id}
              style={styles.card}
            >

              {/* NAME */}

              <Text style={styles.name}>
                {item.name}
              </Text>


              {/* PRICE */}

              <Text style={styles.price}>
                ₹{item.price}
              </Text>


              {/* QTY CONTROL */}

              <View style={styles.qtyRow}>

                <View style={styles.qtyContainer}>

                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() =>
                      decreaseQty(item.id)
                    }
                  >

                    <Text style={styles.qtyBtnText}>
                      −
                    </Text>

                  </TouchableOpacity>


                  <Text style={styles.qty}>
                    {qty}
                  </Text>


                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() =>
                      increaseQty(item.id)
                    }
                  >

                    <Text style={styles.qtyBtnText}>
                      +
                    </Text>

                  </TouchableOpacity>

                </View>


                {/* TOTAL */}

                <Text style={styles.total}>
                  ₹{total}
                </Text>

              </View>


              {/* ADD BUTTON */}

              <TouchableOpacity
                style={[
                  styles.addBtn,
                  qty === 0 &&
                  styles.disabledBtn
                ]}
                disabled={qty === 0}
                onPress={() =>
                  handleAddToCart(item)
                }
              >

                <Text style={styles.addText}>
                  Add to Cart
                </Text>

              </TouchableOpacity>

            </View>

          );

        })}

      </ScrollView>

    </View>

  );

}


/* STYLES */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#f4f6f8"
  },

  headerContainer: {
    backgroundColor: "#2e8b57",
    padding: 16,
    elevation: 4
  },

  header: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center"
  },

cartBtn: {
  backgroundColor: "#153562",
  margin: 15,
  padding: 14,
  borderRadius: 10,
  alignItems: "center",
  elevation: 3
},

  cartText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 3
  },

  name: {
    fontSize: 18,
    fontWeight: "bold"
  },

  price: {
    fontSize: 16,
    color: "#666",
    marginTop: 4
  },

  qtyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12
  },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center"
  },

  qtyBtn: {
    backgroundColor: "#2e8b57",
    padding: 8,
    borderRadius: 6
  },

  qtyBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },

  qty: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: "bold"
  },

  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e8b57"
  },

  addBtn: {
    backgroundColor: "#2e8b57",
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: "center"
  },

  disabledBtn: {
    backgroundColor: "#aaa"
  },

  addText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  }

});