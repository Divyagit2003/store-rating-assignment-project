package com.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
	    public String loginUser(@RequestBody User user) {
	        User loggedInUser = userService.loginUser(user.getEmail(), user.getPassword());
	        if (loggedInUser != null) {
	            return "Login successful as " + loggedInUser.getRole();
	        }
	        return "Invalid credentials";
	    }

	    // Get all users
	    @GetMapping("/allUsers")
	    public List<User> getAllUsers() {
	        return userService.getAllUsers();
	    }
	}
