package com.example.helloworld.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;

import jakarta.annotation.PostConstruct;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://10.109.206.114:3000"
}, allowCredentials = "true")
public class UploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDirName;

    private Path uploadDir;

    @PostConstruct
    public void init() throws IOException {
        uploadDir = Paths.get(uploadDirName);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
    }

    @PostMapping(path = "/uploads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("No file provided");
        }
        String original = file.getOriginalFilename();
        String storedName = UUID.randomUUID() + "_" + (original == null ? "file" : original.replaceAll("\\s+", "_"));
        Path target = uploadDir.resolve(storedName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        String encoded = URLEncoder.encode(storedName, StandardCharsets.UTF_8);
        String imagePath = "/uploads/" + encoded; // relative path served by StaticResourceConfig

        Map<String, String> resp = new HashMap<>();
        resp.put("imageUrl", imagePath);
        resp.put("filename", storedName);
        return resp;
    }
}
