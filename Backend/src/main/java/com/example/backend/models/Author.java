package com.example.backend.models;

import lombok.*;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Surname is required")
    private String surname;
    @OneToMany(cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,orphanRemoval = true)
    @JoinTable(name="author_book",
            joinColumns = @JoinColumn(name="author_id"),
            inverseJoinColumns = @JoinColumn(name="author_book_id"))
    @JsonManagedReference
    private List<Book> author_books=new ArrayList<Book>();
}
