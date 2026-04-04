package menu;

import services.*;
import java.util.Scanner;

public class Menu {

    public void start() {
        Scanner sc = new Scanner(System.in);
        
        ComplaintService complaintService = new ComplaintService();
        AdminService adminService = new AdminService(complaintService);
        WorkerService workerService = new WorkerService(complaintService);
        AuthService authService = new AuthService(); // New Auth Service

        while (true) {
            System.out.println("\n--- Welcome to Smart Complaint System ---");
            System.out.println("1. Login");
            System.out.println("2. Sign Up");
            System.out.println("3. Exit System");

            try {
                int authChoice = Integer.parseInt(sc.nextLine());

                if (authChoice == 1) {
                    // --- LOGIN PROCESS ---
                    System.out.print("Enter Username: ");
                    String user = sc.nextLine();
                    System.out.print("Enter Password: ");
                    String pass = sc.nextLine();

                    String[] userData = authService.login(user, pass);

                    if (userData != null) {
                        int userId = Integer.parseInt(userData[0]);
                        String role = userData[1];
                        
                        System.out.println("Login Successful! Welcome, " + user + " (" + role + ")");
                        
                        // Route to the correct menu based on their database role!
                        BaseMenu menu = null;
                        if (role.equals("USER")) {
                            menu = new UserMenu(complaintService, userId); // Pass their ID!
                        } else if (role.equals("ADMIN")) {
                            menu = new AdminMenu(adminService);
                        } else if (role.equals("WORKER")) {
                            // UPDATED: Now passing userId to WorkerMenu!
                            menu = new WorkerMenu(workerService, userId); 
                        }

                        if (menu != null) {
                            // Keep them in their specific menu until they choose "3. Go Back"
                            boolean keepRunning = true;
                            while (keepRunning) {
                                menu.showMenu();
                                keepRunning = menu.handleInput(); // Captures the boolean return!
                                if (keepRunning) {
                                    System.out.println("Press Enter to continue...");
                                    sc.nextLine();
                                }
                            }
                        }
                    } else {
                        System.out.println("Invalid Username or Password!");
                    }

                }  else if (authChoice == 2) {
                    // --- SIGN UP PROCESS ---
                    System.out.print("Enter New Username: ");
                    String user = sc.nextLine();
                    System.out.print("Enter New Password: ");
                    String pass = sc.nextLine();
                    
                    // Restrict Admin Signup!
                    System.out.println("Select your role:");
                    System.out.println("1. Normal User");
                    System.out.println("2. Worker");
                    System.out.print("Choice: ");
                    int roleChoice = Integer.parseInt(sc.nextLine());
                    
                    String role = (roleChoice == 2) ? "WORKER" : "USER";
                    String specialty = null;

                    // If Worker, ask for Specialty
                    if (role.equals("WORKER")) {
                        System.out.print("Enter your specialty (e.g., PLUMBER, ELECTRICAL, IT): ");
                        specialty = sc.nextLine().toUpperCase();
                    }

                    if (authService.register(user, pass, role, specialty)) {
                        System.out.println("Registration Successful! You can now log in.");
                    }

                } else if (authChoice == 3) {
                    System.out.println("Shutting down system. Goodbye!");
                    break;
                } else {
                    System.out.println("Invalid choice.");
                }
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid number.");
            }
        }
        sc.close();
    }
}