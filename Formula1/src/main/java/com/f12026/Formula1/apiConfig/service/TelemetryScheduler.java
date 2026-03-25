package com.f12026.Formula1.apiConfig.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TelemetryScheduler {

    private final OpenF1Service openF1Service;
    private final TelemetryCache cache;

    public TelemetryScheduler(OpenF1Service openF1Service,
                              TelemetryCache cache) {
        this.openF1Service = openF1Service;
        this.cache = cache;
    }

    @Scheduled(fixedRate = 15000)
    public void refreshTelemetry() {

        try {

            int sessionKey = openF1Service.resolveSessionKey();

            if (sessionKey == -1) return;

            cache.setPositions(
                    openF1Service.fetchPositions(sessionKey));

            cache.setLaps(
                    openF1Service.fetchLaps(sessionKey));

            cache.setLocations(
                    openF1Service.fetchLocations(sessionKey));

            cache.setStints(
                    openF1Service.fetchStints(sessionKey));

            cache.setPitStops(
                    openF1Service.fetchPitStops(sessionKey));

        } catch (Exception ignored) {}
    }
}