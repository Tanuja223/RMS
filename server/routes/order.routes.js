const express = require("express");
const db = require("../config/db");
const { verifyToken, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

/* =====================================================
   CUSTOMER – PLACE ORDER
   POST /api/orders/place
===================================================== */
router.post(
  "/place",
  verifyToken,
  authorizeRoles("customer"),
  async (req, res) => {
    const { items } = req.body;
    const customer_id = req.user.id;
    const table_id = 1;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    try {
      const [orderResult] = await db.promise().query(
        `INSERT INTO orders (table_id, customer_id, status, total_price)
         VALUES (?, ?, 'pending', 0)`,
        [table_id, customer_id]
      );

      const order_id = orderResult.insertId;
      let total = 0;

      for (const item of items) {
        const [[menu]] = await db.promise().query(
          `SELECT price FROM menuitems WHERE id = ?`,
          [item.menu_item_id]
        );

        if (!menu) {
          return res.status(400).json({
            message: `Menu item not found: ${item.menu_item_id}`
          });
        }

        total += menu.price * item.quantity;

        await db.promise().query(
          `INSERT INTO order_items (order_id, menu_item_id, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [order_id, item.menu_item_id, item.quantity, menu.price]
        );
      }

      await db.promise().query(
        `UPDATE orders SET total_price = ? WHERE id = ?`,
        [total, order_id]
      );

      res.status(201).json({
        message: "Order placed successfully",
        order_id,
        total_price: total
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Order failed" });
    }
  }
);


/* =====================================================
   WAITER – VIEW ACTIVE ORDERS
   GET /api/orders/waiter
===================================================== */
router.get(
  "/waiter",
  verifyToken,
  authorizeRoles("waiter"),
  (req, res) => {
    const sql = `
      SELECT 
        o.id AS order_id,
        o.status,
        o.created_at,
        SUM(oi.quantity * mi.price) AS total_price
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menuitems mi ON oi.menu_item_id = mi.id
      WHERE o.status IN ('pending', 'preparing', 'served')
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  }
);

/* =====================================================
   CHEF – VIEW KITCHEN ORDERS
   GET /api/orders/chef
===================================================== */
router.get(
  "/chef",
  verifyToken,
  authorizeRoles("chef"),
  (req, res) => {
    const sql = `
      SELECT 
        o.id AS order_id,
        o.status,
        mi.name,
        oi.quantity
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN menuitems mi ON oi.menu_item_id = mi.id
      WHERE o.status IN ('pending', 'preparing')
      ORDER BY o.created_at ASC
    `;

    db.query(sql, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  }
);
router.patch("/:id/status", verifyToken, (req, res) => {

  const orderId = req.params.id;
  const { status } = req.body;

  console.log("Order:", orderId, "Status:", status);

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, orderId],
    (err, result) => {

      if (err) {
        console.error(err);
        return res.status(500).json("Database error");
      }

      res.json("Status updated successfully");
    }
  );
});


/* =====================================================
   WAITER – CHECKOUT ORDER
   POST /api/orders/:id/checkout
===================================================== */
router.post(
  "/:id/checkout",
  verifyToken,
  authorizeRoles("waiter"),
  (req, res) => {
    const orderId = req.params.id;

    const billSql = `
      SELECT SUM(oi.quantity * mi.price) AS total
      FROM order_items oi
      JOIN menuitems mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `;

    db.query(billSql, [orderId], (err, bill) => {
      if (err) return res.status(500).json(err);

      const total = bill[0].total || 0;

      db.query(
        "UPDATE orders SET status = 'paid', total_price = ? WHERE id = ?",
        [total, orderId],
        () => {
          res.json({
            message: "Checkout completed",
            order_id: orderId,
            total
          });
        }
      );
    });
  }
);
/* =====================================================
   CUSTOMER – VIEW THEIR ORDERS
   GET /api/orders/customer
===================================================== */
router.get(
  "/customer",
  verifyToken,
  authorizeRoles("customer"),
  async (req, res) => {
    const customer_id = req.user.id;

    try {
      const [orders] = await db.promise().query(
        `SELECT 
           o.id AS order_id,
           o.status,
           o.total_price,
           o.created_at,
           mi.name,
           oi.quantity,
           oi.price
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         JOIN menuitems mi ON oi.menu_item_id = mi.id
         WHERE o.customer_id = ?
         ORDER BY o.created_at DESC`,
        [customer_id]
      );

      // Group items by order
      const grouped = {};

      orders.forEach(row => {
        if (!grouped[row.order_id]) {
          grouped[row.order_id] = {
            order_id: row.order_id,
            status: row.status,
            total_price: row.total_price,
            created_at: row.created_at,
            items: []
          };
        }

        grouped[row.order_id].items.push({
          name: row.name,
          quantity: row.quantity,
          price: row.price
        });
      });

      res.json(Object.values(grouped));

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load orders" });
    }
  }
);


module.exports = router;
