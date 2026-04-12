package com.smartcomplaint.repository;

import com.smartcomplaint.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

// By extending JpaRepository, we get save(), findAll(), deleteById() for free!
public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Spring Boot reads these method names and automatically generates the SQL!
    Optional<User> findByUsernameAndPassword(String username, String password);

    Optional<User> findByEmailAndPassword(String email, String password);
    
    Optional<User> findByUsername(String username);
    
    List<User> findByRoleAndSpecialtyContaining(String role, String specialty);
}