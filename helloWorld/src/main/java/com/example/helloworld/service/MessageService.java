package com.example.helloworld.service;

import com.example.helloworld.model.Message;
import com.example.helloworld.model.User;
import com.example.helloworld.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public Message sendMessage(User from, User to, String content) {
        Message m = new Message();
        m.setFromUser(from);
        m.setToUser(to);
        m.setContent(content);
        m.setCreatedAt(LocalDateTime.now().toString());
        m.setRead(false);
        return messageRepository.save(m);
    }

    public List<Message> getInbox(String username) {
        return messageRepository.findByToUserUsernameOrderByCreatedAtDesc(username);
    }

    public List<Message> getSent(String username) {
        return messageRepository.findByFromUserUsernameOrderByCreatedAtDesc(username);
    }
}