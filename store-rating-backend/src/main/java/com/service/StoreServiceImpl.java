package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dao.StoreRepository;
import com.model.Store;
import com.model.User;

@Service
public class StoreServiceImpl implements StoreService {

	@Autowired
	private StoreRepository storeRepo;

	@Override
	public Store addStore(Store store) {
		return storeRepo.save(store);
	}

	@Override
	public List<Store> getAllStores() {
		return storeRepo.findAll();
	}

	@Override
	public List<Store> searchByName(String name) {
		return storeRepo.findByNameContainingIgnoreCase(name);
	}

	@Override
	public List<Store> searchByAddress(String address) {
		return storeRepo.findByAddressContainingIgnoreCase(address);
	}

	@Override
	public Store getStoreByOwner(User owner) {
		return storeRepo.findByOwner(owner);
	}

}
