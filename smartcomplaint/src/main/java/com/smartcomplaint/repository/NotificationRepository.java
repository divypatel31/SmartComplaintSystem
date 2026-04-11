package com.smartcomplaint.repository;

import com.smartcomplaint.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    // Fetches notices for a specific user, newest first!
    List<Notification> findByUserIdOrderByCreatedAtDesc(Integer userId);
}