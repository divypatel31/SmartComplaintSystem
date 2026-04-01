package menu;

import services.*;
import java.util.Scanner;

public class Menu {

    public void start() {

        Scanner sc = new Scanner(System.in);

        // Initialize services
        ComplaintService complaintService = new ComplaintService();
        AdminService adminService = new AdminService(complaintService);

        while (true) {
            System.out.println("\n--- Select Role ---");
            System.out.println("1. User");
            System.out.println("2. Admin");
            System.out.println("3. Worker");
            System.out.println("4. Exit");

            int choice = sc.nextInt();

            BaseMenu menu = null;

            if (choice == 1) {
                menu = new UserMenu(complaintService);
            } else if (choice == 2) {
                menu = new AdminMenu(adminService);
            } else if (choice == 3) {
                menu = new WorkerMenu(complaintService);
            } else if (choice == 4) {
                System.out.println("Exiting...");
                break;
            }

            if (menu != null) {
                menu.showMenu();
                menu.handleInput();
            }
        }
    }
}
