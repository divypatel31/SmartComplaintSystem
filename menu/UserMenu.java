package menu;

import services.ComplaintService;
import models.Complaint;

import java.util.Scanner;

public class UserMenu extends BaseMenu {

    private ComplaintService complaintService;
    private Scanner sc = new Scanner(System.in);

    public UserMenu(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @Override
    public void showMenu() {
        System.out.println("\n--- User Menu ---");
        System.out.println("1. Create Complaint");
        System.out.println("2. View Complaints");
    }

    @Override
    public void handleInput() {
        int choice = sc.nextInt();

        if (choice == 1) {
            System.out.print("Enter Complaint ID: ");
            int id = sc.nextInt();
            sc.nextLine();

            System.out.print("Enter Description: ");
            String desc = sc.nextLine();

            Complaint c = new Complaint(id, desc, "PENDING", 1);
            complaintService.addComplaint(c);

            System.out.println("Complaint created successfully!");

        } else if (choice == 2) {
            complaintService.viewAllComplaints();
        }
    }
}
