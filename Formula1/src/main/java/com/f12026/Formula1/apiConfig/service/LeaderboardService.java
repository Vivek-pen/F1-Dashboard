package com.f12026.Formula1.apiConfig.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

@Service
public class LeaderboardService {

    private final TelemetryCache cache;

    public LeaderboardService(TelemetryCache cache) {
        this.cache = cache;
    }

    public JsonNode getPositions() {
        return cache.getPositions();
    }

    public JsonNode getLocations() {
        return cache.getLocations();
    }
}