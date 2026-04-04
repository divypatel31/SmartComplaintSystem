package menu;

import services.ComplaintService;
import models.Complaint;
import java.util.Scanner;

public class UserMenu extends BaseMenu {

    private ComplaintService complaintService;
    private int loggedInUserId; // Store the user ID!
    private Scanner sc = new Scanner(System.in);

    // Update constructor to accept the logged-in user's ID
    public UserMenu(ComplaintService complaintService, int loggedInUserId) {
        this.complaintService = complaintService;
        this.loggedInUserId = loggedInUserId;
    }

    @Override
    public void showMenu() {
        System.out.println("\n--- User Menu ---");
        System.out.println("1. Create Complaint");
        System.out.println("2. View Complaints");
        System.out.println("3. Go Back (Logout)");
    }

    @Override
    public boolean handleInput() {
        try {
            int choice = Integer.parseInt(sc.nextLine());

            if (choice == 1) {
                // ASK FOR CATEGORY
                System.out.println("Select Complaint Category:");
                System.out.println("1. Water / Plumbing");
                System.out.println("2. Electrical");
                System.out.println("3. IT / Network");
                System.out.println("4. Other");
                System.out.print("Choice: ");
                
                int catChoice = Integer.parseInt(sc.nextLine());
                String category = "OTHER";
                if(catChoice == 1) category = "PLUMBING";
                if(catChoice == 2) category = "ELECTRICAL";
                if(catChoice == 3) category = "IT";

                System.out.print("Enter Description of your problem: ");
                String desc = sc.nextLine();

                // Pass the new category to the model
                Complaint c = new Complaint(0, desc, "PENDING", loggedInUserId, category);
                complaintService.addComplaint(c);
                return true; 

            } else if (choice == 2) {
                complaintService.viewComplaintsByUserId(loggedInUserId);
                return true; 

            } else if (choice == 3) {
                System.out.println("Logging out...");
                return false; 

            } else {
                System.out.println("Invalid choice. Please try again.");
                return true;
            }
        } catch (NumberFormatException e) {
            System.out.println("Invalid input! Please enter a number.");
            return true;
        }
    }
}