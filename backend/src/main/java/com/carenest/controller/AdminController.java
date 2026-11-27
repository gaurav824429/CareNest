package com.carenest.controller;

import com.carenest.entity.*;
import com.carenest.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepository;
    private final CompanionProfileRepository companionProfileRepository;
    private final BookingRepository bookingRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final ElderProfileRepository elderProfileRepository;

    public AdminController(UserRepository userRepository,
                           CompanionProfileRepository companionProfileRepository,
                           BookingRepository bookingRepository,
                           ServiceCategoryRepository serviceCategoryRepository,
                           ElderProfileRepository elderProfileRepository) {
        this.userRepository = userRepository;
        this.companionProfileRepository = companionProfileRepository;
        this.bookingRepository = bookingRepository;
        this.serviceCategoryRepository = serviceCategoryRepository;
        this.elderProfileRepository = elderProfileRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        long totalFamilies = userRepository.countByRole(Role.FAMILY);
        long totalCompanions = userRepository.countByRole(Role.COMPANION);
        long pendingCompanions = companionProfileRepository.countByApprovalStatus(CompanionProfile.ApprovalStatus.PENDING);
        long totalElders = elderProfileRepository.count();
        long totalBookings = bookingRepository.count();
        long completedBookings = bookingRepository.countByStatus(Booking.BookingStatus.COMPLETED);
        long pendingBookings = bookingRepository.countByStatus(Booking.BookingStatus.PENDING);
        long confirmedBookings = bookingRepository.countByStatus(Booking.BookingStatus.CONFIRMED);

        List<Booking> allBookings = bookingRepository.findAllByOrderByCreatedAtDesc();
        double totalPlatformValue = allBookings.stream()
                .filter(b -> b.getStatus() == Booking.BookingStatus.COMPLETED && b.getTotalAmount() != null)
                .mapToDouble(Booking::getTotalAmount)
                .sum();

        return Map.of(
                "totalFamilies", totalFamilies,
                "totalCompanions", totalCompanions,
                "pendingCompanions", pendingCompanions,
                "totalElders", totalElders,
                "totalBookings", totalBookings,
                "completedBookings", completedBookings,
                "pendingBookings", pendingBookings,
                "confirmedBookings", confirmedBookings,
                "totalPlatformValue", totalPlatformValue,
                "recentBookings", allBookings.stream().limit(6).toList()
        );
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PatchMapping("/users/{id}/toggle-active")
    public ResponseEntity<User> toggleUserActive(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user.getRole() == Role.ADMIN) {
            throw new IllegalStateException("Cannot deactivate admin accounts");
        }
        user.setActive(!user.isActive());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/companions")
    public List<CompanionProfile> getAllCompanions() {
        return companionProfileRepository.findAll();
    }

    @PatchMapping("/companions/{id}/approval")
    public ResponseEntity<CompanionProfile> updateCompanionApproval(@PathVariable Long id,
                                                                    @RequestBody Map<String, String> body) {
        CompanionProfile profile = companionProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Companion profile not found"));
        CompanionProfile.ApprovalStatus status = CompanionProfile.ApprovalStatus.valueOf(body.get("status").toUpperCase());
        profile.setApprovalStatus(status);
        profile.setVerified(status == CompanionProfile.ApprovalStatus.APPROVED);
        return ResponseEntity.ok(companionProfileRepository.save(profile));
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    @PatchMapping("/bookings/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id,
                                                       @RequestBody Map<String, String> body) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.valueOf(body.get("status").toUpperCase()));
        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @GetMapping("/services")
    public List<ServiceCategory> getAllServices() {
        return serviceCategoryRepository.findAll();
    }

    @PostMapping("/services")
    public ResponseEntity<ServiceCategory> createService(@RequestBody ServiceCategory req) {
        if (req.getName() == null || req.getName().isBlank()) {
            throw new IllegalArgumentException("Service name is required");
        }
        validateServicePricing(req);
        req.setId(null);
        if (req.getSlug() == null || req.getSlug().isBlank()) {
            req.setSlug(req.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        if (req.getDefaultDurationHours() == null || req.getDefaultDurationHours() < 1) {
            req.setDefaultDurationHours(2);
        }
        req.setBaseHourlyRate(Math.round(req.getEffectivePrice() / Math.max(1, req.getDefaultDurationHours()) * 100.0) / 100.0);
        return ResponseEntity.ok(serviceCategoryRepository.save(req));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<ServiceCategory> updateService(@PathVariable Long id, @RequestBody ServiceCategory req) {
        ServiceCategory existing = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service category not found"));
        if (req.getName() == null || req.getName().isBlank()) {
            throw new IllegalArgumentException("Service name is required");
        }
        validateServicePricing(req);
        existing.setName(req.getName().trim());
        existing.setDescription(req.getDescription());
        existing.setIconName(req.getIconName());
        existing.setDurationLabel(req.getDurationLabel() != null && !req.getDurationLabel().isBlank()
                ? req.getDurationLabel() : existing.getDurationLabel());
        existing.setDefaultDurationHours(req.getDefaultDurationHours() != null && req.getDefaultDurationHours() >= 1
                ? req.getDefaultDurationHours() : existing.getDefaultDurationHours());
        existing.setRegularPrice(req.getRegularPrice());
        existing.setIntroductoryPrice(req.getIntroductoryPrice());
        existing.setPromotionalPricingEnabled(req.isPromotionalPricingEnabled());
        existing.setBaseHourlyRate(Math.round(existing.getEffectivePrice() / Math.max(1, existing.getDefaultDurationHours()) * 100.0) / 100.0);
        existing.setActive(req.isActive());
        existing.setSpecialOccasion(req.isSpecialOccasion());
        return ResponseEntity.ok(serviceCategoryRepository.save(existing));
    }

    private void validateServicePricing(ServiceCategory req) {
        if (req.getRegularPrice() == null || req.getRegularPrice() <= 0) {
            throw new IllegalArgumentException("Regular price must be greater than ₹0");
        }
        if (req.getIntroductoryPrice() != null && req.getIntroductoryPrice() <= 0) {
            throw new IllegalArgumentException("Introductory price must be greater than ₹0");
        }
        if (req.isPromotionalPricingEnabled() && (req.getIntroductoryPrice() == null || req.getIntroductoryPrice() <= 0)) {
            throw new IllegalArgumentException("Please provide a valid introductory price when promotional pricing is enabled");
        }
        if (req.getIntroductoryPrice() != null && req.getIntroductoryPrice() > req.getRegularPrice()) {
            throw new IllegalArgumentException("Introductory price cannot exceed regular price");
        }
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Map<String, String>> deleteService(@PathVariable Long id) {
        ServiceCategory existing = serviceCategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service category not found"));
        serviceCategoryRepository.delete(existing);
        return ResponseEntity.ok(Map.of("message", "Service category deleted"));
    }
}
