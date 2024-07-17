package com.example.backend.models.dto;

import com.example.backend.models.enums.Genres;
import com.example.backend.models.enums.Language;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookAuthorDTO {
    private String title;
    private int pages;
    private Language language;
    private Genres genre;
    private String details;
    private AuthorDTO authorDTO;
}
