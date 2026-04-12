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
// Note: I removed @CrossOrigin here because your new CorsConfig.java handles it globally for both localhost AND Vercel!
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        // 1. Try to find the user by Username first
        User user = userRepository.findByUsername(req.getUsername()).orElse(null);

        // 2. If that fails, try to find by Email (using the same input field)
        if (user == null) {
            user = userRepository.findByEmail(req.getUsername()).orElse(null);
        }

        // 3. Security Check: Verify user exists AND hashed password matches
        if (user == null || !passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Email/Username or Password");
        }

        // 4. Generate JWT Token
        String token = jwtUtil.generateToken(user.getUsername());

        // 5. Return token and user data to React
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        User user = new User();
        user.setEmail(req.getEmail());
        user.setUsername(req.getUsername());
        
        // SECURITY UPGRADE: Hash the password before saving!
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        
        user.setRole(req.getRole() != null ? req.getRole().toUpperCase() : "USER");
        user.setSpecialty(req.getSpecialty());
        user.setLocation(req.getLocation());
        user.setMobileNumber(req.getMobileNumber());
        
        User savedUser = userRepository.save(user);

        // Give them a token immediately so they log in automatically
        String token = jwtUtil.generateToken(savedUser.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", savedUser);

        return ResponseEntity.ok(response);
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