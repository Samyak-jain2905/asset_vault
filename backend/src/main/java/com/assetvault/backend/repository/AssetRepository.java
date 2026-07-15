package com.assetvault.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.assetvault.backend.model.Asset;
import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByUserId(Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT a FROM Asset a LEFT JOIN a.sharedUsers su WHERE a.user.id = :userId OR su.id = :userId")
    List<Asset> findByUserIdOrSharedUsersId(@org.springframework.data.repository.query.Param("userId") Long userId);

    List<Asset> findByCategoryId(Long categoryId);
}
