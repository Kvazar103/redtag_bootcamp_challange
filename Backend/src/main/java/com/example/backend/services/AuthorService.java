package com.example.backend.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import com.example.backend.dao.AuthorDAO;
import com.example.backend.dao.CustomerDAO;
import com.example.backend.models.Author;
import com.example.backend.models.Book;
import com.example.backend.models.Customer;

import java.util.*;

import lombok.*;

@Service
@Validated
@AllArgsConstructor
public class AuthorService {

    private AuthorDAO authorDAO;
    private CustomerDAO customerDAO;

    public ResponseEntity<?> getAuthorById(Integer id){
        Author author=authorDAO.findAuthorById(id);
        if(author!=null){
            return new ResponseEntity<>(author,HttpStatus.OK);
        }else{
            return new ResponseEntity<>("no such author",HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<List<Author>> getAllAuthors(){
        return new ResponseEntity<>(authorDAO.findAll(),HttpStatus.OK);
    }

    public ResponseEntity<?> deleteAuthor(Integer authorId, Integer customerId) {
        Author author = authorDAO.findAuthorById(authorId);
        List<Book> author_books = author.getAuthor_books();
        Customer customer = customerDAO.findCustomerById(customerId);
        List<Book> customerBooks = customer.getBooks();
    
        Iterator<Book> customerBooksIterator = customerBooks.iterator();
        while (customerBooksIterator.hasNext()) {
            Book bookInCustomer = customerBooksIterator.next();
            for (Book book : author_books) {
                if (Integer.valueOf(book.getId()).equals(Integer.valueOf(bookInCustomer.getId()))) {
                    // Використовуємо ітератор для видалення
                    customerBooksIterator.remove();
                    break;
                }
            }
        }
    
        // Видаляємо автора після видалення всіх книг з customerBooks
        authorDAO.delete(author);
        return new ResponseEntity<>("Deleted", HttpStatus.OK);
    }
    
    
}