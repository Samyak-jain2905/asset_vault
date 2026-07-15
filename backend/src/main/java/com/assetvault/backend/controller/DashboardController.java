package com.assetvault.backend.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.assetvault.backend.model.Asset;
import com.assetvault.backend.model.User;
import com.assetvault.backend.model.Warranty;
import com.assetvault.backend.repository.AssetRepository;
import com.assetvault.backend.repository.UserRepository;
import com.assetvault.backend.repository.WarrantyRepository;
import com.assetvault.backend.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    AssetRepository assetRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    WarrantyRepository warrantyRepository;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getDashboardStats() {
        User user = getCurrentUser();
        List<Asset> allAssets = assetRepository.findByUserId(user.getId());

        // Basic Stats
        int totalAssets = allAssets.size();
        BigDecimal totalValue = allAssets.stream()
                .map(a -> a.getPurchasePrice() != null ? a.getPurchasePrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Recent Assets (last 5)
        List<Asset> recentAssets = new ArrayList<>(allAssets);
        recentAssets.sort((a1, a2) -> Long.compare(a2.getId(), a1.getId()));
        if (recentAssets.size() > 5) {
            recentAssets = recentAssets.subList(0, 5);
        }

        // Active Warranties & Upcoming Expiries
        int activeWarrantiesCount = 0;
        List<Map<String, Object>> upcomingExpiries = new ArrayList<>();
        LocalDate today = LocalDate.now();
        LocalDate next30Days = today.plusDays(30);

        for (Asset asset : allAssets) {
            // Check Warranties
            List<Warranty> warranties = warrantyRepository.findByAssetId(asset.getId());
            for (Warranty w : warranties) {
                if (w.getEndDate() != null && !w.getEndDate().isBefore(today)) {
                    activeWarrantiesCount++;
                    
                    if (w.getEndDate().isBefore(next30Days) || w.getEndDate().isEqual(next30Days)) {
                        Map<String, Object> expiry = new HashMap<>();
                        expiry.put("assetName", asset.getName());
                        expiry.put("type", "Warranty (" + w.getType() + ")");
                        expiry.put("date", w.getEndDate());
                        expiry.put("daysLeft", ChronoUnit.DAYS.between(today, w.getEndDate()));
                        upcomingExpiries.add(expiry);
                    }
                }
            }

            // Check Insurance
            if (asset.getInsuranceExpiry() != null && !asset.getInsuranceExpiry().isBefore(today)) {
                if (asset.getInsuranceExpiry().isBefore(next30Days) || asset.getInsuranceExpiry().isEqual(next30Days)) {
                    Map<String, Object> expiry = new HashMap<>();
                    expiry.put("assetName", asset.getName());
                    expiry.put("type", "Insurance");
                    expiry.put("date", asset.getInsuranceExpiry());
                    expiry.put("daysLeft", ChronoUnit.DAYS.between(today, asset.getInsuranceExpiry()));
                    upcomingExpiries.add(expiry);
                }
            }

            // Check PUC
            if (asset.getPucExpiry() != null && !asset.getPucExpiry().isBefore(today)) {
                if (asset.getPucExpiry().isBefore(next30Days) || asset.getPucExpiry().isEqual(next30Days)) {
                    Map<String, Object> expiry = new HashMap<>();
                    expiry.put("assetName", asset.getName());
                    expiry.put("type", "PUC");
                    expiry.put("date", asset.getPucExpiry());
                    expiry.put("daysLeft", ChronoUnit.DAYS.between(today, asset.getPucExpiry()));
                    upcomingExpiries.add(expiry);
                }
            }
        }

        // Sort upcoming expiries by date ascending
        upcomingExpiries.sort((e1, e2) -> {
            LocalDate d1 = (LocalDate) e1.get("date");
            LocalDate d2 = (LocalDate) e2.get("date");
            return d1.compareTo(d2);
        });

        Map<String, Object> response = new HashMap<>();
        response.put("totalAssets", totalAssets);
        response.put("totalValue", totalValue);
        response.put("activeWarranties", activeWarrantiesCount);
        response.put("recentAssets", recentAssets);
        response.put("upcomingExpiries", upcomingExpiries);

        return ResponseEntity.ok(response);
    }
}
