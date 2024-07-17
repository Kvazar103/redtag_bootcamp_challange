package com.example.backend.controllers;

import com.example.backend.models.Author;
import com.example.backend.services.AuthorService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@AllArgsConstructor
@CrossOrigin("http://localhost:3000")
public class AuthorController {

    private AuthorService authorService;

    @GetMapping("/getAllAuthors")
    public ResponseEntity<List<Author>> getAllAuthors(){
        return authorService.getAllAuthors();
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<?> getAuthorById(@PathVariable Integer authorId){
        return authorService.getAuthorById(authorId);
    }

    @DeleteMapping("/deleteAuthor/{authorId}/{customerId}")
    public ResponseEntity<?> deleteAuthorById(@PathVariable Integer authorId,@PathVariable Integer customerId){
        return authorService.deleteAuthor(authorId, customerId);
    }

}