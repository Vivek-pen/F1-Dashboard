package com.f12026.Formula1.apiConfig.service;

import com.f12026.Formula1.apiConfig.client.JolpicaClient;
import com.f12026.Formula1.dto.*;
import com.f12026.Formula1.util.TeamColor;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class JolpicaService {

    private final JolpicaClient jolpicaClient;
    private final ObjectMapper objectMapper;

    public JolpicaService(JolpicaClient jolpicaClient, ObjectMapper objectMapper) {
        this.jolpicaClient = jolpicaClient;
        this.objectMapper = objectMapper;
    }

    public List<DriverDTO> getDrivers() {

        try {

            String response = jolpicaClient.getDrivers();

            JsonNode root = objectMapper.readTree(response);

            JsonNode standingsLists = root
                    .path("MRData")
                    .path("StandingsTable")
                    .path("StandingsLists");

            List<DriverDTO> result = new ArrayList<>();

            // CASE 1: season started → standings available
            if (!standingsLists.isEmpty()) {

                JsonNode drivers = standingsLists
                        .get(0)
                        .path("DriverStandings");

                for (JsonNode d : drivers) {

                    JsonNode driver = d.path("Driver");

                    String constructorName = d
                            .path("Constructors")
                            .get(0)
                            .path("name")
                            .asText();

                    DriverDTO dto = new DriverDTO();

                    dto.setDriverId(driver.path("driverId").asText());
                    dto.setCode(driver.path("code").asText());
                    dto.setGivenName(driver.path("givenName").asText());
                    dto.setFamilyName(driver.path("familyName").asText());
                    dto.setNationality(driver.path("nationality").asText());
                    dto.setPermanentNumber(driver.path("permanentNumber").asText());

                    dto.setConstructorName(constructorName);
                    dto.setTeamColor(TeamColor.getColor(constructorName));

                    result.add(dto);
                }

                return result;
            }

            // CASE 2: season not started → fallback to drivers API
            String fallbackResponse = jolpicaClient.getDriversFallback();

            JsonNode fallbackRoot = objectMapper.readTree(fallbackResponse);

            JsonNode drivers = fallbackRoot
                    .path("MRData")
                    .path("DriverTable")
                    .path("Drivers");

            for (JsonNode driver : drivers) {

                DriverDTO dto = new DriverDTO();

                dto.setDriverId(driver.path("driverId").asText());
                dto.setCode(driver.path("code").asText());
                dto.setGivenName(driver.path("givenName").asText());
                dto.setFamilyName(driver.path("familyName").asText());
                dto.setNationality(driver.path("nationality").asText());
                dto.setPermanentNumber(driver.path("permanentNumber").asText());

                dto.setConstructorName("TBD");
                dto.setTeamColor("#333333");

                result.add(dto);
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch drivers", e);
        }
    }

    public List<ConstructorDTO> getConstructors() {

        try {

            String response = jolpicaClient.getConstructors();

            JsonNode root = objectMapper.readTree(response);

            JsonNode constructors = root
                    .path("MRData")
                    .path("ConstructorTable")
                    .path("Constructors");

            List<ConstructorDTO> result = new ArrayList<>();

            for (JsonNode constructor : constructors) {

                ConstructorDTO dto = new ConstructorDTO();

                String constructorName = constructor.path("name").asText();

                dto.setConstructorId(constructor.path("constructorId").asText());
                dto.setName(constructorName);
                dto.setNationality(constructor.path("nationality").asText());


                result.add(dto);
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse constructors", e);
        }
    }

    public List<RaceDTO> getRaceSchedule() {

        try {

            String response = jolpicaClient.getRaceSchedule();

            JsonNode root = objectMapper.readTree(response);

            JsonNode races = root
                    .path("MRData")
                    .path("RaceTable")
                    .path("Races");

            List<RaceDTO> result = new ArrayList<>();

            for (JsonNode race : races) {

                RaceDTO dto = new RaceDTO();

                dto.setRound(race.path("round").asInt());
                dto.setRaceName(race.path("raceName").asText());
                String date = race.path("date").asText();
                String time = race.path("time").asText(null);

                if (time != null) {
                    dto.setRaceDateTime(date + "T" + time);
                } else {
                    dto.setRaceDateTime(date);
                }
                dto.setQualifyingTime(
                        race.path("Qualifying").path("date").asText() + "T" +
                                race.path("Qualifying").path("time").asText()
                );
                if (race.has("SprintQualifying")) {

                    dto.setSprintQualifyingTime(
                            race.path("SprintQualifying").path("date").asText() + "T" +
                                    race.path("SprintQualifying").path("time").asText()
                    );
                }

                dto.setCircuitName(
                        race.path("Circuit").path("circuitName").asText()
                );

                dto.setLocality(
                        race.path("Circuit")
                                .path("Location")
                                .path("locality")
                                .asText()
                );

                dto.setCountry(
                        race.path("Circuit")
                                .path("Location")
                                .path("country")
                                .asText()
                );

                result.add(dto);
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse race schedule", e);
        }
    }

    public List<DriverStandingDTO> getDriverStandings() {

        try {

            String response = jolpicaClient.getDriverStandings();

            JsonNode root = objectMapper.readTree(response);

            JsonNode standingsLists = root
                    .path("MRData")
                    .path("StandingsTable")
                    .path("StandingsLists");

            if (standingsLists.isEmpty()) {
                return new ArrayList<>(); // season not started yet
            }

            JsonNode standings = standingsLists
                    .get(0)
                    .path("DriverStandings");

            List<DriverStandingDTO> result = new ArrayList<>();

            for (JsonNode s : standings) {

                String driverName = s.path("Driver").path("givenName").asText()
                        + " "
                        + s.path("Driver").path("familyName").asText();

                String constructorName = s
                        .path("Constructors")
                        .get(0)
                        .path("name")
                        .asText();

                DriverStandingDTO dto = new DriverStandingDTO();

                dto.setPosition(s.path("position").asInt());
                dto.setDriverName(driverName);
                dto.setConstructorName(constructorName);
                dto.setPoints(s.path("points").asInt());
                dto.setWins(s.path("wins").asInt());

                result.add(dto);
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse driver standings", e);
        }
    }

    public List<ConstructorStandingDTO> getConstructorStandings() {

        try {

            String response = jolpicaClient.getConstructorStandings();

            JsonNode root = objectMapper.readTree(response);

            JsonNode standingsLists = root
                    .path("MRData")
                    .path("StandingsTable")
                    .path("StandingsLists");

            if (standingsLists.isEmpty()) {
                return new ArrayList<>();
            }

            JsonNode standings = standingsLists
                    .get(0)
                    .path("ConstructorStandings");

            List<ConstructorStandingDTO> result = new ArrayList<>();

            for (JsonNode standing : standings) {

                ConstructorStandingDTO dto = new ConstructorStandingDTO();

                String constructorName = standing
                        .path("Constructor")
                        .path("name")
                        .asText();

                dto.setPosition(standing.path("position").asInt());
                dto.setConstructorName(constructorName);
                dto.setPoints(standing.path("points").asInt());
                dto.setWins(standing.path("wins").asInt());

                dto.setTeamColor(
                        TeamColor.getColor(constructorName)
                );

                result.add(dto);
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse constructor standings", e);
        }
    }

    public List<RaceResultDTO> getRaceResults(String round) {

        try {

            String response = jolpicaClient.getRaceResults(round);

            JsonNode root = objectMapper.readTree(response);

            JsonNode races = root
                    .path("MRData")
                    .path("RaceTable")
                    .path("Races");

            if (races.isEmpty()) {
                return new ArrayList<>();
            }

            JsonNode results = races.get(0).path("Results");

            List<RaceResultDTO> result = new ArrayList<>();

            for (JsonNode r : results) {

                String driverName =
                        r.path("Driver").path("givenName").asText()
                                + " "
                                + r.path("Driver").path("familyName").asText();

                String constructorName =
                        r.path("Constructor").path("name").asText();

                RaceResultDTO dto = new RaceResultDTO();

                dto.setPosition(r.path("position").asInt());
                dto.setDriverName(driverName);
                dto.setConstructorName(constructorName);
                dto.setPoints(r.path("points").asInt());
                dto.setStatus(r.path("status").asText());

                result.add(dto);
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse race results", e);
        }
    }

    public List<RaceDTO> getUpcomingRaces() {

        try {

            String response = jolpicaClient.getRaceSchedule();

            JsonNode root = objectMapper.readTree(response);

            JsonNode races = root
                    .path("MRData")
                    .path("RaceTable")
                    .path("Races");

            List<RaceDTO> upcomingRaces = new ArrayList<>();

            LocalDate today = LocalDate.now();

            for (JsonNode race : races) {

                LocalDate raceDate = LocalDate.parse(race.path("date").asText());

                if (raceDate.isAfter(today)) {

                    RaceDTO dto = new RaceDTO();

                    dto.setRound(race.path("round").asInt());
                    dto.setRaceName(race.path("raceName").asText());

                    String date = race.path("date").asText();
                    String time = race.path("time").asText(null);

                    if (time != null) {
                        dto.setRaceDateTime(date + "T" + time);
                    } else {
                        dto.setRaceDateTime(date);
                    }

                    dto.setCircuitName(
                            race.path("Circuit").path("circuitName").asText()
                    );

                    dto.setLocality(
                            race.path("Circuit").path("Location").path("locality").asText()
                    );

                    dto.setCountry(
                            race.path("Circuit").path("Location").path("country").asText()
                    );

                    // Qualifying
                    if (race.has("Qualifying")) {
                        dto.setQualifyingTime(
                                race.path("Qualifying").path("date").asText() + "T" +
                                        race.path("Qualifying").path("time").asText()
                        );
                    }

                    // Sprint Qualifying
                    if (race.has("SprintQualifying")) {
                        dto.setSprintQualifyingTime(
                                race.path("SprintQualifying").path("date").asText() + "T" +
                                        race.path("SprintQualifying").path("time").asText()
                        );
                    }

                    // Sprint Race
                    if (race.has("Sprint")) {
                        dto.setSprintRaceTime(
                                race.path("Sprint").path("date").asText() + "T" +
                                        race.path("Sprint").path("time").asText()
                        );
                    }

                    upcomingRaces.add(dto);
                }
            }

            return upcomingRaces;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch upcoming races", e);
        }
    }
    public RaceDTO getNextRace() {

        try {

            String response = jolpicaClient.getNextRace();

            JsonNode root = objectMapper.readTree(response);

            JsonNode race = root
                    .path("MRData")
                    .path("RaceTable")
                    .path("Races")
                    .get(0);

            RaceDTO dto = new RaceDTO();

            dto.setRound(race.path("round").asInt());
            dto.setRaceName(race.path("raceName").asText());

            String date = race.path("date").asText();
            String time = race.path("time").asText(null);

            if (time != null) {
                dto.setRaceDateTime(date + "T" + time);
            } else {
                dto.setRaceDateTime(date);
            }

            dto.setCircuitName(
                    race.path("Circuit").path("circuitName").asText()
            );

            dto.setLocality(
                    race.path("Circuit").path("Location").path("locality").asText()
            );

            dto.setCountry(
                    race.path("Circuit").path("Location").path("country").asText()
            );

// Qualifying
            if (race.has("Qualifying")) {
                dto.setQualifyingTime(
                        race.path("Qualifying").path("date").asText() + "T" +
                                race.path("Qualifying").path("time").asText()
                );
            }

// Sprint Qualifying
            if (race.has("SprintQualifying")) {
                dto.setSprintQualifyingTime(
                        race.path("SprintQualifying").path("date").asText() + "T" +
                                race.path("SprintQualifying").path("time").asText()
                );
            }

// Sprint Race
            if (race.has("Sprint")) {
                dto.setSprintRaceTime(
                        race.path("Sprint").path("date").asText() + "T" +
                                race.path("Sprint").path("time").asText()
                );
            }

            return dto;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch next race", e);
        }
    }

    public RaceDetailsDTO getRaceDetails(int round) {

        try {

            String response = jolpicaClient.getRaceResults(String.valueOf(round));

            JsonNode root = objectMapper.readTree(response);

            JsonNode race = root
                    .path("MRData")
                    .path("RaceTable")
                    .path("Races")
                    .get(0);

            RaceDetailsDTO dto = new RaceDetailsDTO();

            dto.setRound(round);
            dto.setRaceName(race.path("raceName").asText());

            dto.setCircuitName(
                    race.path("Circuit").path("circuitName").asText()
            );

            dto.setLocality(
                    race.path("Circuit").path("Location").path("locality").asText()
            );

            dto.setCountry(
                    race.path("Circuit").path("Location").path("country").asText()
            );

            dto.setRaceDateTime(
                    race.path("date").asText() + "T" +
                            race.path("time").asText()
            );

            JsonNode resultsNode = race.path("Results");

            List<RaceResultDTO> results = new ArrayList<>();

            for (JsonNode r : resultsNode) {

                RaceResultDTO res = new RaceResultDTO();

                String driverName =
                        r.path("Driver").path("givenName").asText() + " " +
                                r.path("Driver").path("familyName").asText();

                res.setPosition(r.path("position").asInt());
                res.setDriverName(driverName);

                res.setConstructorName(
                        r.path("Constructor").path("name").asText()
                );

                res.setPoints(r.path("points").asInt());
                res.setStatus(r.path("status").asText());

                results.add(res);
            }

            dto.setResults(results);

            if (results.size() >= 3) {

                dto.setWinner(results.get(0));
                dto.setSecond(results.get(1));
                dto.setThird(results.get(2));
            }

            return dto;

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch race details", e);
        }
    }
}