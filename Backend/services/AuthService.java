package services;

import config.DBConnection;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class AuthService {

    public String[] login(String username, String password) {
        String sql = "SELECT id, role FROM users WHERE username = ? AND password = ?";
        try (Connection conn = DBConnection.getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, username);
            stmt.setString(2, password); 
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new String[]{ String.valueOf(rs.getInt("id")), rs.getString("role") };
            }
        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage());
        }
        return null; 
    }

    // UPDATED to include specialty
    public boolean register(String username, String password, String role, String specialty) {
        String sql = "INSERT INTO users (username, password, role, specialty) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, username);
            stmt.setString(2, password);
            stmt.setString(3, role.toUpperCase());
            stmt.setString(4, specialty); // Save specialty (will be null for users)
            
            stmt.executeUpdate();
            return true;
        } catch (Exception e) {
            System.out.println("Registration error: Username might already exist.");
            return false;
        }
    }
}