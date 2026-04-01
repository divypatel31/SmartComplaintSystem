package models;

public class Complaint {

    private int complaintId;
    private String description;
    private String status;
    private int userId;

    public Complaint(int complaintId, String description, String status, int userId) {
        this.complaintId = complaintId;
        this.description = description;
        this.status = status;
        this.userId = userId;
    }

    public int getComplaintId() {
        return complaintId;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public int getUserId() {
        return userId;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
