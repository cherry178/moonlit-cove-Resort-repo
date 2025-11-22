# Moonlit Cove Resort - Entity Relationship Diagram

## ER Diagram (Mermaid Format)

```mermaid
erDiagram
    USERS {
        int id PK
        varchar auth_id UK "Unique identifier (phone_xxx or gmail_xxx)"
        varchar display_name
        timestamp created_at
    }
    
    ROOMS {
        varchar id PK
        varchar name
        varchar type
        int capacity
        int base_price
        text description
        text hero_image
    }
    
    ROOM_TAGS {
        int id PK
        varchar room_id FK
        varchar tag
    }
    
    SERVICES {
        varchar id PK
        varchar name
        text description
        int price
    }
    
    BOOKINGS {
        int id PK
        varchar room_id FK
        int user_id FK
        date from_date
        int nights
        int guests
        enum payment_method "card or upi"
        varchar payment_ref
        enum status "confirmed or cancelled"
        timestamp created_at
    }
    
    BOOKING_SERVICES {
        int booking_id PK,FK
        varchar service_id PK,FK
    }
    
    USERS ||--o{ BOOKINGS : "makes"
    ROOMS ||--o{ BOOKINGS : "booked_in"
    ROOMS ||--o{ ROOM_TAGS : "has"
    BOOKINGS ||--o{ BOOKING_SERVICES : "includes"
    SERVICES ||--o{ BOOKING_SERVICES : "selected_in"
```

## Relationships

1. **USERS → BOOKINGS** (One-to-Many)
   - One user can make multiple bookings
   - Each booking belongs to one user

2. **ROOMS → BOOKINGS** (One-to-Many)
   - One room can have multiple bookings (at different times)
   - Each booking is for one room

3. **ROOMS → ROOM_TAGS** (One-to-Many)
   - One room can have multiple tags
   - Each tag belongs to one room

4. **BOOKINGS ↔ SERVICES** (Many-to-Many via BOOKING_SERVICES)
   - One booking can include multiple services
   - One service can be in multiple bookings
   - Junction table: BOOKING_SERVICES

## Table Descriptions

### USERS
- Stores user authentication and profile information
- `auth_id`: Unique identifier (e.g., "phone_+919876543210" or "gmail_user@example.com")
- `display_name`: User's display name

### ROOMS
- Stores room types and details
- `id`: Unique room identifier (e.g., "moon-suite", "cove-retreat")
- `base_price`: Price per night in INR

### ROOM_TAGS
- Stores tags/features for each room (e.g., "Ocean view", "Private balcony")
- Many-to-one relationship with ROOMS

### SERVICES
- Stores optional services (e.g., "Moonlight Spa Ritual", "Private Cove Dinner")
- `id`: Unique service identifier (e.g., "spa-ritual", "private-dinner")

### BOOKINGS
- Stores booking transactions
- `from_date`: Check-in date
- `nights`: Number of nights
- `status`: "confirmed" or "cancelled"
- Foreign keys to USERS and ROOMS

### BOOKING_SERVICES
- Junction table linking bookings to services
- Composite primary key: (booking_id, service_id)
- Allows many-to-many relationship between bookings and services

