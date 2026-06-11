# TODO - Add-ons Implementation

## Assumptions
- Global add-ons are maintained per **item category** (e.g., cheese options for pizza category)
- Add-ons are selectable **per cart line** (each cart item can have different add-on selections)
- During checkout we send:
  - cart line item base item id
  - selected add-on ids
  - computed extra price (or server computes)

## Implementation Steps
1. Backend
   1.1 Add `Addon` model: { name, category, price, isAvailable }
   1.2 Create routes:
       - `GET /api/addons?category=...`
       - `POST /api/addons` (admin)
       - `PUT /api/addons/:id` (admin)
       - `DELETE /api/addons/:id` (admin)
   1.3 Mount routes in `backend/server.js`

   1.4 Update `Order` schema so `orderItems` includes:
       - addOnIds: [ObjectId]
       - addOnsExtraPrice: number

   - [x] Backend: Addon model/routes added
   - [x] Backend: Order schema extended + orderService sanitation added


2. Frontend
   2.1 In `CustomerDashboard.jsx`:
       - store `cart` line as { itemId, quantity, addOnIds: [] }
       - compute total = baseTotal + addOns extra
       - render add-on selector when user clicks checkout/item
   2.2 When checking out, include selected add-ons per line in POST `/api/orders`

3. Admin UI
   3.1 In `AdminDashboard.jsx`:
       - Tab: Manage Add-ons
       - Select category
       - Add add-on options (name, price)
       - List existing add-ons for category and allow edit/delete

## Validation
- Beverage category shows no cheese add-ons
- Pizza category shows cheese add-ons
- Refresh retains add-ons only after order placement (not in cart, unless implemented)

