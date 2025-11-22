# 🌙 Moonlit Cove Resort Management System
<<<<<<< HEAD
=======

A full-stack web application for managing resort bookings with a complete booking management system, featuring user authentication, room reservations, service bookings, and payment processing.

## ✨ Features

- **User Authentication**: Mobile/OTP and Gmail login options
- **Room Booking**: Browse and book rooms with date selection and availability checking
- **Service Booking**: Add additional services to your reservation
- **Payment Integration**: Support for both Card and UPI payment methods
- **Booking Management**: View and cancel your bookings
- **Image Gallery**: Beautiful room galleries with multiple images per room
- **ACID Compliance**: Database transactions ensure data integrity and prevent double-bookings
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3
- JavaScript (ES6+)

**Backend:**
- Node.js
- Express.js

**Database:**
- MySQL

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm

2. Install dependencies:
```bash
npm install
```

3. Configure MySQL:
   - Update `backend/db.js` with your MySQL credentials
   - The database and tables will be created automatically on first run

4. Start the backend server:
```bash
npm start
```

5. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js http-server
npx http-server
```

## 📁 Project Structure

```
Resort/
├── index.html          # Main frontend HTML
├── styles.css          # Frontend styling
├── app.js              # Frontend JavaScript logic
├── backend/
│   ├── server.js       # Express.js server
│   └── db.js           # Database connection and schema
├── ER_DIAGRAM.html     # Database ER diagram
└── README.md           # Project documentation
```

## 🗄️ Database Schema

The system uses a normalized MySQL database with the following tables:
- `users` - User authentication and profiles
- `rooms` - Room information and pricing
- `room_tags` - Room features/tags
- `services` - Additional services
- `bookings` - Room reservations
- `booking_services` - Many-to-many relationship for booking services

See `ER_DIAGRAM.html` for the complete Entity-Relationship diagram.

## 🔐 Security Features

- ACID-compliant transactions prevent double-bookings
- Input validation on both frontend and backend
- Secure password handling (MySQL authentication)


## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📝 License

This project is open source and available under the MIT License.

Built with ❤️ using Node.js, Express.js, and MySQL
>>>>>>> 6e586240cbae5703b7c6b46d443bde19074b2886

A full-stack web application for managing resort bookings with a complete booking management system, featuring user authentication, room reservations, service bookings, and payment processing.

## ✨ Features

- **User Authentication**: Mobile/OTP and Gmail login options
- **Room Booking**: Browse and book rooms with date selection and availability checking
- **Service Booking**: Add additional services to your reservation
- **Payment Integration**: Support for both Card and UPI payment methods
- **Booking Management**: View and cancel your bookings
- **Image Gallery**: Beautiful room galleries with multiple images per room
- **ACID Compliance**: Database transactions ensure data integrity and prevent double-bookings
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3
- JavaScript (ES6+)

**Backend:**
- Node.js
- Express.js

**Database:**
- MySQL

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/moonlit-cove-resort.git
cd moonlit-cove-resort
```

2. Install dependencies:
```bash
npm install
```

3. Configure MySQL:
   - Update `backend/db.js` with your MySQL credentials
   - The database and tables will be created automatically on first run

4. Start the backend server:
```bash
npm start
```

5. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js http-server
npx http-server
```

## 📁 Project Structure

```
Resort/
├── index.html          # Main frontend HTML
├── styles.css          # Frontend styling
├── app.js              # Frontend JavaScript logic
├── backend/
│   ├── server.js       # Express.js server
│   └── db.js           # Database connection and schema
├── ER_DIAGRAM.html     # Database ER diagram
└── README.md           # Project documentation
```

## 🗄️ Database Schema

The system uses a normalized MySQL database with the following tables:
- `users` - User authentication and profiles
- `rooms` - Room information and pricing
- `room_tags` - Room features/tags
- `services` - Additional services
- `bookings` - Room reservations
- `booking_services` - Many-to-many relationship for booking services

See `ER_DIAGRAM.html` for the complete Entity-Relationship diagram.

## 🔐 Security Features

- ACID-compliant transactions prevent double-bookings
- Input validation on both frontend and backend
- Secure password handling (MySQL authentication)

## 📸 Screenshots

[Add screenshots of your application here]

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

[Your Name]

---

Built with ❤️ using Node.js, Express.js, and MySQL
