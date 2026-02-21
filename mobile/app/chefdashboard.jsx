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

export default function ChefDashboard() {

  const [orders, setOrders] = useState([]);

  const BASE_URL = "http://10.60.247.229:4300/api";

  useEffect(() => {
    fetchOrders();
  }, []);

  /* FETCH ORDERS */

  const fetchOrders = async () => {

    try {

      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        `${BASE_URL}/orders/chef`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOrders(res.data);

    } catch (err) {

      console.log(err);

      Alert.alert("Error", "Failed to load chef orders");

    }

  };

  /* UPDATE STATUS */

  const updateStatus = async (orderId, status) => {

    try {

      const token = await AsyncStorage.getItem("token");

      await axios.patch(
        `${BASE_URL}/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Alert.alert("Success", "Order updated");

      fetchOrders();

    } catch (err) {

      console.log(err);

      Alert.alert("Error", "Failed to update order");

    }

  };

  return (

    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        👨‍🍳 Kitchen Orders
      </Text>

      {orders.length === 0 && (

        <Text style={styles.empty}>
          No active orders
        </Text>

      )}

      {orders.map(order => (

        <View key={order.order_id} style={styles.card}>

          <Text style={styles.orderId}>
            Order #{order.order_id}
          </Text>

          <Text>
            {order.item_name} × {order.quantity}
          </Text>

          <Text style={styles.status}>
            Status: {order.status}
          </Text>

          {/* Pending */}

          {order.status === "pending" && (

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                updateStatus(order.order_id, "preparing")
              }
            >
              <Text style={styles.buttonText}>
                Start Preparing
              </Text>
            </TouchableOpacity>

          )}

          {/* Preparing */}

          {order.status === "preparing" && (

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                updateStatus(order.order_id, "served")
              }
            >
              <Text style={styles.buttonText}>
                Mark as Served
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
    fontWeight: "bold",
    fontSize: 18
  },

  status: {
    marginVertical: 10,
    fontWeight: "bold"
  },

  button: {
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
