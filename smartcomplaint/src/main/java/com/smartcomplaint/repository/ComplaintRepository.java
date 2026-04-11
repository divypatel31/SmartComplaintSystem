package com.smartcomplaint.repository;

import com.smartcomplaint.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Integer> {
    
    // Automatically generates: SELECT * FROM complaints WHERE user_id = ?
    List<Complaint> findByUserId(Integer userId);
    
    // Automatically generates: SELECT * FROM complaints WHERE worker_id = ?
    List<Complaint> findByWorkerId(Integer workerId);
}