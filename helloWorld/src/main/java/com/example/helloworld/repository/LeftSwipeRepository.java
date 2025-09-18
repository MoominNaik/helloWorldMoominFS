package com.example.helloworld.repository;

import com.example.helloworld.model.LeftSwipe;
import com.example.helloworld.model.User;
import com.example.helloworld.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LeftSwipeRepository extends JpaRepository<LeftSwipe, Long> {
    List<LeftSwipe> findByUser(User user);
    Optional<LeftSwipe> findByUserAndPost(User user, Post post);
}
