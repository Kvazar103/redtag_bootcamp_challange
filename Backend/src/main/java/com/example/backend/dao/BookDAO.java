package com.example.backend.dao;

import com.example.backend.models.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookDAO extends JpaRepository<Book,Integer> {
    Book findBookById(Integer id);
}
