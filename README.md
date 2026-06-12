# PIZZA_STORE

A comprehensive MERN (MongoDB, Express.js, React, Node.js) stack solution for online food ordering and restaurant management. This README reflects the final project state, incorporating all sprint objectives, advanced backend patterns, and comprehensive testing.

## Features Overview

### Customer Features
- **Dynamic Menu:** Category filters (Pizza, Sides, Beverages, Combos, etc.), item-name search, and responsive layout.
- **Order Management:** Create new orders, choose payment (Cash, Card, UPI) and delivery modes (Home Delivery, Takeaway), and cancel pending orders.
- **Cart System:** Interactive cart with real-time total calculation.
- **Real-time Feedback:** Order status updates (Pending, Accepted, Preparing, Out for Delivery, Delivered) via a dedicated Message Service.
- **Profile Management:** Secure user profile panel with editable fields.
- **Dark Mode:** A responsive and persistent dark mode theme.

### Admin Control Panel
- **Dashboard Metrics:** Live activity monitoring, monthly revenue tracking, and order counting.
- **Menu Inventory (CRUD):** Add, edit, or delete menu items with support for local image uploads and URL previews.
- **Live Order Queue:** Accept/Reject orders, push status updates with custom messages to customers.
- **Billing/Invoicing:** Automated digital bill generation and printing capabilities.

## Technology Stack
- **Frontend:** React, Vite, React Bootstrap (Responsive UI), Axios, Formik & Yup (Validation)
- **Backend:** Node.js, Express.js, RESTful APIs (Layered architecture with Controllers, Services, DTOs)
- **Database:** MongoDB, Mongoose. Includes a fallback to `mongodb-memory-server` allowing the backend to run even without a local MongoDB instance.
- **Security:** JWT-based authentication (bcryptjs for hashing) and Role-based access control (Admin vs. Customer).
- **Testing:** 
  - **Component/Unit:** Vitest and React Testing Library
  - **End-to-End (E2E):** Playwright

## Database Architecture

### Core Entities
1. **User Schema:** Manages Customer and Admin roles, securely stores credentials.
2. **Item Schema:** Manages menu items with prices, categories, and image URLs.
3. **Order Schema:** Links users to multiple items, tracks total amount, payment option, delivery mode, and live order status.

## How to Run the Application

The project is split into two main directories: `backend` and `frontend`. 

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file in the `backend` directory if you want to provide a specific MongoDB URI or Port:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/pizzeria
   JWT_SECRET=your_jwt_secret
   ```
   *If no MongoDB instance is provided or it fails to connect, the server will gracefully fallback to an in-memory database and seed itself with sample data automatically.*
4. Start the server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The application will be available at `http://localhost:5173`.

### 3. Usage
- **Customer View:** Register a new user with the role "CUSTOMER" (or use `ayush@gmail.com` if using the pre-seeded DB) to browse the menu, add items to the cart, and place orders.
- **Admin View:** Register a new user with the role "ADMIN" (or use `superadmin@gmail.com` / `superadmin@pizza.com` from the seed) to manage menu items, update order statuses, and view metrics.

## How to Test the Application

The frontend project includes a comprehensive testing suite.

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. **Run Component/Unit Tests:**
   This runs the Vitest suite which includes testing for isolated components and functions.
   ```bash
   npm run test
   ```

3. **Run End-to-End (E2E) Smoke Tests:**
   These tests run against a real browser instance using Playwright. They automatically start a local server and verify user flows such as Authentication (Login/Register), Cart interactions, and the Checkout process.
   ```bash
   npm run test:e2e
   ```
   *Ensure the Playwright browsers are installed (`npx playwright install`) if you are running this for the first time.*

## API Endpoints Overview

### Auth (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Authenticate user and get JWT token

### Items (`/api/items`)
- `GET /` - Fetch all menu items
- `POST /` - Add a new menu item (Admin only)
- `PUT /:id` - Update an existing item (Admin only)
- `DELETE /:id` - Delete an item (Admin only)

### Orders (`/api/orders`)
- `POST /` - Place a new order
- `GET /myorders` - Fetch logged-in user's orders
- `GET /all` - Fetch all orders (Admin only)
- `GET /revenue` - Fetch current monthly revenue and order metrics (Admin only)
- `PUT /:id/cancel` - Cancel a pending order (Customer)
- `PUT /:id/status` - Update order status (Admin only)
