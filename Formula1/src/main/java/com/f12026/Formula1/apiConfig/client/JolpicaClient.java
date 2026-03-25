package com.f12026.Formula1.apiConfig.client;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class JolpicaClient {

    private final WebClient webClient;

    public JolpicaClient(@Qualifier("jolpicaWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    public String getDrivers() {
        return webClient.get()
                .uri("/current/driverStandings.json")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getDriversFallback() {

        return webClient.get()
                .uri("/current/drivers.json")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getConstructors() {
        return webClient.get()
                .uri("/current/constructors.json")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getRaceSchedule() {
        return webClient.get()
                .uri("/current.json")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getDriverStandings() {
        return webClient.get()
                .uri("/current/driverStandings.json")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getConstructorStandings() {
        return webClient.get()
                .uri("/current/constructorStandings.json")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public String getRaceResults(String round) {
        return webClient.get()
                .uri("/current/" + round + "/results.json")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
    public String getNextRace() {

        return webClient.get()
                .uri("/current/next.json")
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}