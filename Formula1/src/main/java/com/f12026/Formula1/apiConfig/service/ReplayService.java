package com.f12026.Formula1.apiConfig.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
public class ReplayService {

    private final ObjectMapper mapper = new ObjectMapper();
    private final DriverMappingService driverMappingService;

    private JsonNode locations;
    private JsonNode positions;
    private JsonNode laps;

    public ReplayService(DriverMappingService driverMappingService) {
        this.driverMappingService = driverMappingService;
        loadReplayFiles();
    }

    private void loadReplayFiles() {

        try {

            InputStream locStream =
                    new ClassPathResource("replay/locations.json").getInputStream();

            InputStream posStream =
                    new ClassPathResource("replay/positions.json").getInputStream();

            InputStream lapStream =
                    new ClassPathResource("replay/laps.json").getInputStream();

            locations = mapper.readTree(locStream);
            positions = mapper.readTree(posStream);
            laps = mapper.readTree(lapStream);

            // Load driver info from positions data
            driverMappingService.loadDrivers(positions.toString());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public JsonNode getLocations() {
        return locations;
    }

    public JsonNode getPositions() {
        return positions;
    }

    public JsonNode getLaps() {
        return laps;
    }
}