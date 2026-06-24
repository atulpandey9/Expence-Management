# Expensely - Expense Management System

Expensely is a modern full-stack Expense Management System that helps users efficiently manage their personal finances by tracking income, expenses, and overall financial health. The application provides an intuitive dashboard with interactive charts, secure authentication, and real-time financial insights to help users make informed financial decisions.

---

## Features

### Authentication & Security

* Secure user registration and login
* JWT-based authentication
* Protected routes and user-specific financial data
* Password encryption using industry-standard security practices

### Income Management

* Add, update, and delete income records
* Track multiple income sources
* View total income in real time

### Expense Management

* Add, update, and delete expenses
* Categorize expenses for better organization
* Monitor spending habits across categories

### Dashboard & Analytics

* Real-time financial overview
* Display total income, total expenses, and current balance
* Interactive charts and graphs using Chart.js
* Visual representation of income and expense trends
* Financial insights for better budgeting

### User Experience

* Responsive and modern UI
* Built with React and Tailwind CSS
* Fast and seamless user interactions
* Mobile-friendly design

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router DOM
* Chart.js
* React Chart.js 2

### Backend

* Node.js
* Express.js
* JWT Authentication
* Bcrypt.js

### Database

* MongoDB Atlas
* Mongoose ODM

---

## Project Structure

```text
Expensely/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── charts/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## Database Schema

### User Collection

```json
{
  "name": "Atul Pandey",
  "email": "atul@example.com",
  "password": "encrypted_password"
}
```

### Income Collection

```json
{
  "userId": "user_id",
  "source": "Salary",
  "amount": 30000,
  "date": "2026-06-01"
}
```

### Expense Collection

```json
{
  "userId": "user_id",
  "title": "Food",
  "amount": 500,
  "category": "Dining",
  "date": "2026-06-01"
}
```

---

## Installation and Setup

### Prerequisites

Before running this project, ensure you have:

* Node.js installed
* npm installed
* MongoDB Atlas account or local MongoDB installation

---

## Backend Setup

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the backend server

```bash
npm run dev
```

Backend will run on:

```text
http://localhost:5000
```

---

## Frontend Setup

### 1. Navigate to frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start React development server

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## Application Workflow

```text
User
  │
  ▼
React + Tailwind Frontend
  │
  ▼
Authentication (JWT)
  │
  ▼
Express.js REST API
  │
  ▼
MongoDB Database
  │
  ▼
Financial Analytics & Charts
  │
  ▼
Interactive Dashboard
```

---

## Dashboard Analytics

Expensely uses Chart.js to provide visual insights into financial activities:

* Income vs Expense Comparison Charts
* Expense Category Distribution
* Monthly Financial Trends
* Balance Overview
* Interactive Data Visualization

---

## Future Enhancements

* Monthly Budget Planning
* Recurring Income & Expense Tracking
* Email Notifications
* PDF & Excel Report Export
* Dark Mode Support
* Multi-Currency Support
* AI-Based Spending Insights
* Financial Goal Tracking

##

---

## Author

**Atul Pandey**

---

## License

This project is developed for educational and learning purposes.
