package com.carenest.repository;

import com.carenest.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByFamilyUserIdOrderByBookingDateDescStartTimeDesc(Long familyUserId);
    List<Booking> findByCompanionProfileIdOrderByBookingDateDescStartTimeDesc(Long companionProfileId);
    List<Booking> findAllByOrderByCreatedAtDesc();
    List<Booking> findByServiceCategoryId(Long serviceCategoryId);
    long countByStatus(Booking.BookingStatus status);
}
