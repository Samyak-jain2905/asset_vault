package com.assetvault.backend.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.assetvault.backend.model.Asset;
import com.assetvault.backend.model.User;
import com.assetvault.backend.repository.AssetRepository;
import com.assetvault.backend.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Transactional
public class AdminController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    AssetRepository assetRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();

        for (User user : users) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", user.getId());
            userMap.put("username", user.getUsername());
            userMap.put("email", user.getEmail());
            
            // Extract role names
            List<String> roles = new ArrayList<>();
            user.getRoles().forEach(role -> roles.add(role.getName().name()));
            userMap.put("roles", roles);

            // Asset count
            int assetCount = assetRepository.findByUserId(user.getId()).size();
            userMap.put("assetCount", assetCount);

            response.add(userMap);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/assets")
    public ResponseEntity<?> getAllAssets() {
        // Find all assets in the database globally
        List<Asset> allAssets = assetRepository.findAll();
        return ResponseEntity.ok(allAssets);
    }
}
