package com.smartcomplaint.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private String description;
    
    private String status = "PENDING";
    
    @Column(name = "user_id", nullable = false)
    private Integer userId;
    
    private String category = "GENERAL";
    
    @Column(name = "worker_id")
    private Integer workerId;

    @Column(name = "incident_location")
    private String location;

    @Transient
    @JsonProperty("username")
    private String username;

    @Transient
    @JsonProperty("userMobile")
    private String userMobile;

    @Transient
    @JsonProperty("userLocation")
    private String userLocation;

    @Transient
    @JsonProperty("workerName")
    private String workerName;

    @Transient
    @JsonProperty("workerMobile")
    private String workerMobile;
}