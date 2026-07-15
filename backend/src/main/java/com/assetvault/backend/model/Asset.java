package com.assetvault.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "assets")
public class Asset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String brand;
    private String modelNumber;
    private String serialNumber;
    
    private LocalDate purchaseDate;
    private BigDecimal purchasePrice;
    private String sellerOrStore;
    private String invoiceNumber;

    // Phase 2: Media & Documents
    private String productImage;
    private String invoiceDocument;
    private String warrantyDocument;

    // Phase 2: Vehicle specific attributes
    private String registrationNumber;
    private String engineNumber;
    private String chassisNumber;
    private LocalDate insuranceExpiry;
    private LocalDate pucExpiry;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Warranty> warranties;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<RepairHistory> repairHistories;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Expense> expenses;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Reminder> reminders = new java.util.ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "asset_shared_users", 
               joinColumns = @JoinColumn(name = "asset_id"), 
               inverseJoinColumns = @JoinColumn(name = "user_id"))
    private java.util.Set<User> sharedUsers = new java.util.HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "asset_tags", 
               joinColumns = @JoinColumn(name = "asset_id"), 
               inverseJoinColumns = @JoinColumn(name = "tag_id"))
    private java.util.Set<Tag> tags = new java.util.HashSet<>();
    
    public Asset() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getModelNumber() { return modelNumber; }
    public void setModelNumber(String modelNumber) { this.modelNumber = modelNumber; }
    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }
    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }
    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }
    public String getSellerOrStore() { return sellerOrStore; }
    public void setSellerOrStore(String sellerOrStore) { this.sellerOrStore = sellerOrStore; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }
    public String getInvoiceDocument() { return invoiceDocument; }
    public void setInvoiceDocument(String invoiceDocument) { this.invoiceDocument = invoiceDocument; }
    public String getWarrantyDocument() { return warrantyDocument; }
    public void setWarrantyDocument(String warrantyDocument) { this.warrantyDocument = warrantyDocument; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }
    public String getEngineNumber() { return engineNumber; }
    public void setEngineNumber(String engineNumber) { this.engineNumber = engineNumber; }
    public String getChassisNumber() { return chassisNumber; }
    public void setChassisNumber(String chassisNumber) { this.chassisNumber = chassisNumber; }
    public LocalDate getInsuranceExpiry() { return insuranceExpiry; }
    public void setInsuranceExpiry(LocalDate insuranceExpiry) { this.insuranceExpiry = insuranceExpiry; }
    public LocalDate getPucExpiry() { return pucExpiry; }
    public void setPucExpiry(LocalDate pucExpiry) { this.pucExpiry = pucExpiry; }

    public java.util.List<Reminder> getReminders() { return reminders; }
    public void setReminders(java.util.List<Reminder> reminders) { this.reminders = reminders; }

    public java.util.Set<User> getSharedUsers() { return sharedUsers; }
    public void setSharedUsers(java.util.Set<User> sharedUsers) { this.sharedUsers = sharedUsers; }

    public java.util.Set<Tag> getTags() { return tags; }
    public void setTags(java.util.Set<Tag> tags) { this.tags = tags; }
}
