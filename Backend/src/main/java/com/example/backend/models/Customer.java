package com.example.backend.models;

import lombok.*;

import javax.persistence.*;
import java.util.List;

import jakarta.validation.constraints.*;
import jakarta.validation.constraints.Pattern;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Customer{
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;
        @NotBlank(message = "Name is required")
        private String name;
        @NotBlank(message="Surnmae is required")
        private String surname;
        @Email(message = "Email is not valid", regexp = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]" +
                "+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-" +
                "\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\" +
                "[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:" +
                "[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])")
        @NotBlank(message = "Email cannot be empty")
        private String email;
        @NotBlank(message = "Login is required")
        private String login;
        @NotNull(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters long")
        @Pattern(regexp = ".*[A-Z].*", message = "Password must contain at least one uppercase letter")
        @Pattern(regexp = ".*[a-z].*", message = "Password must contain at least one lowercase letter")
        @Pattern(regexp = ".*\\d.*", message = "Password must contain at least one digit")
        private String password;
        @OneToMany(cascade = CascadeType.ALL,
                   fetch = FetchType.LAZY,
                   orphanRemoval = true)
        @JoinTable(name = "user_book",
                joinColumns = @JoinColumn(name="user_id"),
                inverseJoinColumns = @JoinColumn(name = "user_book_id"))
        private List<Book> books;
        private String role="ROLE_USER";

}
