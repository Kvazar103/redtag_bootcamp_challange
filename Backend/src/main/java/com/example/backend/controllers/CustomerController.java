package com.example.backend.controllers;

import com.example.backend.models.Customer;
import com.example.backend.models.dto.CustomerLoginDTO;
import com.example.backend.services.CustomerService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@CrossOrigin("http://localhost:3000")
public class CustomerController {
  
    private CustomerService customerService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestParam("customer") String customer) throws JsonMappingException, JsonProcessingException {
        ObjectMapper mapper=new ObjectMapper();
    
        Customer new_customer=mapper.readValue(customer,Customer.class);

        return customerService.registerCustomer(new_customer);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody CustomerLoginDTO customerLoginDTO) {
        return customerService.login(customerLoginDTO);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCustomer(@RequestParam Integer customerId) {
        return customerService.getCustomerById(customerId);
    }
}
