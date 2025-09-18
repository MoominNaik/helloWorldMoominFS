package com.example.helloworld.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String stack;

    private String image; // store filename or URL

    @Column(nullable = false)
    private String category;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    // transient field for swipe timestamp (not persisted in DB)
    @Transient
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private LocalDateTime swipedAt;

    public Post() {}

    public Post(Long id, String title, String description, String stack, String image, String category, User author) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.stack = stack;
        this.image = image;
        this.category = category;
        this.author = author;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStack() { return stack; }
    public void setStack(String stack) { this.stack = stack; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public LocalDateTime getSwipedAt() { return swipedAt; }
    public void setSwipedAt(LocalDateTime swipedAt) { this.swipedAt = swipedAt; }
}