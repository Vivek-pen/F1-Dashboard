package com.f12026.Formula1.apiConfig.service;

import com.f12026.Formula1.dto.LiveTelemetryDTO;
import com.f12026.Formula1.dto.TrackPositionDTO;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TelemetryStreamService {

    private final TelemetryCacheService cacheService;
    private final SimpMessagingTemplate messagingTemplate;

    private Map<Integer, Integer> previousPositions = new HashMap<>();

    public TelemetryStreamService(TelemetryCacheService cacheService,
                                  SimpMessagingTemplate messagingTemplate) {
        this.cacheService = cacheService;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * WebSocket streaming every 1 second
     * Uses cached telemetry (no OpenF1 calls)
     */
    @Scheduled(fixedRate = 1000)
    public void streamTelemetry() {

        try {

            List<TrackPositionDTO> trackPositions =
                    cacheService.getTrack();

            if (trackPositions == null || trackPositions.isEmpty()) {
                return;
            }

            Map<Integer, Integer> currentPositions = new HashMap<>();

            List<LiveTelemetryDTO> telemetry = new ArrayList<>();

            for (TrackPositionDTO pos : trackPositions) {

                int driver = pos.getDriverNumber();
                int position = pos.getPosition();

                currentPositions.put(driver, position);

                LiveTelemetryDTO dto = new LiveTelemetryDTO();

                dto.setDriverNumber(driver);
                dto.setX(pos.getX());
                dto.setY(pos.getY());
                dto.setPosition(position);

                int prevPosition =
                        previousPositions.getOrDefault(driver, position);

                dto.setPositionChange(prevPosition - position);

                telemetry.add(dto);
            }

            previousPositions = currentPositions;

            messagingTemplate.convertAndSend(
                    "/topic/live-telemetry",
                    telemetry
            );

        } catch (Exception ignored) {}
    }
}