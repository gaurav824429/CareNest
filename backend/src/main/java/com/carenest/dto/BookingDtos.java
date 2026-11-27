package com.carenest.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class BookingDtos {
    public record CreateBookingRequest(
            @NotNull(message = "Elder profile is required") Long elderProfileId,
            @NotNull(message = "Companion is required") Long companionProfileId,
            @NotNull(message = "Service category is required") Long serviceCategoryId,
            @NotNull(message = "Booking date is required") LocalDate bookingDate,
            @NotNull(message = "Start time is required") LocalTime startTime,
            @NotNull @Min(1) Integer durationHours,
            String occasionType,
            String occasionTitle,
            String specialNotes
    ) {}

    public record VisitUpdateRequest(
            @NotBlank(message = "Update message is required") String message,
            String moodStatus
    ) {}

    public record ReviewRequest(
            @NotNull @Min(1) Integer rating,
            String comment
    ) {}
}
