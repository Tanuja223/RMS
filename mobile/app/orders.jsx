import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Orders() {

  const [orders, setOrders] = useState([]);

  const BASE_URL = "http://10.60.247.229:4300/api";

  useEffect(() => {

    fetchOrders();

  }, []);

  const fetchOrders = async () => {

    try {

      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/orders/customer`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(res.data);

    } catch (err) {

      Alert.alert("Error", "Failed to load orders");

    }

  };

  const getStatusText = (status) => {

    if (status === "pending") return "🕒 Pending";
    if (status === "preparing") return "👨‍🍳 Preparing";
    if (status === "served") return "✅ Served";
    if (status === "paid") return "💰 Paid";

    return status;

  };

  const getStatusColor = (status) => {

    if (status === "pending") return "#ff9800";
    if (status === "preparing") return "#2196f3";
    if (status === "served") return "#4caf50";
    if (status === "paid") return "#9c27b0";

    return "#333";

  };

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        📦 My Orders
      </Text>

      {orders.length === 0 && (

        <Text style={styles.empty}>
          No orders yet
        </Text>

      )}

      {orders.map(order => (

        <View key={order.order_id} style={styles.card}>

          <Text style={styles.orderId}>
            Order ID: #{order.order_id}
          </Text>

          <Text style={styles.itemsTitle}>
            Items:
          </Text>

          {order.items.map((item, index) => (

            <Text key={index} style={styles.item}>

              {item.name} × {item.quantity} — ₹
              {item.price * item.quantity}

            </Text>

          ))}

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
    fontSize: 18,
    marginTop: 50
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3
  },

  orderId: {
    fontWeight: "bold",
    fontSize: 18
  },

  itemsTitle: {
    marginTop: 10,
    fontWeight: "bold"
  },

  item: {
    marginLeft: 10,
    marginTop: 3
  },

  total: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16
  },

  status: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16
  }

});
