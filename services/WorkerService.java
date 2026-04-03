package services;

public class WorkerService {

    private ComplaintService complaintService;

    public WorkerService(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    public void viewAssignedComplaints(int workerId) {
        complaintService.viewComplaintsByWorkerId(workerId);
    }

    public void resolveComplaint(int complaintId) {
        
        // Let the ComplaintService handle the DB update
        complaintService.updateStatus(complaintId, "RESOLVED");
    }
}