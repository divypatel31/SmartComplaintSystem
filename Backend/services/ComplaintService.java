package services;

import models.Complaint;
import config.DBConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ComplaintService {

    public void addComplaint(Complaint complaint) {
        // ADDED category to the SQL INSERT
        String sql = "INSERT INTO complaints (description, status, user_id, category) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, complaint.getDescription());
            stmt.setString(2, complaint.getStatus());
            stmt.setInt(3, complaint.getUserId());
            stmt.setString(4, complaint.getCategory()); // Save the category

            stmt.executeUpdate();
            System.out.println("Complaint saved successfully! Category: " + complaint.getCategory());

        } catch (Exception e) {
            System.out.println("Error adding complaint: " + e.getMessage());
        }
    }

    public void viewComplaintsByUserId(int userId) {
        String sql = "SELECT * FROM complaints WHERE user_id = ?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();

            System.out.println("ID | Category | Description | Status");
            while (rs.next()) {
                System.out.println(
                        rs.getInt("id") + " | " +
                                rs.getString("category") + " | " +
                                rs.getString("description") + " | " +
                                rs.getString("status"));
            }
        } catch (Exception e) {
            System.out.println("Error fetching complaints: " + e.getMessage());
        }
    }

    public void viewAllComplaints() {

        String sql = "SELECT * FROM complaints";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {

            System.out.println("ID | Description | Status | User ID");
            while (rs.next()) {
                System.out.println(
                        rs.getInt("id") + " | " +
                                rs.getString("description") + " | " +
                                rs.getString("status") + " | " +
                                rs.getInt("user_id"));
            }
        } catch (Exception e) {
            System.out.println("Error fetching complaints: " + e.getMessage());
        }
    }

    public void updateStatus(int id, String status) {

        String sql = "UPDATE complaints SET status = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, status);
            stmt.setInt(2, id);

            int rowsUpdated = stmt.executeUpdate();
            if (rowsUpdated > 0) {
                System.out.println("Complaint status updated to: " + status);
            } else {
                System.out.println("Complaint ID not found.");
            }
        } catch (Exception e) {
            System.out.println("Error updating status: " + e.getMessage());
        }
    }

    public String getComplaintCategory(int id) {
        String sql = "SELECT category FROM complaints WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getString("category");
            }
        } catch (Exception e) {
            System.out.println("Error fetching category: " + e.getMessage());
        }
        return null;
    }

    public void assignComplaintToWorker(int complaintId, int workerId) {
        String sql = "UPDATE complaints SET status = 'ASSIGNED', worker_id = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, workerId);
            stmt.setInt(2, complaintId);
            int rows = stmt.executeUpdate();
            if (rows > 0) {
                System.out.println("Complaint successfully assigned to Worker ID: " + workerId);
            } else {
                System.out.println("Complaint ID not found.");
            }
        } catch (Exception e) {
            System.out.println("Error assigning complaint: " + e.getMessage());
        }
    }

    public void viewComplaintsByWorkerId(int workerId) {
        String sql = "SELECT * FROM complaints WHERE worker_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, workerId);
            ResultSet rs = stmt.executeQuery();
            System.out.println("ID | Category | Description | Status");
            while (rs.next()) {
                System.out.println(
                    rs.getInt("id") + " | " +
                    rs.getString("category") + " | " +
                    rs.getString("description") + " | " +
                    rs.getString("status")
                );
            }
        } catch (Exception e) {
            System.out.println("Error fetching assigned complaints: " + e.getMessage());
        }
    }
    
}