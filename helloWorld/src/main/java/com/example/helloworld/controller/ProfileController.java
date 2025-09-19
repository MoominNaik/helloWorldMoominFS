package com.example.helloworld.controller;

import com.example.helloworld.model.User;
import com.example.helloworld.service.ProfileService;
import com.example.helloworld.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserService userService;

    // Get profile of logged-in user
    @GetMapping("/{username}")
    public ResponseEntity<?> getProfile(@PathVariable String username) {
        return profileService.getProfile(username)
                .map(user -> ResponseEntity.ok(new ProfileDTO(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Update profile
    @PostMapping("/edit")
    public ResponseEntity<?> editProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestBody User updatedData) {
        String username = userDetails.getUsername();
        User updatedUser = profileService.updateProfile(username, updatedData);
        return ResponseEntity.ok(new ProfileDTO(updatedUser));
    }

    // Upload profile picture
    @PostMapping("/upload")
    public ResponseEntity<?> uploadProfilePic(@AuthenticationPrincipal UserDetails userDetails,
                                              @RequestParam("file") MultipartFile file) throws Exception {
        String username = userDetails.getUsername();
        User updatedUser = profileService.uploadProfilePic(username, file);
        return ResponseEntity.ok(new ProfileDTO(updatedUser));
    }

    // Serve profile picture
    @GetMapping("/{username}/profile-pic")
    public ResponseEntity<byte[]> getProfilePic(@PathVariable String username) {
        return profileService.getProfile(username)
                .map(user -> {
                    byte[] image = user.getProfilePic();
                    if (image == null) return ResponseEntity.notFound().<byte[]>build();
                    return ResponseEntity.ok()
                            .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                            .body(image);
                })
                .orElseGet(() -> ResponseEntity.notFound().<byte[]>build());
    }

    // DTO to avoid exposing password
    static class ProfileDTO {
        public String username;
        public String firstName;
        public String lastName;
        public String designation;
        public String bio;
        public String email;
        public String profilePicUrl;

        public ProfileDTO(User user) {
            this.username = user.getUsername();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
            this.designation = user.getDesignation();
            this.bio = user.getBio();
            this.email = user.getEmail();
            this.profilePicUrl = user.getProfilePic() != null ? "/api/profile/" + user.getUsername() + "/profile-pic" : null;
        }
    }
}