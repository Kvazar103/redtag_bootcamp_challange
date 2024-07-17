package com.example.backend.models.dto;

import java.util.List;

import com.example.backend.models.Book;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CustomerWithoutPasswordDTO {
    private long id;
    private String name;
    private String surname;
    private String email;
    private String login;
    private List<Book> books;
}