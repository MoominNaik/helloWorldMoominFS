package com.example.helloworld.service;

import com.example.helloworld.model.AuthRequest;
import com.example.helloworld.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthenticationService {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    // Authenticate user and generate token
    public Map<String, Object> authenticate(AuthRequest authRequest) {
        boolean isValid = userService.validateCredentials(
            authRequest.getUsername(),
            authRequest.getPassword()
        );

        if (!isValid) {
            throw new RuntimeException("Invalid username or password");
        }

        // Generate JWT token
        Optional<User> userOpt = userService.findByUsername(authRequest.getUsername());
        User user = userOpt.get();

        String token = jwtService.generateToken(user.getUsername());

    Map<String, Object> response = new HashMap<>();
    response.put("token", token);
    response.put("id", user.getId()); // Add user id to response
    response.put("username", user.getUsername());
    response.put("email", user.getEmail());

    return response;
    }

    // Logout (in stateless JWT, this is mainly for client-side token removal)
    public Map<String, String> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return response;
    }
}
