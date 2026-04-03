package menu;

import services.WorkerService;
import java.util.Scanner;

public class WorkerMenu extends BaseMenu {

    private WorkerService workerService;
    private int loggedInWorkerId; // Track which worker is logged in
    private Scanner sc = new Scanner(System.in);

    // Update Constructor
    public WorkerMenu(WorkerService workerService, int loggedInWorkerId) {
        this.workerService = workerService;
        this.loggedInWorkerId = loggedInWorkerId;
    }

    @Override
    public void showMenu() {
        System.out.println("\n--- Worker Menu ---");
        System.out.println("1. View My Assigned Tasks");
        System.out.println("2. Mark Complaint as Resolved");
        System.out.println("3. Go Back (Logout)");
    }

    @Override
    public boolean handleInput() {
        try {
            int choice = Integer.parseInt(sc.nextLine());

            if (choice == 1) {
                // Pass their ID so they only see their own tasks!
                workerService.viewAssignedComplaints(loggedInWorkerId);
                return true;
            } else if (choice == 2) {
                System.out.print("Enter Complaint ID to resolve: ");
                int id = Integer.parseInt(sc.nextLine());
                workerService.resolveComplaint(id);
                return true;
            } else if (choice == 3) {
                System.out.println("Returning to main menu...");
                return false; 
            } else {
                System.out.println("Invalid choice. Please try again.");
                return true;
            }
        } catch (NumberFormatException e) {
            System.out.println("Invalid input! Please enter a valid number.");
            return true;
        }
    }
}