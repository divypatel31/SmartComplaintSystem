package com.smartcomplaint.controller;

import com.smartcomplaint.model.User;
import com.smartcomplaint.repository.UserRepository;
import com.smartcomplaint.dto.AuthRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Crucial: Allows React to talk to Java!
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        // Try to log in with Username first...
        User user = userRepository.findByUsernameAndPassword(req.getUsername(), req.getPassword()).orElse(null);

        // If that fails, try to log in with Email!
        if (user == null) {
            user = userRepository.findByEmailAndPassword(req.getUsername(), req.getPassword()).orElse(null);
        }

        if (user == null)
            return ResponseEntity.badRequest().body("Invalid Email/Username or Password");
        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        User user = new User();
        user.setEmail(req.getEmail()); // <-- Save the new email!
        user.setUsername(req.getUsername());
        user.setPassword(req.getPassword());
        user.setRole(req.getRole() != null ? req.getRole().toUpperCase() : "USER");
        user.setSpecialty(req.getSpecialty()); // <-- Saves the worker type!
        user.setLocation(req.getLocation());
        user.setMobileNumber(req.getMobileNumber());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody User updates) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.getLocation() != null)
            user.setLocation(updates.getLocation());
        if (updates.getMobileNumber() != null)
            user.setMobileNumber(updates.getMobileNumber());

        return ResponseEntity.ok(userRepository.save(user));
    }
}