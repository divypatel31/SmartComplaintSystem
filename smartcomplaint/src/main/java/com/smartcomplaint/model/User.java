package com.smartcomplaint.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data // This automatically creates all Getters and Setters for you!
public class User {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;

    @Column(name = "mobile_number")
    private String mobileNumber;
    
    @Column(nullable = false)
    private String role; // ADMIN, USER, WORKER
    
    private String specialty; // PLUMBING, ELECTRICAL, IT

    private String location;
}