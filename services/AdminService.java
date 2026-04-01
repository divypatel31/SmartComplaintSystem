package services;

import models.Complaint;

public class AdminService {

    private ComplaintService complaintService;

    public AdminService(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    public void viewAllComplaints() {
        complaintService.viewAllComplaints();
    }

    public void assignComplaint(int complaintId) {
        Complaint c = complaintService.getComplaintById(complaintId);

        if (c != null) {
            c.setStatus("ASSIGNED");
            System.out.println("Complaint assigned successfully");
        } else {
            System.out.println("Complaint not found");
        }
    }
}
