package com.f12026.Formula1.controller;

import com.f12026.Formula1.apiConfig.service.TelemetryCacheService;
import com.f12026.Formula1.dto.LiveLeaderboardDTO;
import com.f12026.Formula1.dto.TrackPositionDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/live")
@CrossOrigin
public class LiveRaceController {

    private final TelemetryCacheService cache;

    public LiveRaceController(TelemetryCacheService cache) {
        this.cache = cache;
    }

    @GetMapping("/track")
    public List<TrackPositionDTO> track(){
        return cache.getTrack();
    }

    @GetMapping("/leaderboard")
    public List<LiveLeaderboardDTO> leaderboard(){
        return cache.getLeaderboard();
    }
}