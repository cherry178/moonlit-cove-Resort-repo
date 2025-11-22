const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Moonlit Cove backend is running" });
});

// List rooms with availability for given dates
app.get("/api/rooms", async (req, res) => {
  const { checkIn, nights } = req.query;

  try {
    // Get all rooms with tags
    const [rows] = await pool.query(`
      SELECT r.id,
             r.name,
             r.type,
             r.capacity,
             r.base_price as basePrice,
             r.description,
             GROUP_CONCAT(t.tag SEPARATOR '||') as tags
      FROM rooms r
      LEFT JOIN room_tags t ON r.id = t.room_id
      GROUP BY r.id
      ORDER BY r.base_price ASC
    `);

    if (!checkIn || !nights) {
      const rooms = rows.map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        capacity: row.capacity,
        basePrice: row.basePrice,
        description: row.description,
        tags: row.tags ? row.tags.split("||") : [],
        available: true,
      }));
      return res.json({ rooms });
    }

    const start = checkIn;
    const nightsInt = parseInt(nights, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !nightsInt || nightsInt <= 0) {
      return res.status(400).json({ error: "Invalid date or nights" });
    }

    // Calculate end date
    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + nightsInt);
    const endStr = endDate.toISOString().slice(0, 10);

    // Check for conflicts: bookings that overlap with the requested date range
    const [conflicts] = await pool.query(
      `
      SELECT DISTINCT room_id
      FROM bookings
      WHERE status = 'confirmed'
        AND (
          (from_date <= ? AND DATE_ADD(from_date, INTERVAL nights DAY) > ?)
          OR (from_date < ? AND DATE_ADD(from_date, INTERVAL nights DAY) >= ?)
        )
    `,
      [start, start, endStr, endStr]
    );

    const conflictIds = new Set(conflicts.map((c) => c.room_id));

    const rooms = rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      capacity: row.capacity,
      basePrice: row.basePrice,
      description: row.description,
      tags: row.tags ? row.tags.split("||") : [],
      available: !conflictIds.has(row.id),
    }));

    res.json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to load rooms" });
  }
});

// List services
app.get("/api/services", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, name, description, price
      FROM services
      ORDER BY price ASC
    `);
    res.json({ services: rows });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to load services" });
  }
});

// Helper: insert or get user row based on auth_id
async function getOrCreateUser(authId, displayName) {
  try {
    // Try to get existing user
    const [existing] = await pool.query(
      "SELECT * FROM users WHERE auth_id = ?",
      [authId]
    );

    if (existing.length > 0) {
      return existing[0];
    }

    // Create new user
    const [result] = await pool.query(
      "INSERT INTO users (auth_id, display_name) VALUES (?, ?)",
      [authId, displayName]
    );

    const [created] = await pool.query("SELECT * FROM users WHERE id = ?", [
      result.insertId,
    ]);

    return created[0];
  } catch (error) {
    console.error("Error in getOrCreateUser:", error);
    throw error;
  }
}

// Create a booking with ACID guarantees
app.post("/api/bookings", async (req, res) => {
  const {
    roomId,
    userAuthId,
    userDisplayName,
    fromDate,
    nights,
    guests,
    serviceIds = [],
    paymentMethod,
    paymentRef,
  } = req.body || {};

  if (
    !roomId ||
    !userAuthId ||
    !userDisplayName ||
    !fromDate ||
    !nights ||
    !guests ||
    !paymentMethod
  ) {
    return res.status(400).json({ error: "Missing required booking fields" });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fromDate)) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  const nightsInt = parseInt(nights, 10);
  const guestsInt = parseInt(guests, 10);
  if (!nightsInt || nightsInt <= 0 || !guestsInt || guestsInt <= 0) {
    return res.status(400).json({ error: "Invalid nights or guests" });
  }

  let user;
  try {
    user = await getOrCreateUser(userAuthId, userDisplayName);
  } catch (err) {
    console.error("Error resolving user:", err);
    return res.status(500).json({ error: "Failed to resolve user" });
  }

  // Get a connection for transaction
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Calculate end date
    const startDate = new Date(fromDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + nightsInt);
    const endStr = endDate.toISOString().slice(0, 10);

    // Check for conflicts
    const [conflicts] = await connection.query(
      `
      SELECT 1
      FROM bookings
      WHERE room_id = ?
        AND status = 'confirmed'
        AND (
          (from_date <= ? AND DATE_ADD(from_date, INTERVAL nights DAY) > ?)
          OR (from_date < ? AND DATE_ADD(from_date, INTERVAL nights DAY) >= ?)
        )
      LIMIT 1
    `,
      [roomId, startDate.toISOString().slice(0, 10), startDate.toISOString().slice(0, 10), endStr, endStr]
    );

    if (conflicts.length > 0) {
      await connection.rollback();
      return res.status(409).json({
        error: "Room already booked for these dates.",
      });
    }

    // Insert booking
    const [result] = await connection.query(
      `
      INSERT INTO bookings (
        room_id, user_id, from_date, nights, guests, payment_method, payment_ref
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [
        roomId,
        user.id,
        fromDate,
        nightsInt,
        guestsInt,
        paymentMethod,
        paymentRef || null,
      ]
    );

    const bookingId = result.insertId;

    // Insert booking services if any
    if (Array.isArray(serviceIds) && serviceIds.length > 0) {
      for (const serviceId of serviceIds) {
        await connection.query(
          "INSERT INTO booking_services (booking_id, service_id) VALUES (?, ?)",
          [bookingId, serviceId]
        );
      }
    }

    await connection.commit();
    res.status(201).json({ bookingId });
  } catch (error) {
    await connection.rollback();
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  } finally {
    connection.release();
  }
});

// Cancel a booking
app.delete("/api/bookings/:id", async (req, res) => {
  const { id } = req.params;
  const { userAuthId } = req.body;

  if (!userAuthId) {
    return res.status(400).json({ error: "userAuthId required" });
  }

  try {
    // Get user
    const [users] = await pool.query("SELECT * FROM users WHERE auth_id = ?", [
      userAuthId,
    ]);

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = users[0].id;

    // Check if booking exists and belongs to user
    const [bookings] = await pool.query(
      "SELECT * FROM bookings WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        error: "Booking not found or not owned by user",
      });
    }

    // Update status to cancelled
    await pool.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
      [id]
    );

    res.json({ ok: true, message: "Booking cancelled" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

// Get user's bookings
app.get("/api/bookings", async (req, res) => {
  const { userAuthId } = req.query;

  if (!userAuthId) {
    return res.status(400).json({ error: "userAuthId required" });
  }

  try {
    // Get user
    const [users] = await pool.query("SELECT * FROM users WHERE auth_id = ?", [
      userAuthId,
    ]);

    if (users.length === 0) {
      return res.json({ bookings: [] });
    }

    const userId = users[0].id;

    // Get bookings with room and service details
    const [bookings] = await pool.query(
      `
      SELECT b.id, b.room_id, b.from_date, b.nights, b.guests,
             b.payment_method, b.status, b.created_at,
             r.name as room_name, r.type as room_type,
             GROUP_CONCAT(s.name SEPARATOR ', ') as services
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      LEFT JOIN booking_services bs ON b.id = bs.booking_id
      LEFT JOIN services s ON bs.service_id = s.id
      WHERE b.user_id = ? AND b.status = 'confirmed'
      GROUP BY b.id
      ORDER BY b.created_at DESC
    `,
      [userId]
    );

    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to load bookings" });
  }
});

app.listen(PORT, () => {
  console.log(`Moonlit Cove backend listening on port ${PORT}`);
});
