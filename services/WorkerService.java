package services;

import models.Complaint;

public class WorkerService {

    private ComplaintService complaintService;

    public WorkerService(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    public void viewComplaints() {
        complaintService.viewAllComplaints();
    }

    public void resolveComplaint(int complaintId) {
        Complaint c = complaintService.getComplaintById(complaintId);

        if (c != null) {
            c.setStatus("RESOLVED");
            System.out.println("Complaint resolved successfully");
        } else {
            System.out.println("Complaint not found");
        }
    }
}
