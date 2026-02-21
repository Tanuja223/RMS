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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function WaiterDashboard() {

  const [orders, setOrders] = useState([]);

  const BASE_URL = "http://10.60.247.229:4300/api";

  /* FETCH ORDERS */

  const fetchOrders = async () => {

    try {

      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/orders/waiter`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(res.data);

    } catch (err) {

      console.log(err);

      Alert.alert("Error", "Failed to load orders");

    }

  };

  /* CHECKOUT */

  const handleCheckout = async (orderId) => {

    try {

      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        `${BASE_URL}/orders/${orderId}/checkout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Alert.alert(
        "Success",
        `Paid ₹${res.data.totalAmount}`
      );

      fetchOrders();

    } catch (err) {

      console.log(err);

      Alert.alert("Error", "Checkout failed");

    }

  };

  /* INITIAL LOAD */

  useEffect(() => {

    fetchOrders();

  }, []);

  /* AUTO REFRESH EVERY 5 SECONDS */

  useEffect(() => {

    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);

  }, []);

  const getStatusText = (status) => {

    if (status === "pending") return "🕒 Pending";
    if (status === "preparing") return "👨‍🍳 Preparing";
    if (status === "served") return "✅ Ready to Serve";

    return status;

  };

  const getStatusColor = (status) => {

    if (status === "pending") return "#ff9800";
    if (status === "preparing") return "#2196f3";
    if (status === "served") return "#4caf50";

    return "#333";

  };

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        🍽️ Active Orders
      </Text>

      {orders.length === 0 && (

        <Text style={styles.empty}>
          No active orders
        </Text>

      )}

      {orders.map(order => (

        <View key={order.order_id} style={styles.card}>

          <Text style={styles.orderId}>
            Order ID: #{order.order_id}
          </Text>

          <Text style={styles.total}>
            Total: ₹{order.total_price}
          </Text>

          <Text
            style={[
              styles.status,
              { color: getStatusColor(order.status) }
            ]}
          >
            {getStatusText(order.status)}
          </Text>

          {/* CHECKOUT BUTTON */}

          {order.status === "served" && (

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() =>
                handleCheckout(order.order_id)
              }
            >
              <Text style={styles.buttonText}>
                Checkout
              </Text>
            </TouchableOpacity>

          )}

        </View>

      ))}

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3
  },

  orderId: {
    fontSize: 18,
    fontWeight: "bold"
  },

  total: {
    marginTop: 5,
    fontSize: 16
  },

  status: {
    marginTop: 10,
    fontWeight: "bold"
  },

  checkoutBtn: {
    backgroundColor: "#2e8b57",
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    alignItems: "center"
  },

  buttonText: {
    color: "white",
    fontWeight: "bold"
  }

});
