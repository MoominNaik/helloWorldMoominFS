package com.example.helloworld.controller;

import com.example.helloworld.model.ChatMessage;
import com.example.helloworld.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/messages")
    public ResponseEntity<ChatMessage> createMessage(@RequestBody ChatMessage message) {
        try {
            ChatMessage result = chatService.saveMessage(message);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().build();
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/messages/user/{username}")
    public ResponseEntity<List<ChatMessage>> fetchUserMessages(@PathVariable String username) {
        List<ChatMessage> userMessages = chatService.getMessagesByUser(username);
        return ResponseEntity.ok(userMessages);
    }

    @GetMapping("/messages/between")
    public ResponseEntity<List<ChatMessage>> fetchConversation(
            @RequestParam String user1,
            @RequestParam String user2) {
        List<ChatMessage> conversation = chatService.getMessagesBetweenUsers(user1, user2);
        return ResponseEntity.ok(conversation);
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ChatMessage>> fetchAllMessages() {
        return ResponseEntity.ok(chatService.getAllMessages());
    }

    @GetMapping("/messages/{id}")
    public ResponseEntity<ChatMessage> fetchMessageById(@PathVariable Long id) {
        Optional<ChatMessage> found = chatService.getMessageById(id);
        return found.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/messages/sender/{sender}")
    public ResponseEntity<List<ChatMessage>> fetchBySender(@PathVariable String sender) {
        return ResponseEntity.ok(chatService.getMessagesBySender(sender));
    }

    @GetMapping("/messages/recent/{limit}")
    public ResponseEntity<List<ChatMessage>> fetchRecent(@PathVariable int limit) {
        return ResponseEntity.ok(chatService.getRecentMessages(limit));
    }

    @GetMapping("/messages/search")
    public ResponseEntity<List<ChatMessage>> searchByContent(@RequestParam String keyword) {
        return ResponseEntity.ok(chatService.searchMessages(keyword));
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> removeMessage(@PathVariable Long id) {
        boolean wasDeleted = chatService.deleteMessage(id);
        return wasDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/messages/after/{timestamp}")
    public ResponseEntity<List<ChatMessage>> fetchAfter(@PathVariable String timestamp) {
        try {
            LocalDateTime parsed = LocalDateTime.parse(timestamp);
            return ResponseEntity.ok(chatService.getMessagesAfter(parsed));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}