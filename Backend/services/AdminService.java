package services;

import config.DBConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class AdminService {
    private ComplaintService complaintService;

    public AdminService(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    public void viewAllComplaints() {
        complaintService.viewAllComplaints();
    }

    public String getComplaintCategory(int complaintId) {
        return complaintService.getComplaintCategory(complaintId);
    }

    // UPDATED: Now returns a boolean!
    public boolean listWorkersBySpecialty(String specialty) {
        String sql = "SELECT id, username FROM users WHERE role = 'WORKER' AND specialty = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, specialty);
            ResultSet rs = stmt.executeQuery();
            
            System.out.println("\n--- Available " + specialty + " Workers ---");
            boolean found = false;
            while (rs.next()) {
                found = true;
                System.out.println("Worker ID: " + rs.getInt("id") + " | Name: " + rs.getString("username"));
            }
            if (!found) {
                System.out.println("No workers found for this specialty!");
                return false; // Tell the menu to stop!
            }
            return true; // Tell the menu to continue!
        } catch (Exception e) {
            System.out.println("Error fetching workers: " + e.getMessage());
            return false;
        }
    }

    public void assignComplaint(int complaintId, int workerId) {
        complaintService.assignComplaintToWorker(complaintId, workerId);
    }
}