package com.example.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.Author;

public interface AuthorDAO extends JpaRepository<Author,Integer>{
    Author findAuthorById(Integer Id);
    
} 
