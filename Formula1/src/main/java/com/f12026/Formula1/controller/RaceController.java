package com.f12026.Formula1.controller;

import com.f12026.Formula1.dto.RaceDTO;
import com.f12026.Formula1.dto.RaceDetailsDTO;
import com.f12026.Formula1.dto.RaceResultDTO;
import com.f12026.Formula1.apiConfig.service.JolpicaCacheService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/races")
@CrossOrigin
public class RaceController {

    private final JolpicaCacheService jolpicaCacheService;

    public RaceController(JolpicaCacheService jolpicaCacheService) {
        this.jolpicaCacheService = jolpicaCacheService;
    }

    @GetMapping
    public List<RaceDTO> getRaceSchedule() {
        return jolpicaCacheService.getRaceSchedule();
    }

    @GetMapping("/results/{round}")
    public List<RaceResultDTO> getRaceResults(@PathVariable String round) {
        return jolpicaCacheService.getRaceResults(round);
    }
    @GetMapping("/upcoming")
    public List<RaceDTO> getUpcomingRace() {
        return jolpicaCacheService.getUpcomingRaces();
    }

    @GetMapping("/next")
    public RaceDTO getNextRace() {
        return jolpicaCacheService.getNextRace();
    }

    @GetMapping("/{round}")
    public RaceDetailsDTO getRaceDetails(@PathVariable int round) {
        return jolpicaCacheService.getRaceDetails(round);
    }
}
