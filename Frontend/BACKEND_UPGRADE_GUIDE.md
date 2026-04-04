# Spring Boot REST API — Backend Upgrade Guide

This guide explains how to convert your existing Java console application
into a Spring Boot REST API that the React frontend can communicate with.

---

## 1. Project Setup

### pom.xml dependencies (Maven)

```xml
<dependencies>
  <!-- Spring Boot Web (REST API) -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>

  <!-- Spring Data JPA (ORM for MySQL) -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>

  <!-- MySQL Connector -->
  <dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
  </dependency>

  <!-- Spring Security (for login/JWT later) -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
  </dependency>

  <!-- Lombok (optional, reduces boilerplate) -->
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>
</dependencies>
```

---

## 2. application.properties

```properties
# src/main/resources/application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/smart_complaint_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

server.port=8080
```

---

## 3. Recommended Folder Structure

```
src/main/java/com/smartcomplaint/
├── SmartComplaintApplication.java
├── config/
│   ├── CorsConfig.java          ← Allow React (localhost:5173) to call the API
│   └── SecurityConfig.java      ← Disable CSRF for REST, configure auth
├── model/
│   ├── User.java
│   └── Complaint.java
├── repository/
│   ├── UserRepository.java
│   └── ComplaintRepository.java
├── service/
│   ├── UserService.java
│   └── ComplaintService.java
├── controller/
│   ├── AuthController.java      ← POST /api/auth/login, /api/auth/register
│   ├── ComplaintController.java ← GET/POST /api/complaints
│   └── WorkerController.java    ← GET /api/workers?specialty=PLUMBING
└── dto/
    ├── LoginRequest.java
    ├── RegisterRequest.java
    └── AssignRequest.java
```

---

## 4. Model Classes

### User.java
```java
@Entity
@Table(name = "users")
@Data  // Lombok
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 50)
    private String password;

    @Column(nullable = false, length = 20)
    private String role;  // ADMIN, USER, WORKER

    @Column(length = 50)
    private String specialty;  // PLUMBING, ELECTRICAL, IT — nullable
}
```

### Complaint.java
```java
@Entity
@Table(name = "complaints")
@Data
public class Complaint {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String description;

    @Column(length = 50)
    private String status = "PENDING";  // PENDING, ASSIGNED, RESOLVED

    @Column(nullable = false)
    private Integer userId;

    @Column(length = 50)
    private String category = "GENERAL";  // PLUMBING, ELECTRICAL, IT, GENERAL

    private Integer workerId;
}
```

---

## 5. Repository Interfaces

### UserRepository.java
```java
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    List<User> findByRoleAndSpecialty(String role, String specialty);
}
```

### ComplaintRepository.java
```java
@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Integer> {
    List<Complaint> findByUserId(Integer userId);
    List<Complaint> findByWorkerId(Integer workerId);
}
```

---

## 6. REST Controllers

### AuthController.java
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private UserService userService;

    // POST /api/auth/login
    // Body: { "username": "admin", "password": "admin123" }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            User user = userService.login(req.getUsername(), req.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/auth/register
    // Body: { "username": "john", "password": "pass123", "role": "WORKER", "specialty": "IT" }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            User user = userService.register(req);
            return ResponseEntity.status(201).body(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}
```

### ComplaintController.java
```java
@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired private ComplaintService complaintService;

    // GET /api/complaints          → Admin: all complaints
    // GET /api/complaints?userId=2 → User: their own complaints
    // GET /api/complaints?workerId=4 → Worker: their assigned complaints
    @GetMapping
    public ResponseEntity<List<Complaint>> getComplaints(
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) Integer workerId) {
        if (userId != null)   return ResponseEntity.ok(complaintService.getByUser(userId));
        if (workerId != null) return ResponseEntity.ok(complaintService.getByWorker(workerId));
        return ResponseEntity.ok(complaintService.getAll());
    }

    // POST /api/complaints
    // Body: { "description": "...", "category": "PLUMBING", "userId": 2 }
    @PostMapping
    public ResponseEntity<Complaint> create(@RequestBody Complaint complaint) {
        return ResponseEntity.status(201).body(complaintService.create(complaint));
    }

    // PUT /api/complaints/{id}/assign
    // Body: { "workerId": 4 }
    @PutMapping("/{id}/assign")
    public ResponseEntity<Complaint> assign(@PathVariable Integer id,
                                             @RequestBody AssignRequest req) {
        return ResponseEntity.ok(complaintService.assign(id, req.getWorkerId()));
    }

    // PUT /api/complaints/{id}/resolve
    @PutMapping("/{id}/resolve")
    public ResponseEntity<Complaint> resolve(@PathVariable Integer id) {
        return ResponseEntity.ok(complaintService.resolve(id));
    }
}
```

### WorkerController.java
```java
@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    @Autowired private UserService userService;

    // GET /api/workers?specialty=PLUMBING
    @GetMapping
    public ResponseEntity<List<User>> getWorkers(
            @RequestParam(required = false) String specialty) {
        return ResponseEntity.ok(userService.getWorkersBySpecialty(specialty));
    }
}
```

---

## 7. CORS Configuration (CRITICAL for React ↔ Spring Boot)

### CorsConfig.java
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")  // React Vite dev server
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## 8. Connecting React to Spring Boot

Once your Spring Boot server is running on `http://localhost:8080`, open
`src/data/mockApi.js` in the React project and replace each mock function
with a real `fetch()` call. Example:

```js
// BEFORE (mock):
export const apiLogin = async ({ username, password }) => {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) throw new Error('Invalid username or password.');
  return { ...user };
};

// AFTER (real API):
export const apiLogin = async ({ username, password }) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Login failed.');
  }
  return res.json();
};
```

Also uncomment the proxy block in `vite.config.js`:
```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```
This means all `/api/...` calls from React are forwarded to Spring Boot
automatically — no CORS issues in development.

---

## 9. Full API Endpoint Summary

| Method | Endpoint                         | Role   | Description                          |
|--------|----------------------------------|--------|--------------------------------------|
| POST   | /api/auth/login                  | Any    | Login, returns user object           |
| POST   | /api/auth/register               | Any    | Register new user or worker          |
| GET    | /api/complaints                  | ADMIN  | Get all complaints                   |
| GET    | /api/complaints?userId={id}      | USER   | Get complaints by user               |
| GET    | /api/complaints?workerId={id}    | WORKER | Get complaints assigned to worker    |
| POST   | /api/complaints                  | USER   | Submit a new complaint               |
| PUT    | /api/complaints/{id}/assign      | ADMIN  | Assign a complaint to a worker       |
| PUT    | /api/complaints/{id}/resolve     | WORKER | Mark a complaint as resolved         |
| GET    | /api/workers?specialty={s}       | ADMIN  | Get workers filtered by specialty    |
