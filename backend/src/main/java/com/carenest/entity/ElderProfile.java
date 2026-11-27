package com.carenest.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "elder_profiles")
public class ElderProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "family_user_id", nullable = false)
    private User familyUser;

    @Column(nullable = false)
    private String fullName;

    private Integer age;
    private String gender;
    private String relationship;
    private String city;
    private String address;
    private String languages;

    @Column(length = 1000)
    private String hobbies;

    @Column(length = 1000)
    private String mobilityNotes;

    @Column(length = 500)
    private String dietaryPreferences;

    private String emergencyContactName;
    private String emergencyContactPhone;
    private String avatarUrl;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ElderProfile() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getFamilyUser() { return familyUser; }
    public void setFamilyUser(User familyUser) { this.familyUser = familyUser; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }
    public String getHobbies() { return hobbies; }
    public void setHobbies(String hobbies) { this.hobbies = hobbies; }
    public String getMobilityNotes() { return mobilityNotes; }
    public void setMobilityNotes(String mobilityNotes) { this.mobilityNotes = mobilityNotes; }
    public String getDietaryPreferences() { return dietaryPreferences; }
    public void setDietaryPreferences(String dietaryPreferences) { this.dietaryPreferences = dietaryPreferences; }
    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }
    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
