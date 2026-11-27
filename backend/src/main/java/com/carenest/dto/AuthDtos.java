package com.carenest.dto;

import com.carenest.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AuthDtos {
    public record RegisterRequest(
            @NotBlank(message = "Full name is required") String fullName,
            @NotBlank(message = "Email is required") @Email(message = "Valid email is required") String email,
            @NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters") String password,
            String phone,
            String city,
            @NotNull(message = "Role is required") Role role
    ) {}

    public record LoginRequest(
            @NotBlank(message = "Email is required") @Email String email,
            @NotBlank(message = "Password is required") String password
    ) {}

    public record UserInfo(
            Long id,
            String fullName,
            String email,
            String phone,
            String city,
            String avatarUrl,
            Role role,
            boolean active
    ) {}

    public record AuthResponse(
            String token,
            UserInfo user
    ) {}

    public record UserUpdateRequest(
            @NotBlank(message = "Full name is required") String fullName,
            String phone,
            String city,
            String avatarUrl
    ) {}
}
