package com.example.helloworld.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "swipes")
public class Swipe {

    public enum SwipeDirection {
        LEFT, RIGHT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SwipeDirection direction;

    // Timestamp of swipe
    @Column(nullable = false)
    private LocalDateTime swipedAt;

    public Swipe() {
        this.swipedAt = LocalDateTime.now();
    }

    public Swipe(Long id, User user, Post post, SwipeDirection direction, LocalDateTime swipedAt) {
        this.id = id;
        this.user = user;
        this.post = post;
        this.direction = direction;
        this.swipedAt = swipedAt != null ? swipedAt : LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Post getPost() { return post; }
    public void setPost(Post post) { this.post = post; }

    public SwipeDirection getDirection() { return direction; }
    public void setDirection(SwipeDirection direction) { this.direction = direction; }

    public LocalDateTime getSwipedAt() { return swipedAt; }
    public void setSwipedAt(LocalDateTime swipedAt) { this.swipedAt = swipedAt; }
}