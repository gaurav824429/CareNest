package com.carenest.config;

import com.carenest.entity.*;
import com.carenest.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Runs at startup AFTER DataSeeder (Order 2) to reconcile existing MySQL records
 * with CareNest's Pune localization and introductory pricing structure without
 * wiping the database or overwriting valid admin pricing edits.
 */
@Component
@Order(2)
public class ServicePriceUpdater implements CommandLineRunner {

    private final ServiceCategoryRepository serviceRepo;
    private final UserRepository userRepo;
    private final CompanionProfileRepository companionRepo;
    private final ElderProfileRepository elderRepo;
    private final BookingRepository bookingRepo;

    public ServicePriceUpdater(ServiceCategoryRepository serviceRepo,
                               UserRepository userRepo,
                               CompanionProfileRepository companionRepo,
                               ElderProfileRepository elderRepo,
                               BookingRepository bookingRepo) {
        this.serviceRepo = serviceRepo;
        this.userRepo = userRepo;
        this.companionRepo = companionRepo;
        this.elderRepo = elderRepo;
        this.bookingRepo = bookingRepo;
    }

    private record ServiceSpec(
            String name, String durationLabel, int defaultHours,
            double regularPrice, double introPrice,
            String iconName, String description, boolean specialOccasion) {}

    @Override
    @Transactional
    public void run(String... args) {
        reconcileServices();
        reconcileUsersAndElders();
        reconcileCompanions();
        reconcileDemoBookings();
    }

    private void reconcileServices() {
        // 1. Merge any duplicate "companionship-2h" into "companionship-visits" if both exist
        Optional<ServiceCategory> legacyVisits = serviceRepo.findBySlug("companionship-visits");
        Optional<ServiceCategory> dup2h = serviceRepo.findBySlug("companionship-2h");
        if (legacyVisits.isPresent() && dup2h.isPresent()) {
            ServiceCategory primary = legacyVisits.get();
            ServiceCategory duplicate = dup2h.get();
            List<Booking> dupBookings = bookingRepo.findByServiceCategoryId(duplicate.getId());
            for (Booking b : dupBookings) {
                b.setServiceCategory(primary);
                bookingRepo.save(b);
            }
            serviceRepo.delete(duplicate);
        }

        Map<String, ServiceSpec> specs = new LinkedHashMap<>();
        specs.put("companionship-visits", new ServiceSpec(
                "Companionship Visits",
                "2 hours", 2,
                699.0, 499.0,
                "HeartHandshake",
                "Warm, unhurried visits filled with meaningful conversation, shared chai, board games, and genuine human connection.",
                false));

        specs.put("daily-assistance", new ServiceSpec(
                "Daily Assistance",
                "2 hours", 2,
                799.0, 599.0,
                "Sun",
                "Thoughtful help with morning routines, light home organisation, meal prep company, and smartphone/video-call guidance.",
                false));

        specs.put("walking-recreation", new ServiceSpec(
                "Walking & Recreational Activities",
                "90 minutes", 2,
                549.0, 399.0,
                "Footprints",
                "Gentle society or park strolls, light stretching, gardening together, and attending local cultural or senior club events.",
                false));

        specs.put("reading-conversation", new ServiceSpec(
                "Reading & Conversation",
                "90 minutes", 2,
                549.0, 399.0,
                "BookOpen",
                "Quiet afternoon sessions of reading aloud from favourite Marathi novels, newspapers, or poetry — plus gentle, enriching conversation.",
                false));

        specs.put("grocery-errands", new ServiceSpec(
                "Grocery & Everyday Errands",
                "Up to 2 hours", 2,
                649.0, 499.0,
                "ShoppingBag",
                "Accompanied or assisted trips to the local market, pharmacy pickups, bank/post office runs, and weekly household errands. Grocery, travel, and material expenses are charged separately.",
                false));

        specs.put("special-occasions", new ServiceSpec(
                "Birthday & Special Occasion Support",
                "Per event", 4,
                1999.0, 1499.0,
                "PartyPopper",
                "Making birthdays, anniversaries, and festivals unforgettable with flowers, sweets, photo sharing, and family video calls. Celebration materials and decoration costs are charged separately.",
                true));

        specs.put("companionship-4h", new ServiceSpec(
                "Extended Companionship",
                "4 hours", 4,
                1199.0, 899.0,
                "BookOpen",
                "Half-day attentive company including reading aloud, storytelling, lunch company, and unhurried afternoon conversation.",
                false));

        specs.put("weekly-companionship", new ServiceSpec(
                "Weekly Plan",
                "5 visits", 10,
                2999.0, 2199.0,
                "HeartHandshake",
                "Consistent weekday companionship plan (5 scheduled visits) so your parents look forward to a familiar, trusted friend every week.",
                false));

        specs.put("monthly-plan", new ServiceSpec(
                "Monthly Plan",
                "20 visits", 40,
                9999.0, 7999.0,
                "CalendarDays",
                "Our best-value plan for families who want daily companionship. 20 scheduled visits per month with one dedicated companion your parent knows and trusts.",
                false));

        for (Map.Entry<String, ServiceSpec> entry : specs.entrySet()) {
            String slug = entry.getKey();
            ServiceSpec spec = entry.getValue();

            ServiceCategory svc = serviceRepo.findBySlug(slug).orElseGet(ServiceCategory::new);
            boolean isNew = svc.getId() == null;
            boolean needsPriceFix = isNew
                    || svc.getRegularPrice() == null
                    || svc.getDurationLabel() == null
                    || svc.getDefaultDurationHours() == null
                    || svc.getEffectivePrice() < 100.0;
            boolean isLegacyTitle = !isNew && (
                    "Companionship (2 hours)".equals(svc.getName())
                            || "Grocery & Daily Errands".equals(svc.getName())
                            || "Special Occasion Assistance".equals(svc.getName())
                            || "Extended Companionship (4 hours)".equals(svc.getName())
                            || "Weekly Companionship (5 visits)".equals(svc.getName())
                            || "Monthly Plan (20 visits)".equals(svc.getName())
            );

            if (needsPriceFix || isLegacyTitle) {
                svc.setSlug(slug);
                svc.setName(spec.name());
                svc.setDurationLabel(spec.durationLabel());
                svc.setDefaultDurationHours(spec.defaultHours());
                svc.setRegularPrice(spec.regularPrice());
                svc.setIntroductoryPrice(spec.introPrice());
                svc.setPromotionalPricingEnabled(true);
                svc.setBaseHourlyRate(Math.round(spec.introPrice() / Math.max(1, spec.defaultHours()) * 100.0) / 100.0);
                svc.setIconName(spec.iconName());
                svc.setDescription(spec.description());
                svc.setSpecialOccasion(spec.specialOccasion());
                svc.setActive(true);
                serviceRepo.save(svc);
            }
        }
    }

