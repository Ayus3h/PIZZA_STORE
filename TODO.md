# TODO

## Goal: Addons + Profile + Dark-mode fixes

### Step 1 — Backend: add `/api/auth/me` endpoints
- [x] Implement `GET /api/auth/me` returning user details
- [x] Implement `PUT /api/auth/me` allowing update of `name`, `phone`, `email`
- [x] Wire endpoints in `backend/routes/authRoutes.js`

### Step 2 — Frontend: show profile + editable form in same page
- [x] In `frontend/src/pages/CustomerDashboard.jsx`, render `ProfilePanel`
- [x] Edit Profile toggles and updates fields via PUT `/api/auth/me`

### Step 3 — Frontend: fix mobile dropdown styling in dark mode
- [ ] Ensure dropdown text/menu remains readable in dark mode (dark menu, white items)

### Step 4 — Add-ons feature (global add-ons by category; selectable per cart line)
- [ ] Create `backend/models/Addon.js`
- [ ] Create admin CRUD endpoints for add-ons (category based)
- [ ] Create customer endpoint to fetch add-ons by category
- [ ] Update cart state in `CustomerDashboard` to store add-on selections per cart line
- [ ] Add add-ons selection UI in checkout (per item/category)
- [ ] Update `handleCheckout` to send add-on ids and extra pricing per cart line
- [ ] Update backend order schema/service to persist add-ons inside `orderItems`
- [ ] Update `AdminDashboard` to allow adding/removing add-ons for each category

### Step 5 — Test
- [ ] Login -> profile renders + editable
- [ ] Dark mode dropdown looks correct
- [ ] Checkout: choosing pizza add-ons doesn’t show for beverage category
- [ ] Order placed persists add-ons

