package com.carenest.controller;

import com.carenest.dto.BookingDtos.*;
import com.carenest.entity.*;
import com.carenest.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/family")
public class FamilyController {
    private final UserRepository userRepository;
    private final ElderProfileRepository elderProfileRepository;
    private final CompanionProfileRepository companionProfileRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final BookingRepository bookingRepository;
    private final VisitUpdateRepository visitUpdateRepository;

    public FamilyController(UserRepository userRepository,
                            ElderProfileRepository elderProfileRepository,
                            CompanionProfileRepository companionProfileRepository,
                            ServiceCategoryRepository serviceCategoryRepository,
                            BookingRepository bookingRepository,
                            VisitUpdateRepository visitUpdateRepository) {
        this.userRepository = userRepository;
        this.elderProfileRepository = elderProfileRepository;
        this.companionProfileRepository = companionProfileRepository;
        this.serviceCategoryRepository = serviceCategoryRepository;
        this.bookingRepository = bookingRepository;
        this.visitUpdateRepository = visitUpdateRepository;
    }

    private User getFamilyUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard(Authentication auth) {
        User user = getFamilyUser(auth);
        List<ElderProfile> elders = elderProfileRepository.findByFamilyUserIdOrderByCreatedAtDesc(user.getId());
        List<Booking> bookings = bookingRepository.findByFamilyUserIdOrderByBookingDateDescStartTimeDesc(user.getId());

        long upcoming = bookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.PENDING
                        || b.getStatus() == Booking.BookingStatus.CONFIRMED
                        || b.getStatus() == Booking.BookingStatus.IN_PROGRESS)
                .count();
        long completed = bookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED)
                .count();
        long specialOccasions = bookings.stream()
                .filter(b -> b.getOccasionType() != null && !b.getOccasionType().isBlank()
                        && b.getStatus() != Booking.BookingStatus.CANCELLED
                        && b.getStatus() != Booking.BookingStatus.REJECTED)
                .count();

        return Map.of(
                "eldersCount", elders.size(),
                "upcomingBookingsCount", upcoming,
                "completedBookingsCount", completed,
                "specialOccasionsCount", specialOccasions,
                "recentBookings", bookings.stream().limit(5).toList(),
                "elders", elders
        );
    }

    @GetMapping("/elders")
    public List<ElderProfile> getElders(Authentication auth) {
        return elderProfileRepository.findByFamilyUserIdOrderByCreatedAtDesc(getFamilyUser(auth).getId());
    }

    @PostMapping("/elders")
    public ResponseEntity<ElderProfile> createElder(Authentication auth, @RequestBody ElderProfile req) {
        if (req.getFullName() == null || req.getFullName().isBlank()) {
            throw new IllegalArgumentException("Elder full name is required");
        }
        User user = getFamilyUser(auth);
        req.setId(null);
        req.setFamilyUser(user);
        return ResponseEntity.ok(elderProfileRepository.save(req));
    }

    @PutMapping("/elders/{id}")
    public ResponseEntity<ElderProfile> updateElder(Authentication auth, @PathVariable Long id, @RequestBody ElderProfile req) {
        User user = getFamilyUser(auth);
        ElderProfile existing = elderProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Elder profile not found"));
        if (!existing.getFamilyUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not have access to this profile");
        }
        existing.setFullName(req.getFullName());
        existing.setAge(req.getAge());
        existing.setGender(req.getGender());
        existing.setRelationship(req.getRelationship());
        existing.setCity(req.getCity());
        existing.setAddress(req.getAddress());
        existing.setLanguages(req.getLanguages());
        existing.setHobbies(req.getHobbies());
        existing.setMobilityNotes(req.getMobilityNotes());
        existing.setDietaryPreferences(req.getDietaryPreferences());
        existing.setEmergencyContactName(req.getEmergencyContactName());
        existing.setEmergencyContactPhone(req.getEmergencyContactPhone());
        if (req.getAvatarUrl() != null) existing.setAvatarUrl(req.getAvatarUrl());
        return ResponseEntity.ok(elderProfileRepository.save(existing));
    }

    @DeleteMapping("/elders/{id}")
    public ResponseEntity<Map<String, String>> deleteElder(Authentication auth, @PathVariable Long id) {
        User user = getFamilyUser(auth);
        ElderProfile existing = elderProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Elder profile not found"));
        if (!existing.getFamilyUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not have access to this profile");
        }
        elderProfileRepository.delete(existing);
        return ResponseEntity.ok(Map.of("message", "Elder profile removed"));
    }

    @GetMapping("/bookings")
    public List<Booking> getBookings(Authentication auth) {
        return bookingRepository.findByFamilyUserIdOrderByBookingDateDescStartTimeDesc(getFamilyUser(auth).getId());
    }

    @PostMapping("/bookings")
    public ResponseEntity<Booking> createBooking(Authentication auth, @Valid @RequestBody CreateBookingRequest req) {
        User user = getFamilyUser(auth);
        ElderProfile elder = elderProfileRepository.findById(req.elderProfileId())
                .orElseThrow(() -> new IllegalArgumentException("Elder profile not found"));
        if (!elder.getFamilyUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Selected elder profile does not belong to your account");
        }
        CompanionProfile companion = companionProfileRepository.findById(req.companionProfileId())
                .orElseThrow(() -> new IllegalArgumentException("Companion not found"));
        if (companion.getApprovalStatus() != CompanionProfile.ApprovalStatus.APPROVED) {
            throw new IllegalStateException("This companion is not currently available for bookings");
        }
        ServiceCategory service = serviceCategoryRepository.findById(req.serviceCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Service category not found"));

        int defaultHours = service.getDefaultDurationHours() != null && service.getDefaultDurationHours() > 0
                ? service.getDefaultDurationHours() : 2;
        int requestedHours = req.durationHours() != null && req.durationHours() > 0
                ? req.durationHours() : defaultHours;
        double servicePrice = service.getEffectivePrice();
        double total = requestedHours == defaultHours
                ? servicePrice
                : Math.round((servicePrice / defaultHours) * requestedHours);

        Booking booking = new Booking();
        booking.setFamilyUser(user);
        booking.setElderProfile(elder);
        booking.setCompanionProfile(companion);
        booking.setServiceCategory(service);
        booking.setBookingDate(req.bookingDate());
        booking.setStartTime(req.startTime());
        booking.setDurationHours(req.durationHours());
        booking.setTotalAmount(total);
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setOccasionType(req.occasionType());
        booking.setOccasionTitle(req.occasionTitle());
        booking.setSpecialNotes(req.specialNotes());

        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @PatchMapping("/bookings/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(Authentication auth, @PathVariable Long id) {
        User user = getFamilyUser(auth);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        if (!booking.getFamilyUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not have access to this booking");
        }
        if (booking.getStatus() == Booking.BookingStatus.COMPLETED || booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new IllegalStateException("This booking cannot be cancelled");
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @PostMapping("/bookings/{id}/review")
    public ResponseEntity<Booking> submitReview(Authentication auth, @PathVariable Long id, @Valid @RequestBody ReviewRequest req) {
        User user = getFamilyUser(auth);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        if (!booking.getFamilyUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not have access to this booking");
        }
        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            throw new IllegalStateException("You can only review completed visits");
        }
        int clampedRating = Math.max(1, Math.min(5, req.rating()));
        booking.setRatingGiven(clampedRating);
        booking.setReviewComment(req.comment());
        booking = bookingRepository.save(booking);

        // Update companion average rating
        CompanionProfile companion = booking.getCompanionProfile();
        int prevTotal = companion.getTotalReviews() != null ? companion.getTotalReviews() : 0;
        double prevAvg = companion.getRating() != null ? companion.getRating() : 5.0;
        double newAvg = ((prevAvg * prevTotal) + clampedRating) / (prevTotal + 1);
        companion.setTotalReviews(prevTotal + 1);
        companion.setRating(Math.round(newAvg * 10.0) / 10.0);
        companionProfileRepository.save(companion);

        return ResponseEntity.ok(booking);
    }

    @GetMapping("/bookings/{id}/updates")
    public List<VisitUpdate> getVisitUpdates(Authentication auth, @PathVariable Long id) {
        User user = getFamilyUser(auth);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        if (!booking.getFamilyUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not have access to this booking");
        }
        return visitUpdateRepository.findByBookingIdOrderByCreatedAtDesc(id);
    }
}
