package com.smartcomplaint.controller;

import com.smartcomplaint.model.User;
import com.smartcomplaint.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody User updates) {
        // Changed userRepo to userRepository
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (updates.getUsername() != null) user.setUsername(updates.getUsername());
        if (updates.getMobileNumber() != null) user.setMobileNumber(updates.getMobileNumber());
        if (updates.getLocation() != null) user.setLocation(updates.getLocation());
        if (updates.getRole() != null) user.setRole(updates.getRole());
        if (updates.getSpecialty() != null) user.setSpecialty(updates.getSpecialty());
        
        // Changed userRepo to userRepository
        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        // Changed userRepo to userRepository
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}