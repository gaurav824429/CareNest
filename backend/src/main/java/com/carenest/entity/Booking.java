package com.carenest.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
public class Booking {
    public enum BookingStatus {
        PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "family_user_id", nullable = false)
    private User familyUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "elder_profile_id", nullable = false)
    private ElderProfile elderProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "companion_profile_id", nullable = false)
    private CompanionProfile companionProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_category_id", nullable = false)
    private ServiceCategory serviceCategory;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private Integer durationHours = 2;

    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    private String occasionType;
    private String occasionTitle;

    @Column(length = 1000)
    private String specialNotes;

    @Column(length = 1000)
    private String visitUpdateNote;

    private Integer ratingGiven;

    @Column(length = 1000)
    private String reviewComment;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public Booking() {}

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getFamilyUser() { return familyUser; }
    public void setFamilyUser(User familyUser) { this.familyUser = familyUser; }
    public ElderProfile getElderProfile() { return elderProfile; }
    public void setElderProfile(ElderProfile elderProfile) { this.elderProfile = elderProfile; }
    public CompanionProfile getCompanionProfile() { return companionProfile; }
    public void setCompanionProfile(CompanionProfile companionProfile) { this.companionProfile = companionProfile; }
    public ServiceCategory getServiceCategory() { return serviceCategory; }
    public void setServiceCategory(ServiceCategory serviceCategory) { this.serviceCategory = serviceCategory; }
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public Integer getDurationHours() { return durationHours; }
    public void setDurationHours(Integer durationHours) { this.durationHours = durationHours; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public String getOccasionType() { return occasionType; }
    public void setOccasionType(String occasionType) { this.occasionType = occasionType; }
    public String getOccasionTitle() { return occasionTitle; }
    public void setOccasionTitle(String occasionTitle) { this.occasionTitle = occasionTitle; }
    public String getSpecialNotes() { return specialNotes; }
    public void setSpecialNotes(String specialNotes) { this.specialNotes = specialNotes; }
    public String getVisitUpdateNote() { return visitUpdateNote; }
    public void setVisitUpdateNote(String visitUpdateNote) { this.visitUpdateNote = visitUpdateNote; }
    public Integer getRatingGiven() { return ratingGiven; }
    public void setRatingGiven(Integer ratingGiven) { this.ratingGiven = ratingGiven; }
    public String getReviewComment() { return reviewComment; }
    public void setReviewComment(String reviewComment) { this.reviewComment = reviewComment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
