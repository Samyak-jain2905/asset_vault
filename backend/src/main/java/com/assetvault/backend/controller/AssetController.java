package com.assetvault.backend.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.assetvault.backend.model.Asset;
import com.assetvault.backend.model.Category;
import com.assetvault.backend.model.User;
import com.assetvault.backend.repository.AssetRepository;
import com.assetvault.backend.repository.CategoryRepository;
import com.assetvault.backend.repository.UserRepository;
import com.assetvault.backend.security.services.UserDetailsImpl;
import org.springframework.security.core.context.SecurityContextHolder;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/assets")
public class AssetController {

    @Autowired
    AssetRepository assetRepository;
    
    @Autowired
    UserRepository userRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    com.assetvault.backend.service.FileService fileService;

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(userDetails.getId()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadFile(@org.springframework.web.bind.annotation.RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String fileName = fileService.storeFile(file);
        return ResponseEntity.ok(java.util.Collections.singletonMap("url", "/uploads/" + fileName));
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<Asset> getAllAssets() {
        User user = getCurrentUser();
        return assetRepository.findByUserIdOrSharedUsersId(user.getId());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> createAsset(@RequestBody Asset assetRequest) {
        User user = getCurrentUser();
        
        // Find or create category
        Category category = null;
        if (assetRequest.getCategory() != null && assetRequest.getCategory().getName() != null) {
            Optional<Category> catOpt = categoryRepository.findByName(assetRequest.getCategory().getName());
            if (catOpt.isPresent()) {
                category = catOpt.get();
            } else {
                category = new Category(assetRequest.getCategory().getName(), assetRequest.getCategory().getIcon());
                category = categoryRepository.save(category);
            }
        }

        Asset asset = new Asset();
        asset.setName(assetRequest.getName());
        asset.setBrand(assetRequest.getBrand());
        asset.setModelNumber(assetRequest.getModelNumber());
        asset.setSerialNumber(assetRequest.getSerialNumber());
        asset.setPurchaseDate(assetRequest.getPurchaseDate());
        asset.setPurchasePrice(assetRequest.getPurchasePrice());
        asset.setSellerOrStore(assetRequest.getSellerOrStore());
        asset.setInvoiceNumber(assetRequest.getInvoiceNumber());
        
        // Phase 2 fields
        asset.setProductImage(assetRequest.getProductImage());
        asset.setInvoiceDocument(assetRequest.getInvoiceDocument());
        asset.setWarrantyDocument(assetRequest.getWarrantyDocument());
        asset.setRegistrationNumber(assetRequest.getRegistrationNumber());
        asset.setEngineNumber(assetRequest.getEngineNumber());
        asset.setChassisNumber(assetRequest.getChassisNumber());
        asset.setInsuranceExpiry(assetRequest.getInsuranceExpiry());
        asset.setPucExpiry(assetRequest.getPucExpiry());

        asset.setUser(user);
        asset.setCategory(category);
        processTags(asset, assetRequest, user);

        assetRepository.save(asset);
        return ResponseEntity.ok(asset);
    }

    @Autowired
    com.assetvault.backend.repository.WarrantyRepository warrantyRepository;
    
    @Autowired
    com.assetvault.backend.repository.RepairHistoryRepository repairRepository;
    
    @Autowired
    com.assetvault.backend.repository.ExpenseRepository expenseRepository;

    private boolean isAuthorized(Asset asset) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        return isAdmin || asset.getUser().getId().equals(userDetails.getId()) || 
               asset.getSharedUsers().stream().anyMatch(u -> u.getId().equals(userDetails.getId()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getAssetById(@PathVariable Long id) {
        Optional<Asset> assetData = assetRepository.findById(id);
        if (assetData.isPresent() && isAuthorized(assetData.get())) {
            return ResponseEntity.ok(assetData.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateAsset(@PathVariable Long id, @RequestBody Asset assetRequest) {
        Optional<Asset> assetData = assetRepository.findById(id);
        if (assetData.isEmpty() || !isAuthorized(assetData.get())) {
            return ResponseEntity.notFound().build();
        }

        Asset asset = assetData.get();
        asset.setName(assetRequest.getName());
        asset.setBrand(assetRequest.getBrand());
        asset.setModelNumber(assetRequest.getModelNumber());
        asset.setSerialNumber(assetRequest.getSerialNumber());
        asset.setPurchaseDate(assetRequest.getPurchaseDate());
        asset.setPurchasePrice(assetRequest.getPurchasePrice());
        asset.setSellerOrStore(assetRequest.getSellerOrStore());
        asset.setInvoiceNumber(assetRequest.getInvoiceNumber());
        asset.setProductImage(assetRequest.getProductImage());
        asset.setInvoiceDocument(assetRequest.getInvoiceDocument());
        asset.setWarrantyDocument(assetRequest.getWarrantyDocument());
        asset.setRegistrationNumber(assetRequest.getRegistrationNumber());
        asset.setEngineNumber(assetRequest.getEngineNumber());
        asset.setChassisNumber(assetRequest.getChassisNumber());
        asset.setInsuranceExpiry(assetRequest.getInsuranceExpiry());
        asset.setPucExpiry(assetRequest.getPucExpiry());

        if (assetRequest.getCategory() != null && assetRequest.getCategory().getName() != null) {
            Optional<Category> catOpt = categoryRepository.findByName(assetRequest.getCategory().getName());
            if (catOpt.isPresent()) {
                asset.setCategory(catOpt.get());
            } else {
                Category category = new Category(assetRequest.getCategory().getName(), assetRequest.getCategory().getIcon());
                asset.setCategory(categoryRepository.save(category));
            }
        }
        
        processTags(asset, assetRequest, asset.getUser());

        return ResponseEntity.ok(assetRepository.save(asset));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteAsset(@PathVariable Long id) {
        Optional<Asset> assetData = assetRepository.findById(id);
        if (assetData.isPresent() && isAuthorized(assetData.get())) {
            assetRepository.deleteById(id);
            return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Asset deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    // Phase 3 Endpoints

    @GetMapping("/{id}/warranties")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getWarranties(@PathVariable Long id) {
        Optional<Asset> assetData = assetRepository.findById(id);
        if (assetData.isEmpty() || !isAuthorized(assetData.get())) {
             return ResponseEntity.badRequest().body("Asset not found or unauthorized");
        }
        return ResponseEntity.ok(warrantyRepository.findByAssetId(id));
    }

    @PostMapping("/{id}/warranties")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> addWarranty(@PathVariable Long id, @RequestBody com.assetvault.backend.model.Warranty warranty) {
        Optional<Asset> assetData = assetRepository.findById(id);
        if (assetData.isPresent() && isAuthorized(assetData.get())) {
            warranty.setAsset(assetData.get());
            return ResponseEntity.ok(warrantyRepository.save(warranty));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/repairs")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getRepairs(@PathVariable Long id) {
        Optional<Asset> assetData = assetRepository.findById(id);
        if (assetData.isEmpty() || !isAuthorized(assetData.get())) {
             return ResponseEntity.badRequest().body("Asset not found or unauthorized");
        }
        return ResponseEntity.ok(repairRepository.findByAssetId(id));
    }

    @PostMapping("/{id}/repairs")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> addRepair(@PathVariable Long id, @RequestBody com.assetvault.backend.model.RepairHistory repair) {
        Optional<Asset> assetData = assetRepository.findById(id);
        if (assetData.isPresent() && isAuthorized(assetData.get())) {
            repair.setAsset(assetData.get());
            return ResponseEntity.ok(repairRepository.save(repair));
        }
        return ResponseEntity.notFound().build();
    }

    @Autowired
    com.assetvault.backend.repository.ReminderRepository reminderRepository;

    @Autowired
    com.assetvault.backend.repository.TagRepository tagRepository;
    
    private void processTags(Asset asset, Asset assetRequest, User user) {
        if (assetRequest.getTags() != null) {
            java.util.Set<com.assetvault.backend.model.Tag> processedTags = new java.util.HashSet<>();
            for (com.assetvault.backend.model.Tag reqTag : assetRequest.getTags()) {
                if (reqTag.getName() != null && !reqTag.getName().trim().isEmpty()) {
                    String tagName = reqTag.getName().trim();
                    Optional<com.assetvault.backend.model.Tag> existingTag = tagRepository.findByNameAndUserId(tagName, user.getId());
                    if (existingTag.isPresent()) {
                        processedTags.add(existingTag.get());
                    } else {
                        com.assetvault.backend.model.Tag newTag = new com.assetvault.backend.model.Tag(tagName, user);
                        processedTags.add(tagRepository.save(newTag));
                    }
                }
            }
            asset.setTags(processedTags);
        }
    }

    @GetMapping("/{id}/expenses")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getExpenses(@PathVariable Long id) {
        Optional<Asset> assetData = assetRepository.findById(id);
        if (assetData.isEmpty() || !isAuthorized(assetData.get())) {
             return ResponseEntity.badRequest().body("Asset not found or unauthorized");
        }
        return ResponseEntity.ok(expenseRepository.findByAssetId(id));
    }

    @PostMapping("/{id}/expenses")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> addExpense(@PathVariable Long id, @RequestBody com.assetvault.backend.model.Expense expense) {
        Optional<Asset> assetData = assetRepository.findById(id);
        if (assetData.isPresent() && isAuthorized(assetData.get())) {
            expense.setAsset(assetData.get());
            return ResponseEntity.ok(expenseRepository.save(expense));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/maintenance-tasks")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getReminders(@PathVariable Long id) {
        Optional<Asset> assetData = assetRepository.findById(id);
        if (assetData.isEmpty() || !isAuthorized(assetData.get())) {
             return ResponseEntity.badRequest().body("Asset not found or unauthorized");
        }
        return ResponseEntity.ok(reminderRepository.findByAssetId(id));
    }

    @PostMapping("/{id}/maintenance-tasks")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> addReminder(@PathVariable Long id, @RequestBody com.assetvault.backend.model.Reminder reminder) {
        Optional<Asset> assetData = assetRepository.findById(id);
        if (assetData.isPresent() && isAuthorized(assetData.get())) {
            reminder.setAsset(assetData.get());
            return ResponseEntity.ok(reminderRepository.save(reminder));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/share")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> shareAsset(@PathVariable Long id, @RequestBody java.util.Map<String, String> payload) {
        Optional<Asset> assetData = assetRepository.findById(id);
        if (assetData.isEmpty() || !isAuthorized(assetData.get())) {
            return ResponseEntity.notFound().build();
        }
        Asset asset = assetData.get();
        
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !asset.getUser().getId().equals(userDetails.getId())) {
             return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", "Only the owner can share this asset."));
        }

        String email = payload.get("email");
        Optional<User> shareUserOpt = userRepository.findByEmail(email);
        if (shareUserOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", "User with this email not found."));
        }
        
        User shareUser = shareUserOpt.get();
        if (shareUser.getId().equals(asset.getUser().getId())) {
            return ResponseEntity.badRequest().body(java.util.Collections.singletonMap("message", "Cannot share with yourself."));
        }

        asset.getSharedUsers().add(shareUser);
        assetRepository.save(asset);
        
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Asset shared successfully with " + email));
    }
}
