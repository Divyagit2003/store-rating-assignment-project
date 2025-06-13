package com.service;

import java.util.List;

import com.model.Rating;
import com.model.Store;
import com.model.User;

public interface RatingService {
	Rating submitRating(User user, Store store, int stars, String comment);

	List<Rating> getRatingsByStore(Store store);

	Rating getUserRatingForStore(User user, Store store);
}
