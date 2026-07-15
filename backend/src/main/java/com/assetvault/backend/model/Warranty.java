package com.assetvault.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "warranties")
public class Warranty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Asset asset;

    @NotBlank
    private String provider; // e.g., Manufacturer, Extended

    private String type; // e.g., Limited, Full, Extended

    private LocalDate startDate;
    private LocalDate endDate;

    private String documentUrl; // Link to warranty card PDF/image

    public Warranty() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Asset getAsset() { return asset; }
    public void setAsset(Asset asset) { this.asset = asset; }
    
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }
}
