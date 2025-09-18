package com.example.helloworld.service;

import com.example.helloworld.model.ChatMessage;
import com.example.helloworld.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ChatService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    // Save a new chat message
    public ChatMessage saveMessage(ChatMessage message) {
        if (message.getSender() == null || message.getSender().trim().isEmpty()) {
            throw new IllegalArgumentException("Sender cannot be null or empty");
        }
        if (message.getRecipient() == null || message.getRecipient().trim().isEmpty()) {
            throw new IllegalArgumentException("Recipient cannot be null or empty");
        }
        if (message.getContent() == null || message.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be null or empty");
        }
        message.setTimestamp(LocalDateTime.now());
        return chatMessageRepository.save(message);
    }

    // Get all messages
    public List<ChatMessage> getAllMessages() {
        return chatMessageRepository.findAllByOrderByTimestampDesc();
    }

    // Get message by ID
    public Optional<ChatMessage> getMessageById(Long id) {
        return chatMessageRepository.findById(id);
    }

    // Get messages by sender
    public List<ChatMessage> getMessagesBySender(String sender) {
        return chatMessageRepository.findBySenderOrderByTimestampDesc(sender);
    }

    // Get messages between two users (sender and recipient)
    public List<ChatMessage> getMessagesBetweenUsers(String user1, String user2) {
        return chatMessageRepository.findMessagesBetweenUsers(user1, user2);
    }

    // Get recent messages (last N messages)
    public List<ChatMessage> getRecentMessages(int limit) {
        List<ChatMessage> allMessages = chatMessageRepository.findAllByOrderByTimestampDesc();
        return allMessages.subList(0, Math.min(limit, allMessages.size()));
    }

    // Search messages by content
    public List<ChatMessage> searchMessages(String keyword) {
        return chatMessageRepository.findByContentContaining(keyword);
    }

    // Delete message by ID
    public boolean deleteMessage(Long id) {
        if (chatMessageRepository.existsById(id)) {
            chatMessageRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Get messages after a specific timestamp
    public List<ChatMessage> getMessagesAfter(LocalDateTime timestamp) {
        return chatMessageRepository.findByTimestampAfter(timestamp);
    }

    // Get all messages where user is sender or recipient
public List<ChatMessage> getMessagesByUser(String username) {
    return chatMessageRepository.findBySenderOrRecipient(username);
}
}
