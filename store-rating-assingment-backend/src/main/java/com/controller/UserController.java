package com.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model.User;
import com.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")

public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping("/registerUser")
	public User registerUser(@RequestBody User user) {
		return userService.registerUser(user);
	}

	// Login user
	@PostMapping("/loginUser")
	public ResponseEntity<?> loginUser(@RequestBody User user) {
		User existing = userService.loginUser(user.getEmail(), user.getPassword());
		if (existing != null) {
			Map<String, Object> response = new HashMap<>();
			response.put("id", existing.getId());
			response.put("name", existing.getName());
			response.put("email", existing.getEmail());
			response.put("role", existing.getRole().name()); // return enum as string
			return ResponseEntity.ok(response);
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
	}

	// Get all users
	@GetMapping("/allUsers")
	public List<User> getAllUsers() {
		return userService.getAllUsers();
	}
}
