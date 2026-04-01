package services;

import models.Complaint;

public class ComplaintService {

    private Complaint[] complaints = new Complaint[100];
    private int count = 0;

    public void addComplaint(Complaint complaint) {
        if (count < complaints.length) {
            complaints[count++] = complaint;
        } else {
            System.out.println("Complaint storage full");
        }
    }

    public Complaint getComplaintById(int id) {
        for (int i = 0; i < count; i++) {
            if (complaints[i].getComplaintId() == id) {
                return complaints[i];
            }
        }
        return null;
    }

    public void viewAllComplaints() {
        for (int i = 0; i < count; i++) {
            System.out.println(
                complaints[i].getComplaintId() + " | " +
                complaints[i].getDescription() + " | " +
                complaints[i].getStatus()
            );
        }
    }

    public void updateStatus(int id, String status) {
        Complaint c = getComplaintById(id);
        if (c != null) {
            c.setStatus(status);
        } else {
            System.out.println("Complaint not found");
        }
    }
}
