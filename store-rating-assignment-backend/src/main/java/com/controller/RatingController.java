package com.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.dao.RatingRepository;
import com.dao.StoreRepository;
import com.dao.UserRepository;
import com.model.Rating;
import com.model.RatingRequestDTO;
import com.model.Store;
import com.model.User;
import com.service.RatingService;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@CrossOrigin(origins = "http://localhost:3000")
public class RatingController {

	@Autowired
	private RatingService ratingService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private StoreRepository storeRepository;
	
	@Autowired RatingRepository ratingRepository;

	// Submit or update rating
	@PostMapping("/submit")
	public ResponseEntity<?> submitRating(@RequestBody RatingRequestDTO dto) {
	    try {
	        User user = userRepository.findById(dto.getUserId())
	            .orElseThrow(() -> new RuntimeException("User not found"));
	        Store store = storeRepository.findById(dto.getStoreId())
	            .orElseThrow(() -> new RuntimeException("Store not found"));

	        Rating rating = new Rating();
	        rating.setUser(user);
	        rating.setStore(store);
	        rating.setStars(dto.getStars());
	        rating.setComment(dto.getComment());

	        ratingRepository.save(rating);
	        return ResponseEntity.ok("Rating saved!");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
	    }
	}


	// Get ratings for a store
	@GetMapping("/store/{storeId}")
	public List<Rating> getRatingsForStore(@PathVariable Long storeId) {
		Store store = storeRepository.findById(storeId).orElse(null);
		return ratingService.getRatingsByStore(store);
	}

	// Get user rating for a store
	@GetMapping("/user-rating")
	public Rating getUserRating(@RequestParam Long userId, @RequestParam Long storeId) {

		User user = userRepository.findById(userId).orElse(null);
		Store store = storeRepository.findById(storeId).orElse(null);

		return ratingService.getUserRatingForStore(user, store);
	}
}
