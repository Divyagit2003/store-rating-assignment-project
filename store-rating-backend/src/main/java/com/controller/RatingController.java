package com.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

	// Submit or update rating
	@PostMapping("/submit")
	public Rating submitRating(@RequestBody RatingRequestDTO ratingRequest) {
	    User user = userRepository.findById(ratingRequest.getUserId()).orElse(null);
	    Store store = storeRepository.findById(ratingRequest.getStoreId()).orElse(null);

	    if (user == null || store == null)
	        return null;

	    return ratingService.submitRating(user, store, ratingRequest.getStars(), ratingRequest.getComment());
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
