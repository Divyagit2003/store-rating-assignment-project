package com.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.model.Rating;
import com.model.Store;
import com.model.User;

public interface RatingRepository extends JpaRepository<Rating, Long> {
	List<Rating> findByStore(Store store);

	Rating findByUserAndStore(User user, Store store);
}
