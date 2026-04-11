package com.smartcomplaint.controller;

import com.smartcomplaint.model.Notification;
import com.smartcomplaint.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationRepository notifRepo;

    @GetMapping("/{userId}")
    public List<Notification> getUserNotices(@PathVariable Integer userId) {
        return notifRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotice(@PathVariable Integer id) {
        notifRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}