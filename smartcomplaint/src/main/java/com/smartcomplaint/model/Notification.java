package com.smartcomplaint.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId; // Who receives this notice?

    private String title;
    private String message;

    @Column(name = "is_read")
    private boolean isRead = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}