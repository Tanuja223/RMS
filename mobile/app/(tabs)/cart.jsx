import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

export default function Cart() {

  const router = useRouter();

  const [cart, setCart] = useState([]);

  const BASE_URL = "http://10.60.247.229:4300/api";


  /* LOAD CART */

  useEffect(() => {
    loadCart();
  }, []);


  const loadCart = async () => {

    try {

      const storedCart = await AsyncStorage.getItem("cart");

      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

    } catch (error) {
      console.log("Error loading cart:", error);
    }

  };


  /* SAVE CART */

  const saveCart = async (newCart) => {

    try {

      setCart(newCart);

      await AsyncStorage.setItem(
        "cart",
        JSON.stringify(newCart)
      );

    } catch (error) {
      console.log("Error saving cart:", error);
    }

  };


  /* REMOVE ITEM */

  const removeFromCart = async (id) => {

    const newCart = cart.filter(
      item => item.id !== id
    );

    await saveCart(newCart);

  };


  /* CLEAR CART */

  const clearCart = async () => {

    await AsyncStorage.removeItem("cart");

    setCart([]);

  };


  /* TOTAL */

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );


  /* PLACE ORDER */

  const placeOrder = async () => {

    try {

      const token = await AsyncStorage.getItem("token");

      if (!token) {

        Alert.alert("Login Required", "Please login first");

        router.push("/login");

        return;
      }


      const orderData = {

        items: cart.map(item => ({

          menu_item_id: item.id,
          quantity: item.quantity

        }))

      };


      await axios.post(

        `${BASE_URL}/orders/place`,
        orderData,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );


      Alert.alert(
        "Success",
        "Order placed successfully"
      );


      await clearCart();

      router.replace("/");


    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        error.response?.data?.message ||
        "Order failed"
      );

    }

  };


  /* UI */

  return (

    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.headerContainer}>

        <Text style={styles.header}>
          🛒 Your Cart
        </Text>

      </View>


      {/* EMPTY CART */}

      {cart.length === 0 ? (

        <View style={styles.emptyContainer}>

          <Text style={styles.emptyIcon}>
            🛒
          </Text>

          <Text style={styles.emptyText}>
            Your cart is empty
          </Text>

        </View>

      ) : (

        <>

          {/* CART LIST */}

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{
              paddingBottom: 140
            }}
            showsVerticalScrollIndicator={false}
          >

            {cart.map(item => (

              <View
                key={item.id}
                style={styles.card}
              >

                <View style={styles.cardTop}>

                  <Text style={styles.itemName}>
                    {item.name}
                  </Text>

                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() =>
                      removeFromCart(item.id)
                    }
                  >

                    <Text style={styles.removeText}>
                      Remove
                    </Text>

                  </TouchableOpacity>

                </View>


                <View style={styles.cardBottom}>

                  <Text style={styles.quantity}>
                    ₹{item.price} × {item.quantity}
                  </Text>

                  <Text style={styles.itemTotal}>
                    ₹{item.price * item.quantity}
                  </Text>

                </View>

              </View>

            ))}

          </ScrollView>


          {/* FOOTER */}

          <View style={styles.footer}>

            <View style={styles.totalRow}>

              <Text style={styles.totalLabel}>
                Total Amount
              </Text>

              <Text style={styles.totalAmount}>
                ₹{total}
              </Text>

            </View>


            <TouchableOpacity
              style={styles.orderBtn}
              onPress={placeOrder}
            >

              <Text style={styles.orderText}>
                Place Order
              </Text>

            </TouchableOpacity>

          </View>

        </>

      )}

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
    paddingVertical: 16,
    elevation: 5
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white"
  },

  scroll: {
    flex: 1
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  emptyIcon: {
    fontSize: 60
  },

  emptyText: {
    fontSize: 18,
    color: "#555",
    marginTop: 10
  },

  card: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 3
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  itemName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1
  },

  removeBtn: {
    backgroundColor: "#ff5252",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6
  },

  removeText: {
    color: "white",
    fontWeight: "bold"
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },

  quantity: {
    fontSize: 16,
    color: "#666"
  },

  itemTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e8b57"
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    elevation: 10
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },

  totalLabel: {
    fontSize: 18
  },

  totalAmount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e8b57"
  },

  orderBtn: {
    backgroundColor: "#2e8b57",
    padding: 16,
    borderRadius: 10,
    alignItems: "center"
  },

  orderText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  }

});