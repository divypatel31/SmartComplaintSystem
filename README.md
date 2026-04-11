# ResolveIQ: Smart Complaint & Task Resolution System ✨

A modern, full-stack application designed to streamline the process of reporting, assigning, and resolving facility maintenance issues in institutions and offices. 

This system features strict role-based access control, intelligent task routing, interactive mapping, and real-time system notifications.

## 🚀 Key Features
* **Role-Based Architecture:** Dedicated interfaces for Standard Users, Field Workers, and Administrators.
* **Smart Dispatching:** Admins can view available workers filtered automatically by their registered specialties (e.g., Plumbing, Electrical, IT).
* **Multi-Skill Workers:** Workers can register with multiple disciplines, allowing them to accept a wider variety of tasks.
* **Real-Time Notice Center:** An automated alert system that instantly notifies Users when a worker is dispatched, and notifies Workers when a new task is assigned to them.
* **Geo-Location:** Integration with Google Maps API for users to drop pins or auto-detect the exact location of a maintenance issue.

## 📁 Repository Structure
This repository is divided into two decoupled environments:

1. **`/Frontend`**: Contains the React 18 + Vite web application, styled with Tailwind CSS and Framer Motion for smooth, native-feeling animations.
2. **`/Backend`**: Contains the Java REST API and Database connection logic, responsible for secure data handling and business rules.

## ⚙️ Quick Start Guide

To run this application locally, you need to start both the Backend and Frontend servers.

**Step 1: Start the Backend (Java/MySQL)**
Navigate to the `Backend` directory and initialize the database and Java server. 
👉 *See the [Backend README](./Backend/README.md) for detailed terminal commands and database setup.*

**Step 2: Start the Frontend (React)**
Open a **new, separate terminal window**, navigate to the Frontend directory, and start the Vite development server:
```bash
cd Frontend
npm install
npm run dev
```

The web application will be available at http://localhost:5173.

🛠️ Tech Stack
**Frontend:** React.js, Tailwind CSS, Framer Motion, Google Maps API
**Backend:** Java (JDK 17+), JDBC
**Database:** MySQL
