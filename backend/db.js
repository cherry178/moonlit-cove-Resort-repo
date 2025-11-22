const mysql = require("mysql2/promise");

// Database configuration with environment variable support for deployment
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Root@123",
  database: process.env.DB_NAME || "moonlit_cove_resort",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and seed data
async function initializeDb() {
  try {
    // Create database if it doesn't exist (only for local development)
    // In production, database is usually pre-created
    if (process.env.NODE_ENV !== 'production') {
      const adminPool = mysql.createPool({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        waitForConnections: true,
        connectionLimit: 10,
      });

      await adminPool.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
      await adminPool.end();
    }

    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        auth_id VARCHAR(255) NOT NULL UNIQUE,
        display_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        capacity INT NOT NULL,
        base_price INT NOT NULL,
        description TEXT,
        hero_image TEXT
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS room_tags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id VARCHAR(64) NOT NULL,
        tag VARCHAR(255) NOT NULL,
        FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price INT NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id VARCHAR(64) NOT NULL,
        user_id INT NOT NULL,
        from_date DATE NOT NULL,
        nights INT NOT NULL,
        guests INT NOT NULL,
        payment_method ENUM('card','upi') NOT NULL,
        payment_ref VARCHAR(255),
        status ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS booking_services (
        booking_id INT NOT NULL,
        service_id VARCHAR(64) NOT NULL,
        PRIMARY KEY (booking_id, service_id),
        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id)
      )
    `);

    // Seed rooms and services
    await seedRoomsAndServices();
    console.log("Database initialized and seeded successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

async function seedRoomsAndServices() {
  // Check if rooms already exist
  const [roomRows] = await pool.query("SELECT COUNT(*) as count FROM rooms");
  if (roomRows[0].count > 0) return;

  const rooms = [
    {
      id: "moon-suite",
      name: "Ocean Moon Suite",
      type: "Suite",
      capacity: 4,
      base_price: 8500,
      description:
        "Spacious corner suite with full ocean panorama, private balcony, and curated welcome amenities.",
      tags: ["Ocean view", "Private balcony", "Breakfast included"],
    },
    {
      id: "cove-retreat",
      name: "Cove Retreat Room",
      type: "Deluxe Room",
      capacity: 3,
      base_price: 6500,
      description:
        "Cozy retreat with partial sea view, king bed, and a calming rain shower for unwinding.",
      tags: ["Partial sea view", "King bed", "Rain shower"],
    },
    {
      id: "garden-moon",
      name: "Garden Moon Villa",
      type: "Villa",
      capacity: 6,
      base_price: 10500,
      description:
        "Standalone villa surrounded by tropical gardens, with outdoor tub and dedicated butler service.",
      tags: ["Private garden", "Outdoor tub", "Butler on call"],
    },
    {
      id: "lagoon-premium",
      name: "Lagoon Premium Room",
      type: "Premium Room",
      capacity: 2,
      base_price: 7200,
      description:
        "Elegant room overlooking the tranquil lagoon, perfect for couples seeking a quiet escape.",
      tags: ["Lagoon view", "Queen bed", "Evening turndown"],
    },
    {
      id: "family-cove",
      name: "Family Cove Suite",
      type: "Family Suite",
      capacity: 5,
      base_price: 9800,
      description:
        "Ideal for families, with two bedrooms, shared living area, and special kids' welcome kit.",
      tags: ["Two bedrooms", "Living area", "Kids welcome kit"],
    },
    {
      id: "skyline-loft",
      name: "Skyline Loft",
      type: "Loft Suite",
      capacity: 3,
      base_price: 9000,
      description:
        "Top-floor loft with panoramic cove views, high ceilings, and a comfortable work space.",
      tags: ["Top floor", "Panoramic view", "Work desk"],
    },
    {
      id: "sunset-cabana",
      name: "Sunset Beach Cabana",
      type: "Cabana",
      capacity: 2,
      base_price: 8800,
      description:
        "Intimate beachside cabana set directly on the sand, with outdoor lounge and sunset views.",
      tags: ["On the sand", "Outdoor lounge", "Direct beach access"],
    },
  ];

  // Insert rooms
  for (const room of rooms) {
    await pool.query(
      `INSERT INTO rooms (id, name, type, capacity, base_price, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [room.id, room.name, room.type, room.capacity, room.base_price, room.description]
    );

    // Insert tags
    for (const tag of room.tags) {
      await pool.query(
        `INSERT INTO room_tags (room_id, tag) VALUES (?, ?)`,
        [room.id, tag]
      );
    }
  }

  // Check if services already exist
  const [serviceRows] = await pool.query("SELECT COUNT(*) as count FROM services");
  if (serviceRows[0].count > 0) return;

  const services = [
    {
      id: "spa-ritual",
      name: "Moonlight Spa Ritual",
      description: "90-minute ocean-inspired massage and body ritual.",
      price: 2500,
    },
    {
      id: "private-dinner",
      name: "Private Cove Dinner",
      description: "Five-course dinner on a candlelit deck by the water.",
      price: 3200,
    },
    {
      id: "sunrise-yoga",
      name: "Sunrise Yoga by the Sea",
      description: "Guided yoga session overlooking the rising sun.",
      price: 1500,
    },
    {
      id: "airport-transfer",
      name: "Airport Transfer",
      description: "Private car transfer to and from the resort.",
      price: 1800,
    },
  ];

  // Insert services
  for (const service of services) {
    await pool.query(
      `INSERT INTO services (id, name, description, price)
       VALUES (?, ?, ?, ?)`,
      [service.id, service.name, service.description, service.price]
    );
  }
}

// Initialize on module load
initializeDb().catch((err) => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});

module.exports = pool;
