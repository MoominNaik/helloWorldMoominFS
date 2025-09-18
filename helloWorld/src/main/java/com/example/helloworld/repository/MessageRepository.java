package com.example.helloworld.repository;

import com.example.helloworld.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    // fetch inbox by recipient username
    List<Message> findByToUserUsernameOrderByCreatedAtDesc(String username);

    // fetch sent messages by sender username
    List<Message> findByFromUserUsernameOrderByCreatedAtDesc(String username);
}