package com.f12026.Formula1.apiConfig.service;

import com.f12026.Formula1.apiConfig.client.OpenF1Client;
import com.f12026.Formula1.dto.LiveLeaderboardDTO;
import com.f12026.Formula1.dto.TrackPositionDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class OpenF1Service {

    private final OpenF1Client openF1Client;
    private final ObjectMapper mapper = new ObjectMapper();
    private final DriverMappingService driverMappingService;

    private int cachedSessionKey = -1;
    private long lastSessionFetch = 0;

    public OpenF1Service(OpenF1Client openF1Client, DriverMappingService driverMappingService) {
        this.openF1Client = openF1Client;
        this.driverMappingService = driverMappingService;
    }

    /**
     * Resolve the current active session (cached 5 minutes)
     */
    public int resolveSessionKey() {

        long now = System.currentTimeMillis();

        if (cachedSessionKey != -1 && now - lastSessionFetch < 300000) {
            return cachedSessionKey;
        }

        try {

            JsonNode sessions = mapper.readTree(openF1Client.getSessions());

            for (JsonNode s : sessions) {

                String sessionType = s.path("session_type").asText();

                if (sessionType.equalsIgnoreCase("Race")) {

                    cachedSessionKey = s.path("session_key").asInt();
                    lastSessionFetch = now;

                    return cachedSessionKey;
                }
            }

        } catch (Exception ignored) {}

        return -1;
    }

    /**
     * Fetch raw telemetry
     */
    public String getLivePositions() {

        int sessionKey = resolveSessionKey();

        if (sessionKey == -1) return "[]";

        try {
            return openF1Client.getPositions(sessionKey);
        } catch (Exception e) {
            return "[]";
        }
    }

    public String getLiveLaps() {

        int sessionKey = resolveSessionKey();

        if (sessionKey == -1) return "[]";

        try {
            return openF1Client.getLapTimes(sessionKey);
        } catch (Exception e) {
            return "[]";
        }
    }

    public String getLiveLocations() {

        int sessionKey = resolveSessionKey();

        if (sessionKey == -1) return "[]";

        try {
            return openF1Client.getLocations(sessionKey);
        } catch (Exception e) {
            return "[]";
        }
    }

    public String getLiveDrivers() {

        int sessionKey = resolveSessionKey();

        if (sessionKey == -1) return "[]";

        try {
            return openF1Client.getDrivers(sessionKey);
        } catch (Exception e) {
            return "[]";
        }
    }

    public JsonNode fetchPositions(int sessionKey) {
        try {
            return mapper.readTree(openF1Client.getPositions(sessionKey));
        } catch (Exception e) {
            return mapper.createArrayNode();
        }
    }

    public JsonNode fetchLaps(int sessionKey) {
        try {
            return mapper.readTree(openF1Client.getLapTimes(sessionKey));
        } catch (Exception e) {
            return mapper.createArrayNode();
        }
    }

    public JsonNode fetchLocations(int sessionKey) {
        try {
            return mapper.readTree(openF1Client.getLocations(sessionKey));
        } catch (Exception e) {
            return mapper.createArrayNode();
        }
    }

    public JsonNode fetchStints(int sessionKey) {
        try {
            return mapper.readTree(openF1Client.getStints(sessionKey));
        } catch (Exception e) {
            return mapper.createArrayNode();
        }
    }

    public JsonNode fetchPitStops(int sessionKey) {
        try {
            return mapper.readTree(openF1Client.getPitStops(sessionKey));
        } catch (Exception e) {
            return mapper.createArrayNode();
        }
    }

    /**
     * Build leaderboard from cached JSON
     */
    public List<LiveLeaderboardDTO> buildLiveLeaderboard(
            String positionsJson,
            String lapsJson) {

        try {

            JsonNode positionsNode = mapper.readTree(positionsJson);
            JsonNode lapsNode = mapper.readTree(lapsJson);

            Map<Integer,String> lastLapTimes = new HashMap<>();

            for(JsonNode lap : lapsNode){

                int driver = lap.path("driver_number").asInt();
                String raw = lap.path("lap_duration").asText(null);

                lastLapTimes.put(driver, formatLapTime(raw));
            }

            List<LiveLeaderboardDTO> leaderboard = new ArrayList<>();

            for(JsonNode pos : positionsNode){

                int driverNumber = pos.path("driver_number").asInt();

                LiveLeaderboardDTO dto = new LiveLeaderboardDTO();

                dto.setDriverNumber(driverNumber);
                dto.setPosition(pos.path("position").asInt());

                dto.setDriverName(
                        driverMappingService.getDriverName(driverNumber)
                );

                dto.setTeamName(
                        driverMappingService.getTeam(driverNumber)
                );

                dto.setLastLapTime(
                        lastLapTimes.getOrDefault(driverNumber,"-")
                );

                leaderboard.add(dto);
            }

            leaderboard.sort(
                    Comparator.comparingInt(LiveLeaderboardDTO::getPosition)
            );

            return leaderboard;

        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    /**
     * Build track positions using location telemetry
     */
    public List<TrackPositionDTO> buildTrackPositions(String locationsJson) {

        try {

            JsonNode locationsNode = mapper.readTree(locationsJson);

            Map<Integer, JsonNode> latestLocations = new HashMap<>();

            for (JsonNode loc : locationsNode) {

                int driver = loc.path("driver_number").asInt();

                latestLocations.put(driver, loc);
            }

            List<TrackPositionDTO> result = new ArrayList<>();

            for (JsonNode loc : latestLocations.values()) {

                TrackPositionDTO dto = new TrackPositionDTO();

                dto.setDriverNumber(loc.path("driver_number").asInt());
                dto.setX(loc.path("x").asDouble());
                dto.setY(loc.path("y").asDouble());

                dto.setPosition(0);

                result.add(dto);
            }

            return result;

        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    /**
     * Format lap time
     */
    private String formatLapTime(String raw) {

        try {

            if (raw == null) return "-";

            double seconds = Double.parseDouble(raw);

            int minutes = (int) (seconds / 60);
            double remaining = seconds % 60;

            return String.format("%d:%06.3f", minutes, remaining);

        } catch (Exception e) {

            return "-";
        }
    }
}