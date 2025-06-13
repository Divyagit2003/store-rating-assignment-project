package com.service;

import java.util.List;

import com.model.Store;
import com.model.User;

public interface StoreService {

	Store addStore(Store store);

	List<Store> getAllStores();

	List<Store> searchByName(String name);

	List<Store> searchByAddress(String address);

	Store getStoreByOwner(User owner);
}
