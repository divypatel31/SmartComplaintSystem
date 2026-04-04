package models;

public class Complaint {

    private int complaintId;
    private String description;
    private String status;
    private int userId;
    private String category; // NEW: Added Category

    public Complaint(int complaintId, String description, String status, int userId, String category) {
        this.complaintId = complaintId;
        this.description = description;
        this.status = status;
        this.userId = userId;
        this.category = category; // Set Category
    }

    public int getComplaintId() { return complaintId; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public int getUserId() { return userId; }
    public String getCategory() { return category; } // Getter for Category

    public void setStatus(String status) { this.status = status; }
}