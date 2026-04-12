package com.smartcomplaint.repository;

import com.smartcomplaint.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

// By extending JpaRepository, we get save(), findAll(), deleteById() for free!
public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Spring Security uses these to find the user BEFORE verifying the hashed password
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
    
    // This keeps your frontend worker assignment logic working perfectly
    List<User> findByRoleAndSpecialtyContaining(String role, String specialty);

}