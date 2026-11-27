package com.carenest.repository;

import com.carenest.entity.CompanionProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CompanionProfileRepository extends JpaRepository<CompanionProfile, Long> {
    Optional<CompanionProfile> findByUserId(Long userId);
    List<CompanionProfile> findByApprovalStatus(CompanionProfile.ApprovalStatus status);
    long countByApprovalStatus(CompanionProfile.ApprovalStatus status);
}
