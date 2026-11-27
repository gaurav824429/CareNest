package com.carenest.config;

import com.carenest.entity.*;
import com.carenest.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@Order(1)
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final ElderProfileRepository elderProfileRepository;
    private final CompanionProfileRepository companionProfileRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final BookingRepository bookingRepository;
    private final VisitUpdateRepository visitUpdateRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      ElderProfileRepository elderProfileRepository,
                      CompanionProfileRepository companionProfileRepository,
                      ServiceCategoryRepository serviceCategoryRepository,
                      BookingRepository bookingRepository,
                      VisitUpdateRepository visitUpdateRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.elderProfileRepository = elderProfileRepository;
        this.companionProfileRepository = companionProfileRepository;
        this.serviceCategoryRepository = serviceCategoryRepository;
        this.bookingRepository = bookingRepository;
        this.visitUpdateRepository = visitUpdateRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Pune Launch Service Categories (Introductory Launch Prices)
        ServiceCategory s1 = createService("Companionship Visits", "companionship-visits",
                "Warm, unhurried visits filled with meaningful conversation, shared chai, board games, and genuine human connection.",
                "HeartHandshake", "2 hours", 2, 699.0, 499.0, true, false);
        ServiceCategory s2 = createService("Daily Assistance", "daily-assistance",
                "Thoughtful help with morning routines, light home organisation, meal prep company, and smartphone/video-call guidance.",
                "Sun", "2 hours", 2, 799.0, 599.0, true, false);
        ServiceCategory s3 = createService("Walking & Recreational Activities", "walking-recreation",
                "Gentle society or park strolls, light stretching, gardening together, and attending local cultural or senior club events.",
                "Footprints", "90 minutes", 2, 549.0, 399.0, true, false);
        ServiceCategory s4 = createService("Reading & Conversation", "reading-conversation",
                "Quiet afternoon sessions of reading aloud from favourite Marathi novels, newspapers, or poetry — plus gentle, enriching conversation.",
                "BookOpen", "90 minutes", 2, 549.0, 399.0, true, false);
        ServiceCategory s5 = createService("Grocery & Everyday Errands", "grocery-errands",
                "Accompanied or assisted trips to the local market, pharmacy pickups, bank/post office runs, and weekly household errands. Grocery, travel, and material expenses are charged separately.",
                "ShoppingBag", "Up to 2 hours", 2, 649.0, 499.0, true, false);
        ServiceCategory s6 = createService("Birthday & Special Occasion Support", "special-occasions",
                "Making birthdays, anniversaries, and festivals unforgettable with flowers, sweets, photo sharing, and family video calls. Celebration materials and decoration costs are charged separately.",
                "PartyPopper", "Per event", 4, 1999.0, 1499.0, true, true);
        ServiceCategory s7 = createService("Extended Companionship", "companionship-4h",
                "Half-day attentive company including reading aloud, storytelling, lunch company, and unhurried afternoon conversation.",
                "BookOpen", "4 hours", 4, 1199.0, 899.0, true, false);
        ServiceCategory s8 = createService("Weekly Plan", "weekly-companionship",
                "Consistent weekday companionship plan (5 scheduled visits) so your parents look forward to a familiar, trusted friend every week.",
                "HeartHandshake", "5 visits", 10, 2999.0, 2199.0, true, false);
        ServiceCategory s9 = createService("Monthly Plan", "monthly-plan",
                "Our best-value plan for families who want daily companionship. 20 scheduled visits per month with one dedicated companion your parent knows and trusts.",
                "CalendarDays", "20 visits", 40, 9999.0, 7999.0, true, false);
        serviceCategoryRepository.saveAll(List.of(s1, s2, s3, s4, s5, s6, s7, s8, s9));

        // 2. Admin User
        User admin = createUser("Aditi Kulkarni", "admin@carenest.com", "Admin@123", "+91 98220 10001", "Pune",
                Role.ADMIN, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80");
        userRepository.save(admin);

        // 3. Family Users
        User family1 = createUser("Ananya Deshmukh", "ananya@carenest.com", "Family@123", "+91 98220 45120", "Kothrud, Pune",
                Role.FAMILY, "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80");
        User family2 = createUser("Rahul Joshi", "rahul@carenest.com", "Family@123", "+91 98230 77812", "Baner, Pune",
                Role.FAMILY, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80");
        userRepository.saveAll(List.of(family1, family2));

        // 4. Elder Profiles (Pune Localities)
        ElderProfile elder1 = new ElderProfile();
        elder1.setFamilyUser(family1);
        elder1.setFullName("Kamala Deshmukh");
        elder1.setAge(74);
        elder1.setGender("Female");
        elder1.setRelationship("Mother");
        elder1.setCity("Kothrud, Pune");
        elder1.setAddress("Flat 302, Gulmohar Residency, Paud Road, Kothrud, Pune 411038");
        elder1.setLanguages("Marathi, Hindi, English");
        elder1.setHobbies("Classical Marathi abhangs, balcony gardening, crosswords, evening masala chai");
        elder1.setMobilityNotes("Walks comfortably with a cane for 20-30 minutes");
        elder1.setDietaryPreferences("Vegetarian, low sugar");
        elder1.setEmergencyContactName("Ananya Deshmukh");
        elder1.setEmergencyContactPhone("+91 98220 45120");
        elder1.setAvatarUrl("https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80");

        ElderProfile elder2 = new ElderProfile();
        elder2.setFamilyUser(family1);
        elder2.setFullName("Raghav Deshmukh");
        elder2.setAge(78);
        elder2.setGender("Male");
        elder2.setRelationship("Father");
        elder2.setCity("Kothrud, Pune");
        elder2.setAddress("Flat 302, Gulmohar Residency, Paud Road, Kothrud, Pune 411038");
        elder2.setLanguages("Marathi, Hindi, English");
        elder2.setHobbies("Chess, morning Sakal newspaper, history podcasts");
        elder2.setMobilityNotes("Independent indoors, prefers flat society paths outside");
        elder2.setDietaryPreferences("Vegetarian");
        elder2.setEmergencyContactName("Ananya Deshmukh");
        elder2.setEmergencyContactPhone("+91 98220 45120");
        elder2.setAvatarUrl("https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=400&q=80");

        ElderProfile elder3 = new ElderProfile();
        elder3.setFamilyUser(family2);
        elder3.setFullName("Sulabha Joshi");
        elder3.setAge(81);
        elder3.setGender("Female");
        elder3.setRelationship("Grandmother");
        elder3.setCity("Baner, Pune");
        elder3.setAddress("14 Emerald Greens, Baner Road, Baner, Pune 411045");
        elder3.setLanguages("Marathi, Hindi, English");
        elder3.setHobbies("Bhajan singing, knitting, audiobooks, evening veranda tea");
        elder3.setMobilityNotes("Uses a walker for longer outdoor strolls");
        elder3.setDietaryPreferences("Sattvic vegetarian");
        elder3.setEmergencyContactName("Rahul Joshi");
        elder3.setEmergencyContactPhone("+91 98230 77812");
        elder3.setAvatarUrl("https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80");
        elderProfileRepository.saveAll(List.of(elder1, elder2, elder3));

        // 5. Companion Users & Profiles (Pune Localities & Payout Rates)
        User cu1 = createUser("Meera Nair", "meera@carenest.com", "Companion@123", "+91 98450 11223", "Kothrud, Pune",
                Role.COMPANION, "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80");
        User cu2 = createUser("Arjun Kapoor", "arjun@carenest.com", "Companion@123", "+91 98201 33445", "Baner, Pune",
                Role.COMPANION, "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80");
        User cu3 = createUser("Priya Menon", "priya@carenest.com", "Companion@123", "+91 98112 77889", "Aundh, Pune",
                Role.COMPANION, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80");
        User cu4 = createUser("Rohan Gokhale", "rohan@carenest.com", "Companion@123", "+91 98901 55432", "Viman Nagar, Pune",
                Role.COMPANION, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80");
        User cu5 = createUser("Sunita Deshmukh", "sunita@carenest.com", "Companion@123", "+91 97654 22110", "Bavdhan, Pune",
                Role.COMPANION, "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=400&q=80");
        userRepository.saveAll(List.of(cu1, cu2, cu3, cu4, cu5));

        CompanionProfile cp1 = createCompanion(cu1, "Retired Literature Teacher & Warm Conversationalist",
                "With 15 years of teaching in Pune and 5 years of senior companionship, I love sharing Marathi & English stories, reading aloud, and turning quiet afternoons into joyful memories.",
                5, 200.0, "Kothrud, Pune", "Marathi, Hindi, English",
                "Reading, Conversation, Gardening, Birthday Celebrations, Chai & Storytelling",
                "Mon - Sat, 9:00 AM - 6:00 PM", CompanionProfile.ApprovalStatus.APPROVED, 4.9, 28, 42, true);

        CompanionProfile cp2 = createCompanion(cu2, "Gentle Walking Partner & Tech-Savvy Helper",
                "Patient, cheerful, and dependable across Baner, Wakad, and Kothrud. I help parents stay active with morning park walks, chess games, grocery runs, and WhatsApp video-call setup.",
                4, 225.0, "Baner, Pune", "Marathi, Hindi, English",
                "Walking, Chess, Grocery Errands, Tech Support, Daily Assistance",
                "Tue - Sun, 7:00 AM - 5:00 PM", CompanionProfile.ApprovalStatus.APPROVED, 4.8, 19, 31, true);

        CompanionProfile cp3 = createCompanion(cu3, "Celebration Planner & Creative Arts Companion",
                "Specializing in joyful milestones, bhajan/music sessions, and festive gatherings in Aundh, Viman Nagar, and Kharadi for elders whose children live away.",
                6, 250.0, "Aundh, Pune", "Marathi, Hindi, English",
                "Special Occasions, Music, Arts & Crafts, Companionship, Meal Company",
                "Flexible Weekdays & Weekends", CompanionProfile.ApprovalStatus.APPROVED, 5.0, 22, 35, true);

        CompanionProfile cp4 = createCompanion(cu4, "Friendly Errand Partner & Community Guide",
                "Organized, respectful, and deeply caring. Available across Viman Nagar, Kharadi, and Hadapsar for market errands, gentle walks, and relaxed afternoons.",
                3, 200.0, "Viman Nagar, Pune", "Marathi, Hindi, English",
                "Grocery Errands, Walking, Reading, Daily Assistance, Photography",
                "Mon - Fri, 8:00 AM - 4:00 PM", CompanionProfile.ApprovalStatus.APPROVED, 4.9, 14, 21, true);

        CompanionProfile cp5 = createCompanion(cu5, "Warm Homemaker & Cultural Storyteller",
                "Looking forward to joining CareNest to bring warmth, music, and thoughtful daily assistance to seniors in Bavdhan and Kothrud.",
                2, 200.0, "Bavdhan, Pune", "Marathi, Hindi, English",
                "Companionship, Reading, Light Cooking Company, Gardening",
                "Mon - Sat, 10:00 AM - 5:00 PM", CompanionProfile.ApprovalStatus.PENDING, 5.0, 0, 0, false);

        companionProfileRepository.saveAll(List.of(cp1, cp2, cp3, cp4, cp5));

        // 6. Bookings (Pune & INR)
        Booking b1 = new Booking();
        b1.setFamilyUser(family1);
        b1.setElderProfile(elder1);
        b1.setCompanionProfile(cp1);
        b1.setServiceCategory(s1);
        b1.setBookingDate(LocalDate.now().minusDays(4));
        b1.setStartTime(LocalTime.of(16, 0));
        b1.setDurationHours(2);
        b1.setTotalAmount(499.0);
        b1.setStatus(Booking.BookingStatus.COMPLETED);
        b1.setSpecialNotes("Aai loves P.L. Deshpande stories and evening masala chai.");
        b1.setVisitUpdateNote("We read two chapters of Batatyachi Chawl on the balcony and watered the mogra plants together. Kamala kaku was smiling the whole afternoon!");
        b1.setRatingGiven(5);
        b1.setReviewComment("Meera brought so much warmth to Aai's evening in Kothrud. Aai couldn't stop talking about her!");

        Booking b2 = new Booking();
        b2.setFamilyUser(family1);
        b2.setElderProfile(elder2);
        b2.setCompanionProfile(cp2);
        b2.setServiceCategory(s4);
        b2.setBookingDate(LocalDate.now().plusDays(2));
        b2.setStartTime(LocalTime.of(8, 30));
        b2.setDurationHours(2);
        b2.setTotalAmount(399.0);
        b2.setStatus(Booking.BookingStatus.CONFIRMED);
        b2.setSpecialNotes("Morning walk at Kamala Nehru Park followed by a game of chess.");
        b2.setVisitUpdateNote("Confirmed! Looking forward to our morning walk and chess match.");

        Booking b3 = new Booking();
        b3.setFamilyUser(family1);
        b3.setElderProfile(elder1);
        b3.setCompanionProfile(cp1);
        b3.setServiceCategory(s6);
        b3.setBookingDate(LocalDate.now().plusDays(7));
        b3.setStartTime(LocalTime.of(17, 0));
        b3.setDurationHours(4);
        b3.setTotalAmount(1499.0);
        b3.setStatus(Booking.BookingStatus.PENDING);
        b3.setOccasionType("Birthday");
        b3.setOccasionTitle("Aai's 75th Birthday Evening");
        b3.setSpecialNotes("Please bring fresh marigold & mogra garland and help set up our family Zoom call at 6:30 PM.");

        Booking b4 = new Booking();
        b4.setFamilyUser(family2);
        b4.setElderProfile(elder3);
        b4.setCompanionProfile(cp4);
        b4.setServiceCategory(s5);
        b4.setBookingDate(LocalDate.now().minusDays(2));
        b4.setStartTime(LocalTime.of(10, 30));
        b4.setDurationHours(2);
        b4.setTotalAmount(399.0);
        b4.setStatus(Booking.BookingStatus.COMPLETED);
        b4.setSpecialNotes("Weekly Baner farmers market visit and pharmacy pickup.");
        b4.setVisitUpdateNote("Picked up fresh Alphonso mangoes, vegetables, and knitting wool. Sulabha aaji was in great spirits!");

        bookingRepository.saveAll(List.of(b1, b2, b3, b4));

        // 7. Visit Updates
        VisitUpdate u1 = new VisitUpdate();
        u1.setBooking(b1);
        u1.setAuthorName(cu1.getFullName());
        u1.setMoodStatus("Joyful & Engaged");
        u1.setMessage("Arrived at 4:00 PM in Kothrud. Kamala kaku had fresh masala chai ready and we enjoyed reading Marathi stories together.");

        VisitUpdate u2 = new VisitUpdate();
        u2.setBooking(b1);
        u2.setAuthorName(cu1.getFullName());
        u2.setMoodStatus("Peaceful & Happy");
        u2.setMessage("Wrapped up with a gentle stroll on the terrace. She sends her love and blessings to you!");
        visitUpdateRepository.saveAll(List.of(u1, u2));
    }

    private ServiceCategory createService(String name, String slug, String desc, String icon,
                                          String durationLabel, int defaultHours,
                                          double regularPrice, double introPrice,
                                          boolean promoEnabled, boolean special) {
        ServiceCategory s = new ServiceCategory();
        s.setName(name);
        s.setSlug(slug);
        s.setDescription(desc);
        s.setIconName(icon);
        s.setDurationLabel(durationLabel);
        s.setDefaultDurationHours(defaultHours);
        s.setRegularPrice(regularPrice);
        s.setIntroductoryPrice(introPrice);
        s.setPromotionalPricingEnabled(promoEnabled);
        s.setBaseHourlyRate(Math.round((promoEnabled ? introPrice : regularPrice) / Math.max(1, defaultHours) * 100.0) / 100.0);
        s.setActive(true);
        s.setSpecialOccasion(special);
        return s;
    }

    private User createUser(String name, String email, String rawPass, String phone, String city, Role role, String avatar) {
        User u = new User();
        u.setFullName(name);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(rawPass));
        u.setPhone(phone);
        u.setCity(city);
        u.setRole(role);
        u.setAvatarUrl(avatar);
        u.setActive(true);
        return u;
    }

    private CompanionProfile createCompanion(User user, String headline, String bio, int exp, double rate,
                                             String city, String langs, String skills, String avail,
                                             CompanionProfile.ApprovalStatus status, double rating, int reviews,
                                             int visits, boolean verified) {
        CompanionProfile cp = new CompanionProfile();
        cp.setUser(user);
        cp.setHeadline(headline);
        cp.setBio(bio);
        cp.setExperienceYears(exp);
        cp.setHourlyRate(rate);
        cp.setCity(city);
        cp.setLanguages(langs);
        cp.setSkills(skills);
        cp.setAvailability(avail);
        cp.setApprovalStatus(status);
        cp.setRating(rating);
        cp.setTotalReviews(reviews);
        cp.setCompletedVisitsCount(visits);
        cp.setVerified(verified);
        return cp;
    }
}
