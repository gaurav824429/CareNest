package com.carenest.controller;

import com.carenest.entity.CompanionProfile;
import com.carenest.entity.ContactMessage;
import com.carenest.entity.ServiceCategory;
import com.carenest.repository.BookingRepository;
import com.carenest.repository.CompanionProfileRepository;
import com.carenest.repository.ContactMessageRepository;
import com.carenest.repository.ServiceCategoryRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PublicController {
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final CompanionProfileRepository companionProfileRepository;
    private final BookingRepository bookingRepository;
    private final ContactMessageRepository contactMessageRepository;

    public PublicController(ServiceCategoryRepository serviceCategoryRepository,
                            CompanionProfileRepository companionProfileRepository,
                            BookingRepository bookingRepository,
                            ContactMessageRepository contactMessageRepository) {
        this.serviceCategoryRepository = serviceCategoryRepository;
        this.companionProfileRepository = companionProfileRepository;
        this.bookingRepository = bookingRepository;
        this.contactMessageRepository = contactMessageRepository;
    }

    @GetMapping("/services")
    public List<ServiceCategory> getActiveServices() {
        return serviceCategoryRepository.findByActiveTrue();
    }

    @GetMapping("/companions")
    public List<CompanionProfile> getApprovedCompanions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) Double maxRate
    ) {
        List<CompanionProfile> approved = companionProfileRepository
                .findByApprovalStatus(CompanionProfile.ApprovalStatus.APPROVED);

        return approved.stream().filter(c -> {
            if (!c.getUser().isActive()) return false;
            if (search != null && !search.isBlank()) {
                String q = search.toLowerCase();
                boolean matches = (c.getUser().getFullName() != null && c.getUser().getFullName().toLowerCase().contains(q))
                        || (c.getHeadline() != null && c.getHeadline().toLowerCase().contains(q))
                        || (c.getSkills() != null && c.getSkills().toLowerCase().contains(q))
                        || (c.getBio() != null && c.getBio().toLowerCase().contains(q));
                if (!matches) return false;
            }
            if (city != null && !city.isBlank()) {
                if (c.getCity() == null || !c.getCity().toLowerCase().contains(city.toLowerCase())) return false;
            }
            if (language != null && !language.isBlank()) {
                if (c.getLanguages() == null || !c.getLanguages().toLowerCase().contains(language.toLowerCase())) return false;
            }
            if (skill != null && !skill.isBlank()) {
                if (c.getSkills() == null || !c.getSkills().toLowerCase().contains(skill.toLowerCase())) return false;
            }
            if (maxRate != null && c.getHourlyRate() != null && c.getHourlyRate() > maxRate) {
                return false;
            }
            return true;
        }).toList();
    }

    @GetMapping("/companions/{id}")
    public ResponseEntity<CompanionProfile> getCompanion(@PathVariable Long id) {
        CompanionProfile profile = companionProfileRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Companion not found"));
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/public/stats")
    public Map<String, Object> getPublicStats() {
        long companions = companionProfileRepository.countByApprovalStatus(CompanionProfile.ApprovalStatus.APPROVED);
        long bookings = bookingRepository.count();
        long services = serviceCategoryRepository.findByActiveTrue().size();
        return Map.of(
                "approvedCompanions", companions,
                "totalBookings", bookings,
                "serviceCategories", services
        );
    }

    @PostMapping("/public/contact")
    public ResponseEntity<Map<String, String>> submitContact(@Valid @RequestBody ContactMessage msg) {
        contactMessageRepository.save(msg);
        return ResponseEntity.ok(Map.of("message", "Thank you for reaching out! Our CareNest team will respond within 24 hours."));
    }
}
