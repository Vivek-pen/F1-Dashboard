package com.f12026.Formula1.apiConfig.client;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class OpenF1Client {

    private final WebClient webClient;

    public OpenF1Client(@Qualifier("openF1WebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    public String getSessions() {

        return webClient.get()
                .uri("/sessions")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getPositions(int sessionKey) {

        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/position")
                                .queryParam("session_key", sessionKey)
                                .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getLocations(int sessionKey) {

        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/location")
                                .queryParam("session_key", sessionKey)
                                .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getLapTimes(int sessionKey) {

        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/lap")
                                .queryParam("session_key", sessionKey)
                                .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getStints(int sessionKey) {

        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/stint")
                                .queryParam("session_key", sessionKey)
                                .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getPitStops(int sessionKey) {

        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/pit")
                                .queryParam("session_key", sessionKey)
                                .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getDrivers(int sessionKey) {

        return webClient.get()
                .uri(uriBuilder ->
                        uriBuilder
                                .path("/driver")
                                .queryParam("session_key", sessionKey)
                                .build())
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}