    private void reconcileUsersAndElders() {
        userRepo.findByEmail("admin@carenest.com").ifPresent(u -> {
            if ("San Francisco".equalsIgnoreCase(u.getCity()) || "Elena Vance".equals(u.getFullName())) {
                u.setFullName("Aditi Kulkarni");
                u.setPhone("+91 98220 10001");
                u.setCity("Pune");
                userRepo.save(u);
            }
        });

        userRepo.findByEmail("ananya@carenest.com").ifPresent(u -> {
            if ("Seattle".equalsIgnoreCase(u.getCity()) || "Ananya Sharma".equals(u.getFullName())) {
                u.setFullName("Ananya Deshmukh");
                u.setPhone("+91 98220 45120");
                u.setCity("Kothrud, Pune");
                userRepo.save(u);
            }
        });

        userRepo.findByEmail("rahul@carenest.com").ifPresent(u -> {
            if ("Austin".equalsIgnoreCase(u.getCity()) || "Rahul Mehta".equals(u.getFullName())) {
                u.setFullName("Rahul Joshi");
                u.setPhone("+91 98230 77812");
                u.setCity("Baner, Pune");
                userRepo.save(u);
            }
        });

        for (ElderProfile e : elderRepo.findAll()) {
            if ("Seattle".equalsIgnoreCase(e.getCity())) {
                e.setCity("Kothrud, Pune");
                if ("Kamala Sharma".equals(e.getFullName())) e.setFullName("Kamala Deshmukh");
                if ("Raghav Sharma".equals(e.getFullName())) e.setFullName("Raghav Deshmukh");
                e.setAddress("Flat 302, Gulmohar Residency, Paud Road, Kothrud, Pune 411038");
                e.setEmergencyContactName("Ananya Deshmukh");
                e.setEmergencyContactPhone("+91 98220 45120");
                elderRepo.save(e);
            } else if ("Austin".equalsIgnoreCase(e.getCity()) || "Margaret Miller".equals(e.getFullName())) {
                e.setFullName("Sulabha Joshi");
                e.setCity("Baner, Pune");
                e.setAddress("14 Emerald Greens, Baner Road, Baner, Pune 411045");
                e.setLanguages("Marathi, Hindi, English");
                e.setEmergencyContactName("Rahul Joshi");
                e.setEmergencyContactPhone("+91 98230 77812");
                elderRepo.save(e);
            }
        }
    }

