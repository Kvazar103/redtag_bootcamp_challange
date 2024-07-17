package com.example.backend.controllers;

import com.example.backend.models.Book;
import com.example.backend.services.BookService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@AllArgsConstructor
@CrossOrigin("http://localhost:3000")
public class BookController {
    private BookService bookService;
    //private CustomerService customerService;
    
    @PatchMapping("/{bookId}/updateBook")
    public ResponseEntity<?> updateBook(@PathVariable Integer bookId, @RequestParam("book") String book){
        return bookService.updateBook(bookId, book);
    }

    @DeleteMapping("/customer/{customerId}/book/{bookIdToDelete}/author/{authorId}")
    public ResponseEntity<?> deleteBook(@PathVariable Integer customerId,@PathVariable Integer bookIdToDelete,@PathVariable Integer authorId){
        return bookService.deleteBook(customerId, bookIdToDelete,authorId);
    }
    
    @PostMapping("/{bookId}/addBook")
    public ResponseEntity<?> addBook(@PathVariable Integer bookId,@RequestParam("body") String book,@RequestParam(value = "author_id",required = false) Integer authorId,@RequestParam(value="author",required = false) String new_author){
        return bookService.addBook(bookId, book,authorId,new_author);
    }

    @GetMapping("/{bookId}/getBook")
    public ResponseEntity<?> getBook(@PathVariable Integer bookId) {
        return bookService.getBook(bookId);
    }

    @GetMapping("/getAllBooks")
    public ResponseEntity<List<Map<Integer,Book>>>getAllBooks() {
        return bookService.getAllBooks();
    }
}
