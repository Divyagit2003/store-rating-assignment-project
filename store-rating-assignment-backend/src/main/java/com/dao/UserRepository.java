package com.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.Role;
import com.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	User findByEmail(String email); // REQUIRED for loginUser() and getUserByEmail()

	// For search/filter features
	List<User> findByNameContainingIgnoreCase(String name);

	List<User> findByEmailContainingIgnoreCase(String email);

	List<User> findByAddressContainingIgnoreCase(String address);

	List<User> findByRole(Role role);
}
