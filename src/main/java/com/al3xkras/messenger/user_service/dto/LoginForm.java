package com.al3xkras.messenger.user_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotEmpty;

@Data
@NoArgsConstructor
public class LoginForm {
    @NotEmpty
    private String username;
    @NotEmpty
    private String password;
}
