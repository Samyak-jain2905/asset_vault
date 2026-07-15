package com.assetvault.backend.repository;

import com.assetvault.backend.model.RepairHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepairHistoryRepository extends JpaRepository<RepairHistory, Long> {
    List<RepairHistory> findByAssetId(Long assetId);
}
