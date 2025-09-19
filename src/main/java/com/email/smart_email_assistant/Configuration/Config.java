package com.email.smart_email_assistant.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class Config {
@Bean
    public WebClient webClient(WebClient.Builder builder){
    return builder.build();
}
}
