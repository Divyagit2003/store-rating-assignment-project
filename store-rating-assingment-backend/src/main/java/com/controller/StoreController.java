package com.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dao.RatingRepository;
import com.dao.StoreRepository;
import com.dao.UserRepository;
import com.model.Rating;
import com.model.Role;
import com.model.Store;
import com.model.User;
import com.service.StoreService;

@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = "http://localhost:3000")
public class StoreController {

	@Autowired
	private StoreService storeService;
	@Autowired
	private UserRepository userRepo;

	@Autowired
	private StoreRepository storeRepo;

	@Autowired
	private RatingRepository ratingRepo;

	// Add new store (Admin functionality)
	@PostMapping("/addStore")
	public Store addStore(@RequestBody Map<String, Object> storeData) {
		Store store = new Store();
		store.setName((String) storeData.get("name"));
		store.setEmail((String) storeData.get("email"));
		store.setAddress((String) storeData.get("address"));

		Long ownerId = Long.valueOf((Integer) storeData.get("ownerId")); // make sure ownerId is sent
		User owner = userRepo.findById(ownerId).orElse(null);
		if (owner != null) {
			store.setOwner(owner); // ✅ Set the owner properly
		}

		return storeRepo.save(store);
	}

	// Get all stores
	@GetMapping("/allStores")
	public List<Store> getAllStores() {
		return storeService.getAllStores();
	}

	// Search by name
	@GetMapping("/searchStoreByName")
	public List<Store> searchByName(@RequestParam String name) {
		return storeService.searchByName(name);
	}

	// Search by address
	@GetMapping("/searchStoreByAddress")
	public List<Store> searchByAddress(@RequestParam String address) {
		return storeService.searchByAddress(address);
	}

	@GetMapping("/ownerRatings")
	public ResponseEntity<?> getOwnerRatings(@RequestParam String ownerEmail) {
		User owner = userRepo.findByEmail(ownerEmail);
		if (owner == null || !owner.getRole().equals(Role.Owner)) {
			return ResponseEntity.badRequest().body("Invalid owner");
		}

		List<Store> stores = storeRepo.findByOwner(owner);
		if (stores.isEmpty()) {
			return ResponseEntity.badRequest().body("No stores found for this owner.");
		}

		// Use the first store (or loop over all stores if needed)
		Store store = stores.get(0); // picking Cafe Delight (id = 1)

		List<Rating> ratings = ratingRepo.findByStore(store);

		List<Map<String, Object>> userRatings = ratings.stream().map(r -> {
			Map<String, Object> map = new HashMap<>();
			map.put("id", r.getId());
			map.put("userName", r.getUser().getName());
			map.put("comment", r.getComment());
			map.put("stars", r.getStars());
			return map;
		}).collect(Collectors.toList());

		Map<String, Object> response = new HashMap<>();
		response.put("storeName", store.getName());
		response.put("averageRating", store.getAverageRating());
		response.put("ratings", userRatings);

		return ResponseEntity.ok(response);
	}

}