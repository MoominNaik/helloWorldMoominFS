package com.example.helloworld.service;

import com.example.helloworld.model.User;
import com.example.helloworld.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    public Optional<User> getProfile(String username) {
        return profileRepository.findByUsername(username);
    }

    public User updateProfile(String username, User updatedData) {
        Optional<User> optUser = profileRepository.findByUsername(username);
        if (optUser.isPresent()) {
            User user = optUser.get();
            user.setFirstName(updatedData.getFirstName());
            user.setLastName(updatedData.getLastName());
            user.setEmail(updatedData.getEmail());
            user.setDesignation(updatedData.getDesignation());
            user.setBio(updatedData.getBio());
            profileRepository.save(user);
            return user;
        }
        throw new RuntimeException("User not found");
    }

    public User uploadProfilePic(String username, MultipartFile file) throws IOException {
        Optional<User> optUser = profileRepository.findByUsername(username);
        if (optUser.isPresent()) {
            User user = optUser.get();
            user.setProfilePic(file.getBytes());
            profileRepository.save(user);
            return user;
        }
        throw new RuntimeException("User not found");
    }
}