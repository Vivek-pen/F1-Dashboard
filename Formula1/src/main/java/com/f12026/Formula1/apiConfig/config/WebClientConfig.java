package com.f12026.Formula1.apiConfig.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient jolpicaWebClient() {
        return WebClient.builder()
                .baseUrl("https://api.jolpi.ca/ergast/f1")
                .build();
    }

    @Bean
    public WebClient openF1WebClient() {
        return WebClient.builder()
                .baseUrl("https://api.openf1.org/v1")
                .build();
    }
}