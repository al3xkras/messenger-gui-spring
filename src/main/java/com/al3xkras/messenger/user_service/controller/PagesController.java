package com.al3xkras.messenger.user_service.controller;

import com.al3xkras.messenger.dto.MessengerUserDTO;
import com.al3xkras.messenger.entity.MessengerUser;
import com.al3xkras.messenger.model.MessengerUtils;
import com.al3xkras.messenger.user_service.dto.LoginForm;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Controller
public class PagesController {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/")
    public String indexPage(){
        return "index";
    }

    @GetMapping("/register")
    public String registerPage(Model model){
        model.addAttribute("registration",
                new MessengerUserDTO());
        return "register";
    }

    @PostMapping("/register")
    public String regFormAccept(@Valid @ModelAttribute("registration") MessengerUserDTO dto, BindingResult result){
        if (result.hasErrors()){
            return "register";
        }
        String uri = MessengerUtils.Property.USER_SERVICE_URI.value();
        log.info("to register: "+dto);
        MessengerUser created = restTemplate.postForObject(uri+"/user",dto, MessengerUser.class);
        log.info("created: "+created);
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String loginPage(){
        return "login";
    }

    /**
     * User service login
     * @return : Map {"access-token":string,"refresh-token":string}
     */
    @PostMapping("/login")
    @ResponseBody
    public Map<String,String> login(@Valid LoginForm loginForm){
        String uri = MessengerUtils.Property.USER_SERVICE_URI.value();
        log.info("login form: "+loginForm);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", MediaType.APPLICATION_FORM_URLENCODED.toString());
        headers.add("Accept", MediaType.APPLICATION_JSON.toString()); //Optional in case server sends back JSON data

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();

        form.add("username",loginForm.getUsername());
        form.add("password",loginForm.getPassword());

        HttpEntity<MultiValueMap<String,String>> formEntity = new HttpEntity<>(form, headers);

        ResponseEntity<Map> response = restTemplate.exchange(uri+"/user/login", HttpMethod.POST,
                formEntity, Map.class);
        log.info("response: "+response);
        return (Map<String, String>) response.getBody();
    }

}