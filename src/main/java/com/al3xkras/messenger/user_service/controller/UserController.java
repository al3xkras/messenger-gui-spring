package com.al3xkras.messenger.user_service.controller;

import com.al3xkras.messenger.dto.ChatDTO;
import com.al3xkras.messenger.dto.MessageDTO;
import com.al3xkras.messenger.dto.PageRequestDto;
import com.al3xkras.messenger.model.ChatMessageId;
import com.al3xkras.messenger.model.MessengerUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.utils.URIBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.validation.Valid;
import java.net.URISyntaxException;
@Slf4j
@Controller
public class UserController {
    @Autowired
    private ObjectMapper objectMapper;
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
        headers.add("Accept", MediaType.APPLICATION_JSON.toString());
        headers.add("Authorization", accessToken);


        HttpEntity<?> formEntity = new HttpEntity<>(null, headers);

        ResponseEntity<Object> response = restTemplate.exchange(uri+"/user?username="+username, HttpMethod.GET,
                formEntity, Object.class);
        log.info("response: "+response.getBody());
        return response.getBody();
    }

    @GetMapping("/user/chats")
    @ResponseBody
    public Object getUserChats(@RequestParam(value = "username") String username,
                              @RequestParam(value = "token") String accessToken) throws JsonProcessingException, URISyntaxException {

        String uri = MessengerUtils.Property.CHAT_SERVICE_URI.value();
        log.info("username: "+username);
        log.info("token: "+accessToken);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", MediaType.APPLICATION_JSON.toString());
        headers.add("Accept", MediaType.APPLICATION_JSON.toString());
        headers.add("Authorization", accessToken);

        //todo remove hardcode
        int page=0;
        int size=10;

        RequestEntity<PageRequestDto> request = new RequestEntity<>(
                new PageRequestDto(page,size),
                headers,
                HttpMethod.GET,
                new URIBuilder(uri+"/chats")
                        .addParameter("username",username)
                        .addParameter("page",""+page)
                        .addParameter("size",""+size).build()
        );
        Object response = restTemplate.exchange(request, Object.class);
        log.info("response: "+response);
        return response;
    }

    @GetMapping("/chat")
    @ResponseBody
    public Object getChatInfo(@RequestParam(value = "chat-id", required = false) Long chatId,
                              @RequestParam(value = "chat-name",required = false) String chatName,
                              @RequestParam(value = "token") String token) throws URISyntaxException {

        String uri = MessengerUtils.Property.CHAT_SERVICE_URI.value();
        log.info("token: "+token);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", MediaType.APPLICATION_JSON.toString());
        headers.add("Accept", MediaType.APPLICATION_JSON.toString());
        headers.add("Authorization", token);

        URIBuilder uriBuilder = new URIBuilder(uri+"/chat");
        if (chatId!=null)
            uriBuilder.addParameter("chat-id",chatId.toString());
        if (chatName!=null)
            uriBuilder.addParameter("chat-name",chatName);

        RequestEntity<PageRequestDto> request = new RequestEntity<>(
                headers,
                HttpMethod.GET,
                uriBuilder.build()
        );
        Object response = restTemplate.exchange(request, Object.class);
        log.info("response: "+response);
        return response;

    }

    @GetMapping("/chat/messages")
    @ResponseBody
    public Object getChatMessages(@RequestParam(value = "chat-id", required = false) Long chatId,
                              @RequestParam(value = "chat-name",required = false) String chatName,
                              @RequestParam(value = "token") String token) throws URISyntaxException {

        String uri = MessengerUtils.Property.MESSAGE_SERVICE_URI.value();
        log.info("token: "+token);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", MediaType.APPLICATION_JSON.toString());
        headers.add("Accept", MediaType.APPLICATION_JSON.toString());
        headers.add("Authorization", token);

        int page=0;
        int size=10;

        URIBuilder uriBuilder = new URIBuilder(uri+"/messages");
        if (chatId!=null)
            uriBuilder.addParameter("chat-id",chatId.toString());
        if (chatName!=null)
            uriBuilder.addParameter("chat-name",chatName);
        uriBuilder.addParameter("page",""+page);
        uriBuilder.addParameter("size",""+size);

        RequestEntity<PageRequestDto> request = new RequestEntity<>(
                headers,
                HttpMethod.GET,
                uriBuilder.build()
        );
        Object response = restTemplate.exchange(request, Object.class);
        log.info("response: "+response);
        return response;

    }

    @PostMapping("/chat/message")
    @ResponseBody
    public Object postChatMessage(@RequestParam(value = "token") String token,
                                  @RequestBody @Valid MessageDTO messageDTO) throws URISyntaxException {

        String uri = MessengerUtils.Property.MESSAGE_SERVICE_URI.value();
        log.info("token: "+token);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", MediaType.APPLICATION_JSON.toString());
        headers.add("Accept", MediaType.APPLICATION_JSON.toString());
        headers.add("Authorization", token);

        //todo remove hardcode
        int page=0;
        int size=10;

        URIBuilder uriBuilder = new URIBuilder(uri+"/message");
        uriBuilder.addParameter("page",""+page);
        uriBuilder.addParameter("size",""+size);

        RequestEntity<MessageDTO> request = new RequestEntity<>(
                messageDTO,
                headers,
                HttpMethod.POST,
                uriBuilder.build()
        );

        Object response = restTemplate.exchange(request, Object.class);
        log.info("response: "+response);
        return response;

    }

    @PostMapping("/chat")
    @ResponseBody
    public Object createChat(@RequestParam(value = "token") String token,
                                  @RequestBody @Valid ChatDTO chatDTO) throws URISyntaxException {

        String uri = MessengerUtils.Property.CHAT_SERVICE_URI.value();
        log.info("token: "+token);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", MediaType.APPLICATION_JSON.toString());
        headers.add("Accept", MediaType.APPLICATION_JSON.toString());
        headers.add("Authorization", token);

        URIBuilder uriBuilder = new URIBuilder(uri+"/chat");

        RequestEntity<ChatDTO> request = new RequestEntity<>(
                chatDTO,
                headers,
                HttpMethod.POST,
                uriBuilder.build()
        );

        Object response = restTemplate.exchange(request, Object.class);
        log.info("response: "+response);
        return response;

    }

    @DeleteMapping("/chat/message")
    @ResponseBody
    public Object deleteChatMessage(@RequestParam(value = "token") String token,
                             @RequestBody @Valid ChatMessageId id) throws URISyntaxException {

        String uri = MessengerUtils.Property.MESSAGE_SERVICE_URI.value();
        log.info("token: "+token);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", MediaType.APPLICATION_JSON.toString());
        headers.add("Accept", MediaType.APPLICATION_JSON.toString());
        headers.add("Authorization", token);

        URIBuilder uriBuilder = new URIBuilder(uri+"/message");

        RequestEntity<ChatMessageId> request = new RequestEntity<>(
                id,
                headers,
                HttpMethod.DELETE,
                uriBuilder.build()
        );

        Object response = restTemplate.exchange(request, Object.class);
        log.info("response: "+response);
        return response;

    }

}
