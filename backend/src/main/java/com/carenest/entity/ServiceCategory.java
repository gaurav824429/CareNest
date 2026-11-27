package com.carenest.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "service_categories")
public class ServiceCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String slug;

    @Column(length = 1000)
    private String description;

    private String iconName;
    private String durationLabel = "2 hours";
    private Integer defaultDurationHours = 2;

    private Double regularPrice = 699.0;
    private Double introductoryPrice = 499.0;
    private boolean promotionalPricingEnabled = true;

    private Double baseHourlyRate = 250.0;
    private boolean active = true;
    private boolean specialOccasion = false;

    public ServiceCategory() {}

    @Transient
    public Double getEffectivePrice() {
        if (promotionalPricingEnabled && introductoryPrice != null && introductoryPrice > 0) {
            return introductoryPrice;
        }
        return regularPrice != null ? regularPrice : (baseHourlyRate != null ? baseHourlyRate : 499.0);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
    public String getDurationLabel() { return durationLabel; }
    public void setDurationLabel(String durationLabel) { this.durationLabel = durationLabel; }
    public Integer getDefaultDurationHours() { return defaultDurationHours; }
    public void setDefaultDurationHours(Integer defaultDurationHours) { this.defaultDurationHours = defaultDurationHours; }
    public Double getRegularPrice() { return regularPrice; }
    public void setRegularPrice(Double regularPrice) { this.regularPrice = regularPrice; }
    public Double getIntroductoryPrice() { return introductoryPrice; }
    public void setIntroductoryPrice(Double introductoryPrice) { this.introductoryPrice = introductoryPrice; }
    public boolean isPromotionalPricingEnabled() { return promotionalPricingEnabled; }
    public void setPromotionalPricingEnabled(boolean promotionalPricingEnabled) { this.promotionalPricingEnabled = promotionalPricingEnabled; }
    public Double getBaseHourlyRate() { return baseHourlyRate; }
    public void setBaseHourlyRate(Double baseHourlyRate) { this.baseHourlyRate = baseHourlyRate; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public boolean isSpecialOccasion() { return specialOccasion; }
    public void setSpecialOccasion(boolean specialOccasion) { this.specialOccasion = specialOccasion; }
}
