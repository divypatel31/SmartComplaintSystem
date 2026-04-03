# Smart Complaint & Task Resolution System

A Java and MySQL-based application designed to streamline the process of reporting, assigning, and resolving facility complaints in institutions and offices.

## Features & Roles
The system features strict role-based access control and automated task routing.

* **Normal Users:** Can register, submit complaints with specific categories (Plumbing, Electrical, IT), and track the real-time status of their issues.
* **Administrators:** Can view all system-wide complaints. The system intelligently filters available workers based on the complaint's category, allowing the Admin to seamlessly assign the right expert to the job.
* **Workers:** Registered with a specific "Specialty". They possess a dedicated dashboard to view tasks assigned directly to them and mark them as resolved upon completion.

## Tech Stack
* **Language:** Java (JDK 8+)
* **Database:** MySQL
* **Connectivity:** JDBC (MySQL Connector/J)
* **Architecture:** Object-Oriented MVC Pattern (Models, Services, Menus)

## Database Setup
Run the following SQL queries in MySQL Workbench to initialize the system:

```sql
CREATE DATABASE smart_complaint_db;
USE smart_complaint_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    specialty VARCHAR(50) DEFAULT NULL
);

CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    user_id INT NOT NULL,
    category VARCHAR(50) DEFAULT 'GENERAL',
    worker_id INT DEFAULT NULL
);
```
How to Run
Ensure your MySQL server is running.

Create a db.properties file in the root directory with your database credentials:

Properties
db.url=jdbc:mysql://localhost:3306/smart_complaint_db
db.user=root
db.password=yourpassword
Add the mysql-connector-j-8.x.x.jar file to your Java build path.

Run Main.java to start the application.
