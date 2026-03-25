package com.f12026.Formula1.controller;

import com.f12026.Formula1.apiConfig.service.CircuitMapService;
import com.f12026.Formula1.apiConfig.service.ReplayRaceService;
import com.f12026.Formula1.dto.RaceDTO;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/replay")
@CrossOrigin
public class ReplayRaceController {

    private final ReplayRaceService replayRaceService;
    private final CircuitMapService circuitMapService;

    public ReplayRaceController(ReplayRaceService replayRaceService, CircuitMapService circuitMapService) {
        this.replayRaceService = replayRaceService;
        this.circuitMapService = circuitMapService;
    }

    @GetMapping("/available-races")
    public List<RaceDTO> getAvailableRaces() {
        return replayRaceService.getCompletedRaces();
    }

    @PostMapping("/select/{round}")
    public Map<String, String> selectRace(@PathVariable int round) {
        replayRaceService.selectRace(round);
        return Map.of("status", "Race selected", "round", String.valueOf(round));
    }

    @GetMapping("/current-session")
    public Map<String, Object> getCurrentSession() {
        return replayRaceService.getCurrentSessionInfo();
    }

    @PostMapping("/control/{action}")
    public Map<String, String> controlReplay(@PathVariable String action) {
        switch (action) {
            case "play":
                replayRaceService.play();
                return Map.of("status", "playing");
            case "pause":
                replayRaceService.pause();
                return Map.of("status", "paused");
            case "reset":
                replayRaceService.reset();
                return Map.of("status", "reset");
            default:
                return Map.of("status", "unknown action");
        }
    }

    @GetMapping("/progress")
    public Map<String, Object> getProgress() {
        return Map.of(
            "currentLap", replayRaceService.getCurrentLap(),
            "totalLaps", replayRaceService.getTotalLaps(),
            "isPlaying", replayRaceService.isPlaying()
        );
    }

    @GetMapping("/circuit-info/{circuitName}")
    public Map<String, Object> getCircuitInfo(@PathVariable String circuitName) {
        CircuitMapService.CircuitMap circuit = circuitMapService.getCircuitMap(circuitName);
        
        Map<String, Object> info = new HashMap<>();
        info.put("name", circuit.getName());
        info.put("flag", circuit.getFlag());
        info.put("viewBox", circuit.getViewBox());
        
        List<Map<String, Double>> points = new ArrayList<>();
        for (double[] point : circuit.getTrackPoints()) {
            Map<String, Double> p = new HashMap<>();
            p.put("x", point[0]);
            p.put("y", point[1]);
            points.add(p);
        }
        info.put("trackPoints", points);
        
        return info;
    }
}
