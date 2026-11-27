package com.carenest.controller;

import com.carenest.dto.AuthDtos.*;
import com.carenest.entity.CompanionProfile;
import com.carenest.entity.Role;
import com.carenest.entity.User;
import com.carenest.repository.CompanionProfileRepository;
import com.carenest.repository.UserRepository;
import com.carenest.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final CompanionProfileRepository companionProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserRepository userRepository,
                          CompanionProfileRepository companionProfileRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.companionProfileRepository = companionProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.email().toLowerCase().trim())) {
            throw new IllegalArgumentException("An account with this email already exists");
        }
        if (req.role() == Role.ADMIN) {
            throw new IllegalArgumentException("Admin registration is not allowed publicly");
        }

        User user = new User();
        user.setFullName(req.fullName().trim());
        user.setEmail(req.email().toLowerCase().trim());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setPhone(req.phone());
        user.setCity(req.city());
        user.setRole(req.role());
        user.setActive(true);
        user = userRepository.save(user);

        if (req.role() == Role.COMPANION) {
            CompanionProfile profile = new CompanionProfile();
            profile.setUser(user);
            profile.setCity(req.city());
            profile.setHeadline("Warm & Empathetic Elder Companion");
            profile.setBio("Dedicated to bringing joy, meaningful conversation, and reliable daily support to seniors.");
            profile.setLanguages("English");
            profile.setSkills("Companionship, Reading, Walking");
            profile.setAvailability("Mon-Sat, 9:00 AM - 6:00 PM");
            profile.setApprovalStatus(CompanionProfile.ApprovalStatus.PENDING);
            companionProfileRepository.save(profile);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return ResponseEntity.ok(new AuthResponse(token, toUserInfo(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        String email = req.email().toLowerCase().trim();
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, req.password()));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!user.isActive()) {
            throw new IllegalStateException("Your account has been deactivated. Please contact support.");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return ResponseEntity.ok(new AuthResponse(token, toUserInfo(user)));
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfo> me(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(toUserInfo(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserInfo> updateProfile(Authentication auth, @Valid @RequestBody UserUpdateRequest req) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setFullName(req.fullName().trim());
        user.setPhone(req.phone());
        user.setCity(req.city());
        if (req.avatarUrl() != null && !req.avatarUrl().isBlank()) {
            user.setAvatarUrl(req.avatarUrl());
        }
        user = userRepository.save(user);
        return ResponseEntity.ok(toUserInfo(user));
    }

    public static UserInfo toUserInfo(User u) {
        return new UserInfo(u.getId(), u.getFullName(), u.getEmail(), u.getPhone(),
                u.getCity(), u.getAvatarUrl(), u.getRole(), u.isActive());
    }
}
