package com.smartcomplaint.controller;

import com.smartcomplaint.model.User;
import com.smartcomplaint.repository.UserRepository;
import com.smartcomplaint.dto.AuthRequest;
import com.smartcomplaint.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        System.out.println("Login attempt for: " + req.getUsername());

        // 1. Try to find the user by Username or Email
        User user = userRepository.findByUsername(req.getUsername())
                .orElseGet(() -> userRepository.findByEmail(req.getUsername()).orElse(null));

        // 2. Verify user exists AND hashed password matches
        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email/Username or Password");
        }

        // 3. Generate JWT Token
        String token = jwtUtil.generateToken(user.getUsername());

        // 4. SECURITY: Clear password from user object before sending to React
        user.setPassword(null);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        System.out.println("Login successful for: " + user.getUsername());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        System.out.println("Registration attempt for: " + req.getUsername());

        // 1. CHECK IF USERNAME TAKEN: Prevents "White Screen" DB errors
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken.");
        }

        // 2. CHECK IF EMAIL TAKEN
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already registered.");
        }

        // 3. Create and Save User
        User user = new User();
        user.setEmail(req.getEmail());
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword())); // Securely hash
        
        // Default to USER role for safety. Only an Admin should promote others.
        user.setRole(req.getRole() != null ? req.getRole().toUpperCase() : "USER");
        
        user.setSpecialty(req.getSpecialty());
        user.setLocation(req.getLocation());
        user.setMobileNumber(req.getMobileNumber());
        
        User savedUser = userRepository.save(user);

        // 4. Generate Token for immediate login
        String token = jwtUtil.generateToken(savedUser.getUsername());

        // 5. SECURITY: Clear password hash
        savedUser.setPassword(null);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", savedUser);

        System.out.println("Registration successful for: " + savedUser.getUsername());
        return ResponseEntity.ok(response);
    }
}