package config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.io.FileInputStream;
import java.util.Properties;

public class DBConnection {
    public static Connection getConnection() {
        Properties props = new Properties();
        
        try (FileInputStream fis = new FileInputStream("db.properties")) {
            props.load(fis);
            
            String url = props.getProperty("db.url");
            String user = props.getProperty("db.user");
            String password = props.getProperty("db.password");
            
            // 🔥 ADDED THIS LINE: Explicitly load the MySQL Driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            return DriverManager.getConnection(url, user, password);
            
        } catch (ClassNotFoundException e) {
            System.out.println("Database Connection Failed: Cannot find the MySQL .jar file! Make sure it is in Referenced Libraries.");
            return null;
        } catch (Exception e) {
            System.out.println("Database Connection Failed: " + e.getMessage());
            return null;
        }
    }
}