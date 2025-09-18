package com.example.helloworld.controller;

import com.example.helloworld.model.*;
import com.example.helloworld.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/swipes")
public class SwipeController {

    @Autowired
    private SwipeService swipeService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @PostMapping
    public Swipe swipe(
            @RequestParam Long userId,
            @RequestParam Long postId,
            @RequestParam Swipe.SwipeDirection direction,
            @RequestParam(required = false) String swipedAt // receive ISO string from frontend
    ) {
        User user = userService.findById(userId).orElseThrow();
        Post post = postService.findAll().stream()
                .filter(p -> p.getId().equals(postId))
                .findFirst()
                .orElseThrow();

        Swipe swipe = swipeService.swipe(user, post, direction);

        // Convert frontend string to LocalDateTime if provided
        LocalDateTime timestamp = swipedAt != null ? LocalDateTime.parse(swipedAt) : LocalDateTime.now();
        swipe.setSwipedAt(timestamp);

        return swipeService.save(swipe); // Save and return
    }

    @GetMapping("/inbox")
    public List<Post> inbox(@RequestParam Long userId) {
        User user = userService.findById(userId).orElseThrow();
        return swipeService.getRightSwipedPosts(user)
                .stream()
                .map(swipe -> {
                    Post post = swipe.getPost();
                    post.setSwipedAt(swipe.getSwipedAt()); // attach swipe time to post
                    return post;
                })
                .collect(Collectors.toList());
    }
}