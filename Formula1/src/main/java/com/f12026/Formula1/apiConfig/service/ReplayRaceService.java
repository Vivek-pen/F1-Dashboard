package com.f12026.Formula1.apiConfig.service;

import com.f12026.Formula1.dto.RaceDTO;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReplayRaceService {

    private final JolpicaService jolpicaService;
    private final ReplayTrackSimulator simulator;
    private final CircuitMapService circuitMapService;

    private int selectedRound = -1;
    private boolean isPlaying = false;
    private int currentLap = 0;
    private int totalLaps = 78;
    private String selectedRaceName = "";
    private String selectedCircuitName = "";

    public ReplayRaceService(JolpicaService jolpicaService, 
                            ReplayTrackSimulator simulator,
                            CircuitMapService circuitMapService) {
        this.jolpicaService = jolpicaService;
        this.simulator = simulator;
        this.circuitMapService = circuitMapService;
    }

    public List<RaceDTO> getCompletedRaces() {
        try {
            List<RaceDTO> allRaces = jolpicaService.getRaceSchedule();
            Date now = new Date();
            
            return allRaces.stream()
                .filter(race -> {
                    try {
                        Date raceDate = new java.text.SimpleDateFormat("yyyy-MM-dd").parse(race.getRaceDateTime());
                        return raceDate.before(now);
                    } catch (Exception e) {
                        return false;
                    }
                })
                .collect(Collectors.toList());
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    public void selectRace(int round) {
        this.selectedRound = round;
        this.currentLap = 0;
        this.isPlaying = false;
        
        try {
            List<RaceDTO> races = jolpicaService.getRaceSchedule();
            Optional<RaceDTO> race = races.stream()
                .filter(r -> r.getRound() == round)
                .findFirst();
            
            if (race.isPresent()) {
                this.selectedRaceName = race.get().getRaceName();
                this.selectedCircuitName = race.get().getCircuitName();
                simulator.setCircuit(this.selectedCircuitName);
                System.out.println("Selected race: " + selectedRaceName + " at " + selectedCircuitName);
            }
        } catch (Exception e) {
            System.err.println("Error selecting race: " + e.getMessage());
        }
    }

    public Map<String, Object> getCurrentSessionInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("round", selectedRound);
        info.put("raceName", selectedRaceName);
        info.put("circuitName", selectedCircuitName);
        info.put("currentLap", currentLap);
        info.put("totalLaps", totalLaps);
        info.put("isPlaying", isPlaying);
        return info;
    }

    public void play() {
        this.isPlaying = true;
    }

    public void pause() {
        this.isPlaying = false;
    }

    public void reset() {
        this.currentLap = 0;
        this.isPlaying = false;
    }

    public int getCurrentLap() {
        return currentLap;
    }

    public int getTotalLaps() {
        return totalLaps;
    }

    public boolean isPlaying() {
        return isPlaying;
    }

    public int getSelectedRound() {
        return selectedRound;
    }

    public void advanceLap() {
        if (isPlaying && currentLap < totalLaps) {
            currentLap++;
        } else if (currentLap >= totalLaps) {
            isPlaying = false;
        }
    }
}
