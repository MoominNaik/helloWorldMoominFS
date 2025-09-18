package com.example.helloworld.service;

import com.example.helloworld.model.LeftSwipe;
import com.example.helloworld.model.User;
import com.example.helloworld.model.Post;
import com.example.helloworld.repository.LeftSwipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LeftSwipeService {
    @Autowired
    private LeftSwipeRepository leftSwipeRepository;

    public LeftSwipe saveLeftSwipe(User user, Post post) {
        Optional<LeftSwipe> existing = leftSwipeRepository.findByUserAndPost(user, post);
        if (existing.isPresent()) {
            return existing.get(); // Already swiped left
        }
        LeftSwipe leftSwipe = new LeftSwipe(user, post, null);
        return leftSwipeRepository.save(leftSwipe);
    }

    public List<LeftSwipe> getLeftSwipes(User user) {
        return leftSwipeRepository.findByUser(user);
    }

    public List<Long> getLeftSwipedPostIds(User user) {
        List<LeftSwipe> leftSwipes = getLeftSwipes(user);
        return leftSwipes.stream().map(ls -> ls.getPost().getId()).toList();
    }
}
