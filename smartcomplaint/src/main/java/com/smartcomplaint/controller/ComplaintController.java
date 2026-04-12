package com.smartcomplaint.controller;

import com.smartcomplaint.model.Complaint;
import com.smartcomplaint.model.Notification;
import com.smartcomplaint.model.User;
import com.smartcomplaint.repository.ComplaintRepository;
import com.smartcomplaint.repository.NotificationRepository;
import com.smartcomplaint.repository.UserRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired 
    private ComplaintRepository complaintRepo;
    
    @Autowired 
    private UserRepository userRepo;

    @Autowired
    private NotificationRepository notifRepo;

    @Autowired
    private Cloudinary cloudinary; 

    // 📡 NEW: Inject the WebSocket Radio Transmitter!
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private Complaint populateDetails(Complaint c) {
        if (c.getUserId() != null) {
            userRepo.findById(c.getUserId()).ifPresent(reporter -> {
                c.setUsername(reporter.getUsername());
                c.setUserMobile(reporter.getMobileNumber());
                c.setUserLocation(reporter.getLocation());
            });
        }
        if (c.getWorkerId() != null) {
            userRepo.findById(c.getWorkerId()).ifPresent(worker -> {
                c.setWorkerName(worker.getUsername());
                c.setWorkerMobile(worker.getMobileNumber());
            });
        }
        return c;
    }

    private List<Complaint> populateDetailsList(List<Complaint> complaints) {
        for (Complaint c : complaints) {
            populateDetails(c);
        }
        return complaints;
    }

    @GetMapping
    public List<Complaint> getAll(@RequestParam(required = false) Integer userId, 
                                  @RequestParam(required = false) Integer workerId) {
        List<Complaint> complaints;
        
        if (userId != null) {
            complaints = complaintRepo.findByUserId(userId);
        } else if (workerId != null) {
            complaints = complaintRepo.findByWorkerId(workerId);
        } else {
            complaints = complaintRepo.findAll(); 
        }
        
        return populateDetailsList(complaints);
    }

    @PostMapping
    public ResponseEntity<?> create(HttpServletRequest request) {
        try {
            Complaint complaint;
            MultipartFile file = null;
            ObjectMapper mapper = new ObjectMapper();

            // 1. Check if the request contains form-data (an image was attached)
            if (request instanceof MultipartHttpServletRequest) {
                MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
                
                // Extract the JSON string and the file manually
                String complaintJson = multipartRequest.getParameter("complaint");
                file = multipartRequest.getFile("image");
                
                // Convert JSON string back into a Java Object
                complaint = mapper.readValue(complaintJson, Complaint.class);
            } else {
                // 2. Fallback if no image is sent, just read the raw JSON
                complaint = mapper.readValue(request.getInputStream(), Complaint.class);
            }

            complaint.setStatus("PENDING");

            // 3. If an image was attached, upload it to Cloudinary
            if (file != null && !file.isEmpty()) {
                var uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                String imageUrl = uploadResult.get("url").toString();
                complaint.setImageUrl(imageUrl); 
            }
            
            // 4. Save to TiDB database
            Complaint saved = complaintRepo.save(complaint);
            
            // 📡 NEW: Broadcast to Admin that a new ticket arrived!
            messagingTemplate.convertAndSend("/topic/admin/complaints", populateDetails(saved));
            
            return ResponseEntity.ok(populateDetails(saved));
            
        } catch (Exception e) {
            e.printStackTrace(); // Prints the exact error to your backend console
            return ResponseEntity.status(500).body("Error creating complaint: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/assign/{workerId}")
    public Complaint assign(@PathVariable Integer id, @PathVariable Integer workerId) {
        Complaint c = complaintRepo.findById(id).orElseThrow();
        c.setWorkerId(workerId);
        c.setStatus("ASSIGNED");
        Complaint saved = complaintRepo.save(c);

        User user = userRepo.findById(c.getUserId()).orElse(null);
        User worker = userRepo.findById(workerId).orElse(null);

        if (user != null && worker != null) {
            Notification userNotif = new Notification();
            userNotif.setUserId(user.getId());
            userNotif.setTitle("Worker Assigned");
            userNotif.setMessage("Worker " + worker.getUsername() + " (" + worker.getMobileNumber() + ") has been dispatched for Ticket #" + c.getId());
            notifRepo.save(userNotif);

            Notification workerNotif = new Notification();
            workerNotif.setUserId(workerId);
            workerNotif.setTitle("New Task Dispatched");
            workerNotif.setMessage("You are assigned to Ticket #" + c.getId() + ". Location: " + c.getLocation() + " | Client Contact: " + user.getMobileNumber());
            notifRepo.save(workerNotif);

            // 📡 NEW: Broadcast live alerts to the specific User and Worker!
            messagingTemplate.convertAndSend("/topic/alerts/" + user.getId(), userNotif);
            messagingTemplate.convertAndSend("/topic/alerts/" + workerId, workerNotif);
            
            // Broadcast to update the Admin's complaint grid live
            messagingTemplate.convertAndSend("/topic/admin/complaints", populateDetails(saved));
        }

        return populateDetails(saved);
    }

    @PutMapping("/{id}/resolve")
    public Complaint resolve(@PathVariable Integer id) {
        Complaint c = complaintRepo.findById(id).orElseThrow();
        c.setStatus("RESOLVED");
        Complaint saved = complaintRepo.save(c);

        // 📡 NEW: Tell the Admin dashboard that a ticket was just resolved
        messagingTemplate.convertAndSend("/topic/admin/complaints", populateDetails(saved));

        return populateDetails(saved);
    }

    @GetMapping("/workers/{specialty}")
    public List<User> getWorkersBySpecialty(@PathVariable String specialty) {
        return userRepo.findByRoleAndSpecialtyContaining("WORKER", specialty);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComplaint(@PathVariable Integer id) {
        complaintRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}