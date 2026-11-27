package com.carenest.repository;

import com.carenest.entity.ElderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ElderProfileRepository extends JpaRepository<ElderProfile, Long> {
    List<ElderProfile> findByFamilyUserIdOrderByCreatedAtDesc(Long familyUserId);
}
