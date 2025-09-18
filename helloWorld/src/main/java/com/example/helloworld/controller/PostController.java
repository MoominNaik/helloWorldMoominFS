package com.example.helloworld.controller;

import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.helloworld.model.Post;
import com.example.helloworld.model.User;
import com.example.helloworld.service.PostService;
import com.example.helloworld.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostService postService;
    @Autowired
    private UserService userService;


    // Create a new post
    @PostMapping
    public Post create(@RequestBody Post post, @RequestParam Long authorId) {
        User author = userService.findById(authorId).orElseThrow();
        post.setAuthor(author);
        // All fields should be set in frontend: title, description, stack, image, category
        return postService.create(post);
    }

    // Get all posts for a user (own posts)
    @GetMapping("/user/{userId}")
    public List<Post> getUserPosts(@PathVariable Long userId) {
        User user = userService.findById(userId).orElseThrow();
        return postService.findByAuthor(user);
    }

    @GetMapping("/feed")
    public List<Post> feed(@RequestParam Long userId) {
        User user = userService.findById(userId).orElseThrow();
        return postService.findUnswipedPostsForUser(user);
    }
}