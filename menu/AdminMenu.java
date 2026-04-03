package menu;

import services.AdminService;
import java.util.Scanner;

public class AdminMenu extends BaseMenu {

    private AdminService adminService;
    private Scanner sc = new Scanner(System.in);

    public AdminMenu(AdminService adminService) {
        this.adminService = adminService;
    }

    @Override
    public void showMenu() {
        System.out.println("\n--- Admin Menu ---");
        System.out.println("1. View All Complaints");
        System.out.println("2. Assign Complaint");
        System.out.println("3. Go Back (Logout)");
    }

    @Override
    public boolean handleInput() {
        try {
            int choice = Integer.parseInt(sc.nextLine());

            if (choice == 1) {
                adminService.viewAllComplaints();
                return true;
            } else if (choice == 2) {
                System.out.print("Enter Complaint ID to assign: ");
                int id = Integer.parseInt(sc.nextLine());
                
                String category = adminService.getComplaintCategory(id);
                
                if (category != null) {
                    // UPDATED: Check if workers actually exist before asking for ID
                    boolean hasWorkers = adminService.listWorkersBySpecialty(category);
                    
                    if (hasWorkers) {
                        System.out.print("\nEnter Worker ID to assign to this complaint: ");
                        int workerId = Integer.parseInt(sc.nextLine());
                        adminService.assignComplaint(id, workerId);
                    } else {
                        System.out.println("Assignment aborted: Please register a " + category + " worker first.");
                    }
                } else {
                    System.out.println("Complaint ID not found!");
                }
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