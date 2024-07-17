package com.example.backend.models.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CustomerLoginDTO {
    private String login;
    private String password;
}
