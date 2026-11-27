package com.carenest.repository;

import com.carenest.entity.VisitUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VisitUpdateRepository extends JpaRepository<VisitUpdate, Long> {
    List<VisitUpdate> findByBookingIdOrderByCreatedAtDesc(Long bookingId);
}
