package com.al3xkras.messenger.user_service.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UserController {

    @GetMapping("/user/index")
    public String userIndexPage(){
        return "user/index";
    }
}
