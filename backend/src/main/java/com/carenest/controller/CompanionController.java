package com.carenest.controller;

import com.carenest.dto.BookingDtos.VisitUpdateRequest;
import com.carenest.entity.*;
import com.carenest.repository.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companion")
public class CompanionController {
    private final UserRepository userRepository;
    private final CompanionProfileRepository companionProfileRepository;
    private final BookingRepository bookingRepository;
    private final VisitUpdateRepository visitUpdateRepository;

    public CompanionController(UserRepository userRepository,
                               CompanionProfileRepository companionProfileRepository,
                               BookingRepository bookingRepository,
                               VisitUpdateRepository visitUpdateRepository) {
        this.userRepository = userRepository;
        this.companionProfileRepository = companionProfileRepository;
        this.bookingRepository = bookingRepository;
        this.visitUpdateRepository = visitUpdateRepository;
    }

    private CompanionProfile getCompanionProfile(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return companionProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Companion profile not found"));
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard(Authentication auth) {
        CompanionProfile profile = getCompanionProfile(auth);
        List<Booking> bookings = bookingRepository.findByCompanionProfileIdOrderByBookingDateDescStartTimeDesc(profile.getId());

        long pendingCount = bookings.stream().filter(b -> b.getStatus() == Booking.BookingStatus.PENDING).count();
        long upcomingCount = bookings.stream().filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED || b.getStatus() == Booking.BookingStatus.IN_PROGRESS).count();
        long completedCount = bookings.stream().filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED).count();
        double totalEarnings = bookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED && b.getTotalAmount() != null)
                .mapToDouble(Booking::getTotalAmount)
                .sum();

        return Map.of(
                "profile", profile,
                "pendingRequestsCount", pendingCount,
                "upcomingVisitsCount", upcomingCount,
                "completedVisitsCount", completedCount,
                "totalEarnings", totalEarnings,
                "recentBookings", bookings.stream().limit(6).toList()
        );
    }

    @GetMapping("/profile")
    public CompanionProfile getProfile(Authentication auth) {
        return getCompanionProfile(auth);
    }

    @PutMapping("/profile")
    public ResponseEntity<CompanionProfile> updateProfile(Authentication auth, @RequestBody CompanionProfile req) {
        CompanionProfile existing = getCompanionProfile(auth);
        existing.setHeadline(req.getHeadline());
        existing.setBio(req.getBio());
        existing.setExperienceYears(req.getExperienceYears());
        existing.setHourlyRate(req.getHourlyRate());
        existing.setCity(req.getCity());
        existing.setLanguages(req.getLanguages());
        existing.setSkills(req.getSkills());
        existing.setAvailability(req.getAvailability());
        return ResponseEntity.ok(companionProfileRepository.save(existing));
    }

    @GetMapping("/bookings")
    public List<Booking> getBookings(Authentication auth) {
        CompanionProfile profile = getCompanionProfile(auth);
        return bookingRepository.findByCompanionProfileIdOrderByBookingDateDescStartTimeDesc(profile.getId());
    }

    @PatchMapping("/bookings/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(Authentication auth,
                                                       @PathVariable Long id,
                                                       @RequestBody Map<String, String> body) {
        CompanionProfile profile = getCompanionProfile(auth);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        if (!booking.getCompanionProfile().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("You do not have access to this booking");
        }

        Booking.BookingStatus newStatus = Booking.BookingStatus.valueOf(body.get("status").toUpperCase());
        booking.setStatus(newStatus);
        if (body.containsKey("visitUpdateNote") && body.get("visitUpdateNote") != null) {
            booking.setVisitUpdateNote(body.get("visitUpdateNote"));
        }

        if (newStatus == Booking.BookingStatus.COMPLETED) {
            int current = profile.getCompletedVisitsCount() != null ? profile.getCompletedVisitsCount() : 0;
            profile.setCompletedVisitsCount(current + 1);
            companionProfileRepository.save(profile);
        }

        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @PostMapping("/bookings/{id}/updates")
    public ResponseEntity<VisitUpdate> addVisitUpdate(Authentication auth,
                                                      @PathVariable Long id,
                                                      @Valid @RequestBody VisitUpdateRequest req) {
        CompanionProfile profile = getCompanionProfile(auth);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        if (!booking.getCompanionProfile().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("You do not have access to this booking");
        }

        VisitUpdate update = new VisitUpdate();
        update.setBooking(booking);
        update.setAuthorName(profile.getUser().getFullName());
        update.setMoodStatus(req.moodStatus() != null ? req.moodStatus() : "Joyful & Engaged");
        update.setMessage(req.message());

        booking.setVisitUpdateNote(req.message());
        bookingRepository.save(booking);

        return ResponseEntity.ok(visitUpdateRepository.save(update));
    }

    @GetMapping("/bookings/{id}/updates")
    public List<VisitUpdate> getVisitUpdates(Authentication auth, @PathVariable Long id) {
        CompanionProfile profile = getCompanionProfile(auth);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        if (!booking.getCompanionProfile().getId().equals(profile.getId())) {
            throw new IllegalArgumentException("You do not have access to this booking");
        }
        return visitUpdateRepository.findByBookingIdOrderByCreatedAtDesc(id);
    }
}
