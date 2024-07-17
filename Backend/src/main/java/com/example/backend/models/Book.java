package com.example.backend.models;

import java.time.LocalDate;

import lombok.*;

import javax.persistence.*;

import com.example.backend.models.enums.Genres;
import com.example.backend.models.enums.Language;

import java.util.*;

import jakarta.validation.constraints.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotBlank(message = "Title is required")
    private String title;
    @NotNull(message = "Pages are required")
    @Min(value = 1, message = "Pages must be a positive number")
    private int pages;
    @NotNull(message = "Language is required")
    @Enumerated(EnumType.STRING)
    private Language language;
    private LocalDate publish_date; 
    @NotNull(message = "Genres are required")
    @Enumerated(EnumType.STRING)
    private Genres genre;
    @NotBlank(message = "Details are required")
    private String details;
    private final Date creationDate = new Date();
    private String dateOfCreation;
    private Date updateDate=new Date();
    private String dateOfUpdate;
}
