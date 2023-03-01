package com.al3xkras.messenger.user_service.controller;

import com.al3xkras.messenger.model.MessengerUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Controller
public class UserController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/user/index")
    public String userIndexPage(){
        return "user/index";
    }

    @GetMapping("/user/info")
    @ResponseBody
    public Object getUserInfo(@RequestParam(value = "username") String username,
                                          @RequestParam(value = "token") String accessToken){

        String uri = MessengerUtils.Property.USER_SERVICE_URI.value();
        log.info("username: "+username);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", MediaType.APPLICATION_FORM_URLENCODED.toString());
        headers.add("Accept", MediaType.APPLICATION_JSON.toString()); //Optional in case server sends back JSON data
        headers.add("Authorization", accessToken);


        HttpEntity<?> formEntity = new HttpEntity<>(null, headers);

        ResponseEntity<Object> response = restTemplate.exchange(uri+"/user?username="+username, HttpMethod.GET,
                formEntity, Object.class);
        log.info("response: "+response.getBody());
        return response.getBody();
    }
}
