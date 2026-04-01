package menu;

import services.ComplaintService;

import java.util.Scanner;

public class WorkerMenu extends BaseMenu {

    private ComplaintService complaintService;
    private Scanner sc = new Scanner(System.in);

    public WorkerMenu(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @Override
    public void showMenu() {
        System.out.println("\n--- Worker Menu ---");
        System.out.println("1. View Complaints");
        System.out.println("2. Mark Complaint as Resolved");
    }

    @Override
    public void handleInput() {
        int choice = sc.nextInt();

        if (choice == 1) {
            complaintService.viewAllComplaints();
        } else if (choice == 2) {
            System.out.print("Enter Complaint ID: ");
            int id = sc.nextInt();

            complaintService.updateStatus(id, "RESOLVED");
            System.out.println("Complaint marked as resolved!");
        }
    }
}
