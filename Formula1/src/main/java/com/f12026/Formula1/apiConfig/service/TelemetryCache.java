package com.f12026.Formula1.apiConfig.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Component;

@Component
public class TelemetryCache {

    private JsonNode positions;
    private JsonNode laps;
    private JsonNode locations;
    private JsonNode stints;
    private JsonNode pitStops;

    public JsonNode getPositions() { return positions; }
    public void setPositions(JsonNode positions) { this.positions = positions; }

    public JsonNode getLaps() { return laps; }
    public void setLaps(JsonNode laps) { this.laps = laps; }

    public JsonNode getLocations() { return locations; }
    public void setLocations(JsonNode locations) { this.locations = locations; }

    public JsonNode getStints() { return stints; }
    public void setStints(JsonNode stints) { this.stints = stints; }

    public JsonNode getPitStops() { return pitStops; }
    public void setPitStops(JsonNode pitStops) { this.pitStops = pitStops; }
}