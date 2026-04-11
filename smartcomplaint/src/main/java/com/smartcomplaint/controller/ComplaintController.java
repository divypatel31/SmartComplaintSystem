package com.smartcomplaint.controller;

import com.smartcomplaint.model.Complaint;
import com.smartcomplaint.model.Notification; // <-- ADDED THIS IMPORT!
import com.smartcomplaint.model.User;
import com.smartcomplaint.repository.ComplaintRepository;
import com.smartcomplaint.repository.NotificationRepository;
import com.smartcomplaint.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    @Autowired 
    private ComplaintRepository complaintRepo;
    
    @Autowired 
    private UserRepository userRepo;

    @Autowired
    private NotificationRepository notifRepo;

    // Helper method to attach Names, Phones, and Locations for React
    private Complaint populateDetails(Complaint c) {
        // Fetch Reporter Details
        if (c.getUserId() != null) {
            userRepo.findById(c.getUserId()).ifPresent(reporter -> {
                c.setUsername(reporter.getUsername());
                c.setUserMobile(reporter.getMobileNumber());
                c.setUserLocation(reporter.getLocation());
            });
        }
        
        // Fetch Worker Details
        if (c.getWorkerId() != null) {
            userRepo.findById(c.getWorkerId()).ifPresent(worker -> {
                c.setWorkerName(worker.getUsername());
                c.setWorkerMobile(worker.getMobileNumber());
            });
        }
        return c;
    }

    // Helper for Lists
    private List<Complaint> populateDetailsList(List<Complaint> complaints) {
        for (Complaint c : complaints) {
            populateDetails(c);
        }
        return complaints;
    }

    // 1. Fetch complaints based on who is asking
    @GetMapping
    public List<Complaint> getAll(@RequestParam(required = false) Integer userId, 
                                  @RequestParam(required = false) Integer workerId) {
        List<Complaint> complaints;
        
        if (userId != null) {
            complaints = complaintRepo.findByUserId(userId);
        } else if (workerId != null) {
            complaints = complaintRepo.findByWorkerId(workerId);
        } else {
            complaints = complaintRepo.findAll(); // Admin gets everything
        }
        
        // Populate all names and numbers before sending to React!
        return populateDetailsList(complaints);
    }

    // 2. User creates a new complaint
    @PostMapping
    public Complaint create(@RequestBody Complaint complaint) {
        complaint.setStatus("PENDING");
        Complaint saved = complaintRepo.save(complaint);
        return populateDetails(saved);
    }

    // 3. Admin assigns a complaint to a worker AND TRIGGERS NOTIFICATIONS
    @PutMapping("/{id}/assign/{workerId}")
    public Complaint assign(@PathVariable Integer id, @PathVariable Integer workerId) {
        Complaint c = complaintRepo.findById(id).orElseThrow();
        c.setWorkerId(workerId);
        c.setStatus("ASSIGNED");
        Complaint saved = complaintRepo.save(c);

        // Fetch User and Worker to get their names and numbers for the notification text
        User user = userRepo.findById(c.getUserId()).orElse(null);
        User worker = userRepo.findById(workerId).orElse(null);

        if (user != null && worker != null) {
            // 1. Send Notice to the USER
            Notification userNotif = new Notification();
            userNotif.setUserId(user.getId());
            userNotif.setTitle("Worker Assigned");
            userNotif.setMessage("Worker " + worker.getUsername() + " (" + worker.getMobileNumber() + ") has been dispatched for Ticket #" + c.getId());
            notifRepo.save(userNotif);

            // 2. Send Notice to the WORKER
            Notification workerNotif = new Notification();
            workerNotif.setUserId(workerId);
            workerNotif.setTitle("New Task Dispatched");
            workerNotif.setMessage("You are assigned to Ticket #" + c.getId() + ". Location: " + c.getLocation() + " | Client Contact: " + user.getMobileNumber());
            notifRepo.save(workerNotif);
        }

        return populateDetails(saved);
    }

    // 4. Worker resolves a complaint
    @PutMapping("/{id}/resolve")
    public Complaint resolve(@PathVariable Integer id) {
        Complaint c = complaintRepo.findById(id).orElseThrow();
        c.setStatus("RESOLVED");
        Complaint saved = complaintRepo.save(c);
        return populateDetails(saved);
    }

    // 5. Admin fetches workers by specialty
    @GetMapping("/workers/{specialty}")
    public List<User> getWorkersBySpecialty(@PathVariable String specialty) {
        return userRepo.findByRoleAndSpecialtyContaining("WORKER", specialty);
    }

    // 6. Admin deletes a resolved complaint
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable Integer id) {
        complaintRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}