package com.example.helloworld.repository;

import com.example.helloworld.model.Swipe;
import com.example.helloworld.model.User;
import com.example.helloworld.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SwipeRepository extends JpaRepository<Swipe, Long> {
    List<Swipe> findByUserAndDirection(User user, Swipe.SwipeDirection direction);
    Optional<Swipe> findByUserAndPost(User user, Post post);
}