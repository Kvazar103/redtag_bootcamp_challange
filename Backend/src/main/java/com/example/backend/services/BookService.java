package com.example.backend.services;

import com.example.backend.dao.AuthorDAO;
import com.example.backend.dao.BookDAO;
import com.example.backend.dao.CustomerDAO;
import com.example.backend.models.Author;
import com.example.backend.models.Book;
import com.example.backend.models.Customer;
import com.example.backend.models.dto.AuthorDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.*;
import lombok.AllArgsConstructor;
import org.hibernate.validator.messageinterpolation.ParameterMessageInterpolator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
@Validated
@AllArgsConstructor
public class BookService {
 @Autowired
    private BookDAO bookDAO;
    private CustomerDAO customerDAO;
    private AuthorDAO authorDAO;

    public List<String> validateBook(@Valid Book book){
        ValidatorFactory factory = Validation.byDefaultProvider()
                .configure()
                .messageInterpolator((MessageInterpolator) new ParameterMessageInterpolator())
                .buildValidatorFactory();
        jakarta.validation.Validator validator = factory.getValidator();
        Set<ConstraintViolation<Book>> violations = validator.validate(book);

        if (!violations.isEmpty()) {
            // Обробка помилок валідації
            // Поверніть відповідну відповідь або викличте виключення
            System.out.println("errors");
            System.out.println(violations);
            List<String> messagesErrorList = new ArrayList<>();

            for (ConstraintViolation<Book> violation : violations) {
                String propertyPath = violation.getPropertyPath().toString();
                String message = violation.getMessage();
                System.out.println("Validation error: " + propertyPath + " - " + message);
                messagesErrorList.add(message);
            }
            return messagesErrorList;
        } else {
            List<String> noError = new ArrayList<>();
            noError.add("noErrors");
            System.out.println("noErrors");
            return noError;
        }
    }

    public ResponseEntity<?> updateBook(Integer bookId, String book){
        Book bookToUpdate=bookDAO.findBookById(bookId);
        SimpleDateFormat formater = new SimpleDateFormat("dd.MM.yyyy");

        ObjectMapper mapper=new ObjectMapper();
        mapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
        if(bookToUpdate!=null){
            try {
                Book updatedBookData=mapper.readValue(book,Book.class);
                bookToUpdate.setDetails(updatedBookData.getDetails());
                bookToUpdate.setGenre(updatedBookData.getGenre());
                bookToUpdate.setLanguage(updatedBookData.getLanguage());
                bookToUpdate.setPages(updatedBookData.getPages());
                bookToUpdate.setTitle(updatedBookData.getTitle());
                bookToUpdate.setDateOfUpdate(formater.format(updatedBookData.getUpdateDate()));
    
                List<String> responses=validateBook(bookToUpdate);
    
                if(responses.size()>0 && responses.get(0).equals("noErrors")){
                    System.out.println("noError");
                }else if(responses.size()>0){
                    System.out.println("Errors");
                    System.out.println(responses);
                    return new ResponseEntity<>(responses,HttpStatus.BAD_REQUEST);
                }
    
                bookDAO.save(bookToUpdate);
                return new ResponseEntity<>(bookToUpdate,HttpStatus.OK);
                
            } catch (JsonProcessingException e) {
    
                throw new RuntimeException(e);
            }
        }else{
            return new ResponseEntity<>("no such book",HttpStatus.NOT_FOUND);
        }
    }
    
    public ResponseEntity<?> addBook(Integer customerId,@RequestParam("body") String book,@RequestParam(value = "author_id",required = false) Integer authorId,@RequestParam(value="author",required = false) String new_author){
        
        Customer customer=customerDAO.findCustomerById(customerId);
        List<Book> customer_books=customer.getBooks();
        SimpleDateFormat formater = new SimpleDateFormat("dd.MM.yyyy");
        ObjectMapper mapper = new ObjectMapper();
        mapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        try {
            Book bookData=mapper.readValue(book,Book.class);
            System.out.println(bookData.toString());

            Book newBook=new Book();
            newBook.setDetails(bookData.getDetails());
            newBook.setGenre(bookData.getGenre());
            newBook.setLanguage(bookData.getLanguage());
            newBook.setPages(bookData.getPages());
            newBook.setTitle(bookData.getTitle());
            newBook.setDateOfCreation(formater.format(bookData.getCreationDate()));
   
            List<String> responses= validateBook(newBook);
            System.out.println(responses);
            if(responses.size()>0 && responses.get(0).equals("noErrors")){
                System.out.println("noError");
            }else if(responses.size()>0){
                System.out.println("Errors");
                System.out.println(responses);
                return new ResponseEntity<>(responses,HttpStatus.BAD_REQUEST);
            }
            customer_books.add(newBook);

            bookDAO.save(newBook);
            if(authorId!=null){
                Author author=authorDAO.findAuthorById(authorId);
  
                author.getAuthor_books().add(newBook);
  
                bookDAO.save(newBook);
                return new ResponseEntity<>(newBook,HttpStatus.CREATED);
            }else{
                AuthorDTO bookAuthor=mapper.readValue(new_author,AuthorDTO.class);
                Author newAuthor=new Author();
                newAuthor.setName(bookAuthor.getName());
                newAuthor.setSurname(bookAuthor.getSurname());
                newAuthor.getAuthor_books().add(newBook);
                authorDAO.save(newAuthor);
            }

            bookDAO.save(newBook);
            return new ResponseEntity<>(newBook,HttpStatus.CREATED);

        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getOriginalMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseEntity<List<Map<Integer,Book>>> getAllBooks(){
        List<Book> books=bookDAO.findAll();
        List<Author> authors=authorDAO.findAll();
        List<Map<Integer,Book>> authorAndBook=new ArrayList<>();
        if(books!=null ){
            for(Book book:books){
                for(Author author:authors){
                    for(Book author_book:author.getAuthor_books()){
                        if(author_book.getId()==book.getId()){
                            Map<Integer,Book> authorBook=new HashMap<>();
                            authorBook.put(author.getId(),book);
                            authorAndBook.add(authorBook);
                        }
                    }
                }
            }
        }
        return new ResponseEntity<>(authorAndBook,HttpStatus.OK);
    }

    public ResponseEntity<?> getBook(Integer bookId){
        Book book=bookDAO.findBookById(bookId);
        if(book!=null){
            return new ResponseEntity<>(book,HttpStatus.OK);
        }else{
            return new ResponseEntity<>("no such book",HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> deleteBook(Integer customerId, Integer bookIdToDelete, Integer authorId) {
        Customer customer = customerDAO.findCustomerById(customerId);
        Author author = authorDAO.findAuthorById(authorId);
    
        if (customer != null && author != null) {
            List<Book> customer_books = customer.getBooks();
            List<Book> author_books = author.getAuthor_books();
    
            Iterator<Book> customerIterator = customer_books.iterator();
            while (customerIterator.hasNext()) {
                Book book = customerIterator.next();
    
                if (Integer.valueOf(book.getId()).equals(bookIdToDelete)) {
    
                    Iterator<Book> authorIterator = author_books.iterator();
                    while (authorIterator.hasNext()) {
                        Book authorBook = authorIterator.next();
    
                        if (Integer.valueOf(authorBook.getId()).equals(bookIdToDelete)) {
                            authorIterator.remove();
                        }
                    }
                    customerIterator.remove();
                }
            }
    
            author.setAuthor_books(author_books);
            customer.setBooks(customer_books);
            customerDAO.save(customer);
            authorDAO.save(author);
    
            return new ResponseEntity<>(customer, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("no such book", HttpStatus.NOT_FOUND);
        }
    }
    
}
