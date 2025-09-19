package com.example.helloworld.repository;

import com.example.helloworld.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}