    private void reconcileCompanions() {
        updateCompanion("meera@carenest.com", "Meera Nair", "+91 98450 11223",
                "Kothrud, Pune", 200.0, "Marathi, Hindi, English",
                "With 15 years of teaching in Pune and 5 years of senior companionship, I love sharing Marathi & English stories, reading aloud, and turning quiet afternoons into joyful memories.");

        updateCompanion("arjun@carenest.com", "Arjun Kapoor", "+91 98201 33445",
                "Baner, Pune", 225.0, "Marathi, Hindi, English",
                "Patient, cheerful, and dependable across Baner, Wakad, and Kothrud. I help parents stay active with morning park walks, chess games, grocery runs, and WhatsApp video-call setup.");

        updateCompanion("priya@carenest.com", "Priya Menon", "+91 98112 77889",
                "Aundh, Pune", 250.0, "Marathi, Hindi, English",
                "Specializing in joyful milestones, bhajan/music sessions, and festive gatherings in Aundh, Viman Nagar, and Kharadi for elders whose children live away.");

        updateCompanion("david@carenest.com", "Rohan Gokhale", "+91 98901 55432",
                "Viman Nagar, Pune", 200.0, "Marathi, Hindi, English",
                "Organized, respectful, and deeply caring. Available across Viman Nagar, Kharadi, and Hadapsar for market errands, gentle walks, and relaxed afternoons.");

        updateCompanion("rohan@carenest.com", "Rohan Gokhale", "+91 98901 55432",
                "Viman Nagar, Pune", 200.0, "Marathi, Hindi, English", null);

        updateCompanion("sunita@carenest.com", "Sunita Deshmukh", "+91 97654 22110",
                "Bavdhan, Pune", 200.0, "Marathi, Hindi, English", null);
    }

    private void updateCompanion(String email, String fullName, String phone, String puneCity,
                                 double payoutRate, String languages, String bioIfNonPune) {
        userRepo.findByEmail(email).ifPresent(user -> {
            boolean nonPune = user.getCity() == null || !user.getCity().toLowerCase().contains("pune");
            if (nonPune || "David Alvarez".equals(user.getFullName())) {
                user.setFullName(fullName);
                user.setPhone(phone);
                user.setCity(puneCity);
                userRepo.save(user);
            }
            companionRepo.findByUserId(user.getId()).ifPresent(cp -> {
                boolean cpNonPune = cp.getCity() == null || !cp.getCity().toLowerCase().contains("pune") || "Pune".equalsIgnoreCase(cp.getCity());
                boolean rateOutdated = cp.getHourlyRate() == null || cp.getHourlyRate() < 100.0;
                if (cpNonPune || rateOutdated) {
                    cp.setCity(puneCity);
                    if (rateOutdated) cp.setHourlyRate(payoutRate);
                    cp.setLanguages(languages);
                    if (bioIfNonPune != null && cpNonPune) cp.setBio(bioIfNonPune);
                    if ("Bilingual Community Guide & Errand Companion".equals(cp.getHeadline())) {
                        cp.setHeadline("Friendly Errand Partner & Community Guide");
                    }
                    companionRepo.save(cp);
                }
            });
        });
    }

    private void reconcileDemoBookings() {
        for (Booking b : bookingRepo.findAll()) {
            // Only fix legacy USD demo bookings (totals < ₹100 like ₹50, ₹48, ₹75, ₹52)
            if (b.getTotalAmount() != null && b.getTotalAmount() < 100.0 && b.getServiceCategory() != null) {
                ServiceCategory svc = b.getServiceCategory();
                int defaultHours = svc.getDefaultDurationHours() != null && svc.getDefaultDurationHours() > 0
                        ? svc.getDefaultDurationHours() : 2;
                if (svc.isSpecialOccasion()) {
                    b.setDurationHours(defaultHours);
                    b.setTotalAmount(svc.getEffectivePrice());
                } else {
                    int hrs = b.getDurationHours() != null && b.getDurationHours() > 0 ? b.getDurationHours() : defaultHours;
                    double total = (hrs == defaultHours)
                            ? svc.getEffectivePrice()
                            : Math.round((svc.getEffectivePrice() / defaultHours) * hrs);
                    b.setTotalAmount(total);
                }
                bookingRepo.save(b);
            }
        }
    }
}
