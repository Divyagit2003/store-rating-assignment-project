package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dao.RatingRepository;
import com.dao.StoreRepository;
import com.model.Rating;
import com.model.Store;
import com.model.User;

@Service
public class RatingServiceImpl implements RatingService {

	 @Autowired
	    private RatingRepository ratingRepository;

	    @Autowired
	    private StoreRepository storeRepository;

	    @Override
	    public Rating submitRating(User user, Store store, int stars, String comment) {
	        Rating existingRating = ratingRepository.findByUserAndStore(user, store);

	        if (existingRating != null) {
	            existingRating.setStars(stars);
	            existingRating.setComment(comment);
	        } else {
	            existingRating = new Rating();
	            existingRating.setUser(user);
	            existingRating.setStore(store);
	            existingRating.setStars(stars);
	            existingRating.setComment(comment);
	        }

	        Rating savedRating = ratingRepository.save(existingRating);

	        // Recalculate average rating
	        List<Rating> allRatings = ratingRepository.findByStore(store);
	        double avg = allRatings.stream()
	                               .mapToInt(Rating::getStars)
	                               .average()
	                               .orElse(0.0);

	        store.setAverageRating(avg);
	        storeRepository.save(store);

	        return savedRating;
	    }

	    @Override
	    public List<Rating> getRatingsByStore(Store store) {
	        return ratingRepository.findByStore(store);
	    }

	    @Override
	    public Rating getUserRatingForStore(User user, Store store) {
	        return ratingRepository.findByUserAndStore(user, store);
	    }
	}