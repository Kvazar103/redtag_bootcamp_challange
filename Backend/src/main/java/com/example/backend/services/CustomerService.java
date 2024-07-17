package com.example.backend.services;

import com.example.backend.dao.CustomerDAO;
import com.example.backend.models.Customer;
import com.example.backend.models.dto.CustomerLoginDTO;
import com.example.backend.models.dto.CustomerWithoutPasswordDTO;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validation;
import jakarta.validation.ValidatorFactory;
import lombok.AllArgsConstructor;
import org.hibernate.validator.messageinterpolation.ParameterMessageInterpolator;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@AllArgsConstructor
@EnableWebSecurity //для роботи метода ifPasswordMatchesSave
public class CustomerService {
     private CustomerDAO customerDAO;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;//базовий об'єкт який займається процесом аутентифікації

    public List<String> validateCustomer(@Valid Customer customer){
        ValidatorFactory factory = Validation.byDefaultProvider()
                .configure()
                .messageInterpolator(new ParameterMessageInterpolator())
                .buildValidatorFactory();
        jakarta.validation.Validator validator = factory.getValidator();
        Set<ConstraintViolation<Customer>> violations = validator.validate(customer);

        if (!violations.isEmpty()) {
            // Обробка помилок валідації
            // Поверніть відповідну відповідь або викличте виключення
            System.out.println("errors");
            System.out.println(violations);
            List<String> messagesErrorList = new ArrayList<>();

            for (ConstraintViolation<Customer> violation : violations) {
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

    public ResponseEntity<?> registerCustomer(Customer customer){
        Customer newCustomer=new Customer();
        System.out.println(customer);
        newCustomer.setId(customer.getId());
        newCustomer.setLogin(customer.getLogin());
        newCustomer.setEmail(customer.getEmail());
        newCustomer.setName(customer.getName());
        newCustomer.setSurname(customer.getSurname());
        newCustomer.setPassword(customer.getPassword());
        System.out.println(newCustomer);
        List<String> responses=validateCustomer(newCustomer);

        if(responses.size()>0 && responses.get(0).equals("noErrors")){
            System.out.println("noError");
        }else if(responses.size()>0){
            System.out.println("Errors");
            System.out.println(responses);
            return new ResponseEntity<>(responses,HttpStatus.BAD_REQUEST);
        }
        newCustomer.setPassword(passwordEncoder.encode(customer.getPassword()));
        customerDAO.save(newCustomer);
        return new ResponseEntity<>(newCustomer,HttpStatus.CREATED);

    }

    public ResponseEntity<?> login(@RequestBody CustomerLoginDTO customerLoginDTO){
        
        if(!customerDAO.existsCustomerByLogin(customerLoginDTO.getLogin())){
            System.out.println("Wrong login");
            return  new ResponseEntity<>("Error", HttpStatus.FORBIDDEN);
        }
        Customer customerByLogin=customerDAO.findCustomerByLogin(customerLoginDTO.getLogin());

        Authentication authenticate= authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(customerByLogin.getId(),customerLoginDTO.getPassword()));  //тут ми впроваджуємо об'єкт який має мати аутентифікацію(креденшили)
        // і коли ми його тут вставляєм то спрацьовує метод configure(AuthenticationManagerBuilder auth) з SecurityConfig і якщо він його там знайде то впроваде ідентифікацію(заповнить authenticate)
        if(authenticate!=null){ //якщо authenticate заповнений тоді згенеруємо токен
            Customer customer= customerDAO.findCustomerByLogin(customerLoginDTO.getLogin());
            CustomerWithoutPasswordDTO customerWithoutPassword=new CustomerWithoutPasswordDTO(customer.getId(),customer.getName(),customer.getSurname(),customer.getEmail(),customer.getLogin(),customer.getBooks());

            String jwtToken2= Jwts.builder().
                    setSubject(Long.toString(customer.getId()))
                    .signWith(SignatureAlgorithm.HS512,"nazar".getBytes(StandardCharsets.UTF_8)) //тут є саме кодування
                    .compact(); //це позволить зробити стрінгу яка й буде являтися токеном
            System.out.println(jwtToken2);
            HttpHeaders headers=new HttpHeaders();
            headers.add("Authorization","Bearer "+jwtToken2);//додаємо в хедер наш токен
            return new ResponseEntity<>(customerWithoutPassword,headers,HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<>("forbidden",HttpStatus.FORBIDDEN);//якщо провірку не пройшло тоді заборонено
    }


    public ResponseEntity<?> getCustomerById(Integer customerId){
        Customer customer=customerDAO.findCustomerById(customerId);

        if(customer!=null){
            CustomerWithoutPasswordDTO customerWithoutPassword=new CustomerWithoutPasswordDTO(
                customer.getId(), 
                customer.getName(), 
                customer.getSurname(), 
                customer.getEmail(), 
                customer.getLogin(),
                customer.getBooks());
            return new ResponseEntity<>(customerWithoutPassword,HttpStatus.OK);
        }else{
            return new ResponseEntity<>("no such user",HttpStatus.NOT_FOUND);
        }
    }
}
