# 🛒 MERN Ecommerce Platform

> A full-scale, production-ready ecommerce platform built using the MERN stack, featuring secure authentication, admin dashboard, coupon system, Stripe payments, Redis caching, and scalable architecture.

---

## 🚀 Tech Stack

| Layer | Technology |
|-----|-----------|
| Frontend | React, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Caching | Redis (Upstash) |
| Image Storage | Cloudinary |
| Payments | Stripe |
| Authentication | JWT (Access & Refresh Tokens) |

---

## ✨ Core Features

### 🧑‍💻 User Side
- Category-based product browsing  
- Featured products on homepage (Redis cached)  
- Cart management system  
- Coupon apply & validation  
- Secure Stripe checkout  
- Token-based authentication  
- Persistent login with refresh tokens  

---

### 🛠 Admin Dashboard
- Add / Update / Delete products  
- Toggle featured products  
- Coupon creation & management  
- User management  
- Sales analytics dashboard  
- Weekly sales visualization using charts  

---

## ⚡ Performance & Security

- Redis caching for featured products and auth sessions  
- HTTP-Only cookies for JWT storage  
- Access & Refresh token flow  
- Cloudinary optimized image delivery  
- Protected admin routes & role-based authorization  
- Secure Stripe payment handling  

---


## 🧠 System Architecture

- Scalable MVC backend structure  
- Modular controller-service-route pattern  
- Centralized authentication middleware  
- Redis-based performance optimization  
- Clean separation of frontend & backend services  

---

## 🎯 What This Project Demonstrates

- Real-world MERN architecture  
- Secure authentication design  
- Admin panel implementation  
- Stripe payment gateway integration  
- Redis caching & performance tuning  
- Production-grade folder structuring  

---

## 🧑‍💻 Developer

**Sri Ragul A A**  
MERN Stack | Problem Solving

📧 sriragul.aa@gmail.com

---

## 📌 Upcoming Enhancements

- Order history & invoices  
- Email notifications  
- Product reviews & ratings  
- Recommendation engine  
- Advanced performance optimization  

---

## 📸 Screenshots

### Home
<img width="1907" height="912" alt="Screenshot 2025-12-28 113040" src="https://github.com/user-attachments/assets/d5c59c99-8aa4-4330-9de3-a3ad2f0070b0" />


### On demand
<img width="1902" height="903" alt="Screenshot 2025-12-28 113229" src="https://github.com/user-attachments/assets/1475332b-f8a5-465a-9542-a1a543c32e7c" />


## Explore
<img width="1902" height="905" alt="Screenshot 2025-12-28 113323" src="https://github.com/user-attachments/assets/b55c24ee-7b2d-444a-a86c-1f559ed81376" />


## Cart
<img width="1900" height="907" alt="Screenshot 2025-12-28 113538" src="https://github.com/user-attachments/assets/274a55d5-a836-4744-8d98-55cb577f7651" />



## Payment
<img width="1915" height="909" alt="payment" src="https://github.com/user-attachments/assets/b4d14731-125e-4fcd-b96e-513cda46d677" />

## SuccessPayment
<img width="1908" height="909" alt="successPayment" src="https://github.com/user-attachments/assets/39849e02-d65a-482f-b69a-e8b00bbdac12" />

## Admin-dashboard
<img width="1906" height="904" alt="image" src="https://github.com/user-attachments/assets/f442d33e-769a-4632-bf0e-e7bf434c58ab" />


<img width="1904" height="908" alt="image" src="https://github.com/user-attachments/assets/c3e1b1d1-15bd-432b-88e3-68ecaec8c307" />

<img width="1907" height="913" alt="image" src="https://github.com/user-attachments/assets/411f5f9f-af38-460c-81db-17fb9a236ce4" />

---

## Deployment Checklist

1. Install Node.js 18 or later.
2. Copy `.env.example` to `.env`.
3. Fill in `MONGO_URI`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, and `CLIENT_URI`.
4. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for persistent refresh-token storage and caching.
5. Add Cloudinary and Stripe keys if you need product uploads and payments.

## Local Run

Install dependencies separately:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` and the API on `http://localhost:5000`.

## Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

Start the backend:

```bash
cd backend
npm start
```

The backend serves the built frontend from `frontend/dist` when `NODE_ENV=production`.

## Recommended Deployment Flow

### Option 1: Single service

Use one Node service for both API and frontend:

```bash
cd frontend
npm install
npm run build
```

```bash
cd backend
npm install
set NODE_ENV=production
npm start
```

Point your platform's backend start command to `npm start` in the `backend` directory.

### Option 2: Split frontend and backend

- Deploy the backend as a Node service from `backend/` with `npm start`.
- Deploy the frontend separately from `frontend/` with `npm run build`.
- Set `VITE_API_BASE_URL` in the frontend environment to your backend base URL plus `/api`.
- Set `CLIENT_URI` in the backend environment to the deployed frontend URL.

## Smoke Tests Before Go-Live

1. `cd frontend && npm run lint`
2. `cd frontend && npm run build`
3. Open `/api/health`
4. Verify signup, login, category browsing, cart updates, checkout, and admin product creation















