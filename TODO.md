# TODO

## Goal: Profile + Dark-mode fixes

### Step 1 — Backend: add `/api/auth/me` endpoints
- [x] Implement `GET /api/auth/me` returning user details
- [x] Implement `PUT /api/auth/me` allowing update of `name`, `phone`, `email`
- [x] Wire endpoints in `backend/routes/authRoutes.js`

### Step 2 — Frontend: show profile + editable form in same page
- [x] In `frontend/src/pages/CustomerDashboard.jsx`, render `ProfilePanel`
- [x] Edit Profile toggles and updates fields via PUT `/api/auth/me`

### Step 3 — Frontend: fix mobile dropdown styling in dark mode
- [ ] Ensure dropdown text/menu remains readable in dark mode (dark menu, white items)

### Step 4 — Test
- [ ] Login -> profile renders + editable
- [ ] Dark mode dropdown looks correct
