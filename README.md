# Expensely - Expense Management System

Expensely is a modern Expense Management System designed to help users efficiently track their income, expenses, and overall financial status. The application provides an intuitive dashboard that allows users to monitor their financial activities, analyze spending patterns, and maintain better control over their finances.

## Features

* Add and manage income records
* Add and track expenses
* Real-time financial overview dashboard
* Display total income, total expenses, and available balance
* Expense categorization for better tracking
* Interactive and responsive user interface
* Data storage using MongoDB database
* RESTful API architecture
* Clean and modern dashboard design

## Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)
* Font Awesome

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose ODM

## Project Structure

```text
Expensely/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── css/
│   ├── js/
│   ├── assets/
│   └── index.html
│
├── README.md
└── .gitignore
```

## Database Collections

### Income Collection

```json
{
  "source": "Salary",
  "amount": 30000,
  "date": "2026-06-01"
}
```

### Expense Collection

```json
{
  "title": "Food",
  "amount": 500,
  "category": "Dining",
  "date": "2026-06-01"
}
```

## Installation and Setup

### Prerequisites

Before running this project, ensure you have:

* Node.js installed
* npm installed
* MongoDB Atlas account or local MongoDB installation

### Backend Setup

1. Navigate to the backend folder

```bash
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

4. Start the development server

```bash
npm run dev
```

The backend server will run on:

```text
http://localhost:5000
```

### Frontend Setup

Open the frontend folder and run:

```text
frontend/index.html
```

using your preferred browser or Live Server extension in VS Code.

## Application Workflow

```text
User Interface
      ↓
Frontend (HTML/CSS/JS)
      ↓
Express API
      ↓
MongoDB Database
      ↓
Dashboard Analytics
```

## Future Enhancements

* User Authentication and Authorization
* Monthly Budget Management
* Data Visualization with Charts
* Export Reports as PDF/Excel
* Recurring Income and Expense Tracking
* Dark Mode Support
* Advanced Financial Analytics

## Screenshots

Add project screenshots here.

* Dashboard Page
* Income Management Page
* Expense Management Page
* Analytics Section

## Author

**Atul Pandey**


## License

This project is developed for educational and learning purposes.
