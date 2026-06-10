# PIZZA_STORE

## Sprint I Objective 1 - Database Schema

This project uses MongoDB with Mongoose and contains the main schema models for the pizza store application.

### 1. User Schema
File: backend/models/User.js
- Stores user information: name, email, password, role
- Roles: CUSTOMER and ADMIN

### 2. Item Schema
File: backend/models/Item.js
- Stores menu items: name, description, price, category, imageUrl
- Used by the customer menu and admin inventory management

### 3. Order Schema
File: backend/models/Order.js
- Stores customer orders: user, orderItems, totalAmount, paymentOption, deliveryMode, orderStatus
- Links a customer to one or more ordered menu items

### Relationships
- One User can place many Orders.
- One Order can contain many Items.
- Each order item references an Item by its MongoDB ObjectId.

### Simple ER Diagram
User 1 --- * Order
Order * --- * Item

This structure is implemented in the codebase and satisfies the sprint objective for database schema design.

## Sprint II Objectives

The current MERN stack implementation already covers the major Sprint II goals listed below.

1. Search functionality based on different criteria
   - Implemented in the customer dashboard with category filters and item-name search.

2. Menu items CRUD for Admin
   - Admin dashboard supports add, edit, and delete menu items.

3. Create / cancel order from user
   - Customer dashboard allows placing orders and canceling pending orders.

4. Billing option (generate for Owner and view for User)
   - Admin dashboard can generate bills/invoices; order details are available to users through the dashboard flow.

5. JWT-based authentication
   - JWT is implemented in the backend using Express middleware and token validation.
   - Note: this project uses JWT in the MERN stack instead of Spring Security, which is the equivalent authentication mechanism in this application.

6. Component and end-to-end testing
   - Added frontend testing support using Vitest + React Testing Library for component tests.
   - Added Playwright setup for end-to-end smoke testing.

### Verification
- Frontend build: npm run build
- Component tests: npm run test
- End-to-end smoke test: npm run test:e2e

## Project Requirement Checklist

The current project satisfies the major implementation requirements from the assignment brief:

- MongoDB + Mongoose backend data storage for users, items, and orders
- Node.js + Express.js REST APIs for auth, menu, and orders
- React SPA with login, register, admin, and customer dashboards
- JWT-based session handling with local storage
- Client-side validation in login and registration forms
- Responsive UI with Bootstrap and extra CSS media queries for different screen sizes
- Component and end-to-end testing support with Vitest and Playwright

## Sprint III Objectives

The project includes the following Sprint III enhancements:

1. DTO and service-layer structure for order handling
2. Controller-driven REST API flow for menu and order operations
3. Message service for customer-friendly order status updates
4. Payment mode validation service for supported checkout options
5. Frontend-backend integration for real order and menu operations
6. Extra feature: a responsive Contact & Support section on the home page

These improvements are implemented in the backend service files and the refreshed landing page UI.

## How to Test the Application
1. **Customer View:** Register a new user with the role "Customer" to browse the menu and place orders.
2. **Admin View:** Register a new user with the role "Admin". Logging in will redirect you to the Admin Dashboard where you can add/edit menu items, update order statuses, and generate bills.

