package com.smartcomplaint.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
    private String role;
    private String specialty;
    private String email;
    private String location;
    private String mobileNumber;
}