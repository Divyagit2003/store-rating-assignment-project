package com.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.Store;
import com.model.User;

public interface StoreRepository extends JpaRepository<Store, Long> {
	Store findByOwner(User owner);

	List<Store> findByNameContainingIgnoreCase(String name);

	List<Store> findByAddressContainingIgnoreCase(String address);

}
