# ResolveIQ Backend Server

This folder contains the Java-based server and database logic for the Smart Complaint System. It connects to a local MySQL database to manage users, maintenance tickets, and real-time notifications.

## 🛠️ Backend Tech Stack
* **Language:** Java (JDK 17+)
* **Database:** MySQL
* **Connectivity:** JDBC (MySQL Connector/J)
* **Architecture:** Object-Oriented MVC Pattern (Models, Services, Menus, Controllers)

## 📋 Prerequisites
1. **Java Development Kit (JDK):** Version 17 or higher installed.
2. **MySQL Server:** Installed and running locally on port 3306.
3. **MySQL Connector JAR:** You must have the `mysql-connector-j-x.x.x.jar` file placed inside a folder named `lib` within this Backend directory.

## 🗄️ Database Setup
Open MySQL Workbench (or your preferred SQL client) and run the following commands to create the database structure:

```sql
CREATE DATABASE smart_complaint_db;
USE smart_complaint_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    specialty VARCHAR(50) DEFAULT NULL,
    mobileNumber VARCHAR(15),
    location VARCHAR(255)
);

CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    user_id INT NOT NULL,
    category VARCHAR(50) DEFAULT 'GENERAL',
    worker_id INT DEFAULT NULL,
    location VARCHAR(255)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
🔐 Configuration
Create a file named db.properties in this root Backend folder and add your MySQL credentials:
```
db.url=jdbc:mysql://localhost:3306/smart_complaint_db
db.user=root
db.password=your_mysql_password
```

💻 How to Run (Terminal)
To run the backend server directly from your terminal, follow these steps exactly:

1. Navigate into the Backend folder
```
cd Backend
```

2. Compile the Java files
This command compiles all your code and tells Java to include the MySQL driver located in your lib folder.

Windows (PowerShell/CMD):

```
javac -cp ".;lib\*" Main.java
```
Mac/Linux:

```
javac -cp ".:lib/*" Main.java
```

3. Run the Server
Once compiled, execute the Main class:

Windows (PowerShell/CMD):

```
java -cp ".;lib\*" Main
```
Mac/Linux:

```
java -cp ".:lib/*" Main
```

If successful, you will see Database connected successfully! in your terminal, and the server will be ready to process requests from the React frontend.
