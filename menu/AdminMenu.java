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
    }

    @Override
    public void handleInput() {
        int choice = sc.nextInt();

        if (choice == 1) {
            adminService.viewAllComplaints();
        } else if (choice == 2) {
            System.out.print("Enter Complaint ID: ");
            int id = sc.nextInt();

            adminService.assignComplaint(id);
        }
    }
}
