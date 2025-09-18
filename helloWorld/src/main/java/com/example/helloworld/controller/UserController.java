package com.example.helloworld.controller;

import com.example.helloworld.model.AuthRequest;
import com.example.helloworld.model.User;
import com.example.helloworld.service.AuthenticationService;
import com.example.helloworld.service.JwtService;
import com.example.helloworld.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")

public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private JwtService jwtService;

    // Original registration endpoint - updated with better error handling
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User createdUser = userService.register(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(Map.of("error", e.getMessage()), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Registration failed"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // New authentication endpoints
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthRequest authRequest) {
        try {
            Map<String, Object> response = authenticationService.authenticate(authRequest);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = Map.of("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of("error", "Login failed");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        try {
            Map<String, String> response = authenticationService.logout();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = Map.of("error", "Logout failed");
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            System.out.println("Received Authorization header: " + authHeader);
            
            // Extract token from Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("Invalid authorization header");
                return new ResponseEntity<>(Map.of("error", "Invalid authorization header"), HttpStatus.UNAUTHORIZED);
            }
            
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            System.out.println("Extracted token: " + token);
            
            // Extract username from token
            String username = jwtService.extractUsername(token);
            System.out.println("Extracted username: " + username);
            
            // Validate token
            if (jwtService.isTokenExpired(token)) {
                System.out.println("Token is expired");
                return new ResponseEntity<>(Map.of("error", "Token expired"), HttpStatus.UNAUTHORIZED);
            }
            
            // Find user by username
            Optional<User> userOpt = userService.findByUsername(username);
            if (userOpt.isEmpty()) {
                System.out.println("User not found for username: " + username);
                return new ResponseEntity<>(Map.of("error", "User not found"), HttpStatus.NOT_FOUND);
            }
            
            User user = userOpt.get();
            System.out.println("Found user: " + user.getUsername() + " with email: " + user.getEmail());
            return new ResponseEntity<>(user, HttpStatus.OK);
            
        } catch (Exception e) {
            System.out.println("Exception in /me endpoint: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(Map.of("error", "Invalid token"), HttpStatus.UNAUTHORIZED);
        }
    }

    // Fetch all users
    @GetMapping("")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
}
