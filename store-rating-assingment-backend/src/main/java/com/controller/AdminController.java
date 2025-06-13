package com.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.model.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dao.RatingRepository;
import com.dao.StoreRepository;
import com.dao.UserRepository;
import com.model.Role;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private StoreRepository storeRepository;

	@Autowired
	private RatingRepository ratingRepository;

	// Total Counts
	@GetMapping("/dashboard")
	public Map<String, Long> getDashboardCounts() {
		Map<String, Long> response = new HashMap<>();
		response.put("totalUsers", userRepository.count());
		response.put("totalStores", storeRepository.count());
		response.put("totalRatings", ratingRepository.count());
		return response;
	}

	// Get all users
	@GetMapping("/users")
	public List<Map<String, Object>> getAllUsersWithRatings() {
	    List<User> users = userRepository.findAll();

	    return users.stream().map(user -> {
	        Map<String, Object> map = new HashMap<>();
	        map.put("id", user.getId());
	        map.put("name", user.getName());
	        map.put("email", user.getEmail());
	        map.put("address", user.getAddress());
	        map.put("role", user.getRole().toString());

	        // ✅ If the user is a store owner, add their store rating
	        if (user.getRole() == Role.Owner) {
	            List<Store> stores = storeRepository.findByOwner(user);
	            if (!stores.isEmpty()) {
	                Store store = stores.get(0); // assuming one store per owner
	                map.put("averageRating", store.getAverageRating());
	            }
	        }

	        return map;
	    }).collect(Collectors.toList());
	}


	// Search users by name
	@GetMapping("/users/searchByName")
	public List<User> searchUsersByName(@RequestParam String name) {
		return userRepository.findByNameContainingIgnoreCase(name);
	}

	// Search users by email
	@GetMapping("/users/searchByEmail")
	public List<User> searchUsersByEmail(@RequestParam String email) {
		return userRepository.findByEmailContainingIgnoreCase(email);
	}

	// Search users by address
	@GetMapping("/users/searchByAddress")
	public List<User> searchUsersByAddress(@RequestParam String address) {
		return userRepository.findByAddressContainingIgnoreCase(address);
	}

	// Filter users by role
	@GetMapping("/users/filterByRole")
	public List<User> filterUsersByRole(@RequestParam Role role) {
		return userRepository.findByRole(role);
	}

	@GetMapping("/stores")
	public List<Store> getAllStores() {
		return storeRepository.findAll();
	}

	@GetMapping("/stores/searchByName")
	public List<Store> searchStoresByName(@RequestParam String name) {
		return storeRepository.findByNameContainingIgnoreCase(name);
	}

	@GetMapping("/stores/searchByAddress")
	public List<Store> searchStoresByAddress(@RequestParam String address) {
		return storeRepository.findByAddressContainingIgnoreCase(address);
	}
}
