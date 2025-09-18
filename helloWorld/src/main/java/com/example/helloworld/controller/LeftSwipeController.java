package com.example.helloworld.controller;

import com.example.helloworld.model.LeftSwipe;
import com.example.helloworld.model.Post;
import com.example.helloworld.model.User;
import com.example.helloworld.service.LeftSwipeService;
import com.example.helloworld.service.PostService;
import com.example.helloworld.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/left-swipes")
public class LeftSwipeController {

    @Autowired
    private LeftSwipeService leftSwipeService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity<?> createLeftSwipe(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long postId = Long.valueOf(request.get("postId").toString());
            String timestampStr = request.get("timestamp").toString();

            // Find user and post
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return new ResponseEntity<>(Map.of("error", "User not found"), HttpStatus.NOT_FOUND);
            }

            Optional<Post> postOpt = postService.findById(postId);
            if (postOpt.isEmpty()) {
                return new ResponseEntity<>(Map.of("error", "Post not found"), HttpStatus.NOT_FOUND);
            }

            User user = userOpt.get();
            Post post = postOpt.get();

            // Save left swipe
            LeftSwipe leftSwipe = leftSwipeService.saveLeftSwipe(user, post);
            
            return new ResponseEntity<>(leftSwipe, HttpStatus.CREATED);
            
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Failed to create left swipe: " + e.getMessage()), 
                                     HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/ids/{userId}")
    public ResponseEntity<?> getLeftSwipedPostIds(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isEmpty()) {
                return new ResponseEntity<>(Map.of("error", "User not found"), HttpStatus.NOT_FOUND);
            }

            User user = userOpt.get();
            List<Long> leftSwipedIds = leftSwipeService.getLeftSwipedPostIds(user);
            
            return new ResponseEntity<>(leftSwipedIds, HttpStatus.OK);
            
        } catch (Exception e) {
            return new ResponseEntity<>(Map.of("error", "Failed to get left swiped post IDs: " + e.getMessage()), 
                                     HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
