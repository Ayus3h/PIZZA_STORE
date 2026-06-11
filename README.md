# PIZZA_STORE

A comprehensive MERN (MongoDB, Express.js, React, Node.js) stack solution for online food ordering and restaurant management. This README reflects the final project state, incorporating all sprint objectives and advanced backend patterns.

## Features Overview (Final Project Status)

### Customer Features
- **Dynamic Menu:** Category filters (Pizza, Sides, Beverages, Combos, etc.), item-name search, and responsive layout.
- **Order Management:** Create new orders, choose payment (Cash, Card, UPI) and delivery modes (Home Delivery, Takeaway), and cancel pending orders.
- **Real-time Feedback:** Order status updates (Pending, Accepted, Preparing, Out for Delivery, Delivered) via a dedicated Message Service.
- **Profile Management:** Secure user profile panel with editable fields.

### Admin Control Panel
- **Dashboard Metrics:** Live activity monitoring, monthly revenue tracking, and order counting.
- **Menu Inventory (CRUD):** Add, edit, or delete menu items with support for local image uploads and URL previews.
- **Live Order Queue:** Accept/Reject orders, push status updates with custom messages to customers.
- **Billing/Invoicing:** Automated digital bill generation and printing capabilities.

## Technology Stack
- **Frontend:** React, Vite, Bootstrap (Responsive UI), CSS Media Queries
- **Backend:** Node.js, Express.js, RESTful APIs (Layered architecture with Controllers, Services, DTOs)
- **Database:** MongoDB, Mongoose (with in-memory fallback via MongoMemoryServer for easy testing)
- **Security:** JWT-based authentication and Role-based access control (Admin vs. Customer)
- **Testing:** Vitest and React Testing Library (Component tests), Playwright (End-to-End smoke testing)

## Database Architecture

### Core Entities
1. **User Schema:** Manages Customer and Admin roles, securely stores credentials.
2. **Item Schema:** Manages menu items with prices, categories, and image URLs.
3. **Order Schema:** Links users to multiple items, tracks total amount, payment option, delivery mode, and live order status.

### Entity Relationships
User 1 --- * Order
Order * --- * Item

## API Endpoints Overview

### Auth (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Authenticate user and get JWT token
- `GET /me` - Get current user profile details
- `PUT /me` - Update user profile (Name, Phone, Email)

### Items (`/api/items`)
- `GET /` - Fetch all menu items
- `POST /` - Add a new menu item (Admin only)
- `PUT /:id` - Update an existing item (Admin only)
- `DELETE /:id` - Delete an item (Admin only)

### Orders (`/api/orders`)
- `POST /` - Place a new order
- `GET /myorders` - Fetch logged-in user's orders
- `GET /all` - Fetch all orders across the platform (Admin only)
- `GET /revenue` - Fetch current monthly revenue and order metrics (Admin only)
- `PUT /:id/cancel` - Cancel a pending order (Customer)
- `PUT /:id/status` - Update order status and push custom messages (Admin only)

## Project Requirement Checklist

The project successfully satisfies all major requirements and planned sprint objectives:
- [x] MongoDB + Mongoose backend data storage for users, items, and orders.
- [x] Node.js + Express.js REST APIs with robust validation and DTO transformations.
- [x] React SPA with login, register, admin, and customer dashboards.
- [x] JWT-based session handling with local storage.
- [x] Client-side validation in login, registration, and checkout forms.
- [x] Responsive UI with Bootstrap and extra CSS media queries for different screen sizes.
- [x] Component and end-to-end testing support with Vitest and Playwright.
- [x] Real-time order tracking and invoice generation.

## How to Run & Test the Application

1. **Install Dependencies:** 
   Run `npm install` in both the `frontend` and `backend` directories.
2. **Start the Backend Server:** 
   Run `npm start` or `node server.js` inside the `backend` directory. 
   *(Note: It will automatically connect to MongoDB or fallback to an in-memory database and seed sample items).*
3. **Start the Frontend Application:** 
   Run `npm run dev` inside the `frontend` directory.
4. **Customer View:** Register a new user with the role "Customer" to browse the menu and place orders.
5. **Admin View:** Register a new user with the role "Admin". Logging in will redirect you to the Admin Dashboard where you can manage menu items, update order statuses, and generate bills.

### Verification & Testing Commands (Frontend)
- **Build project:** `npm run build`
- **Run component tests:** `npm run test`
- **Run E2E smoke tests:** `npm run test:e2e`
