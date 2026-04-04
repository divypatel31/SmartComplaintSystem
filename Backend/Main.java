import menu.Menu;
import config.DBConnection;
import java.sql.Connection;

public class Main {

    public static void main(String[] args) {
        
        System.out.println("Starting Smart Complaint System...");
        System.out.println("Checking database connection...");
        
        // Test the database connection before launching the app
        Connection conn = DBConnection.getConnection();
        
        if (conn != null) {
            System.out.println("Database connected successfully!\n");
            try {
                conn.close(); // Close the test connection
            } catch (Exception e) {
                System.out.println("Error closing test connection: " + e.getMessage());
            }
            
            // Launch the main application menu
            Menu menu = new Menu();
            menu.start();
            
        } else {
            System.out.println("\nFailed to start the application.");
            System.out.println("Please check your MySQL server and db.properties file.");
        }
    }
}