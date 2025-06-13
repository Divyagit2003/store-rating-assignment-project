package com.service;

import java.util.List;

import com.model.User;

public interface UserService {
	User registerUser(User user);

	User loginUser(String email, String password);

	List<User> getAllUsers();

	User getUserByEmail(String email);
}
