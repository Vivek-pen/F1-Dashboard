package com.f12026.Formula1.controller;

import com.f12026.Formula1.apiConfig.service.JolpicaCacheService;
import com.f12026.Formula1.dto.DriverStandingDTO;
import com.f12026.Formula1.dto.ConstructorStandingDTO;
import com.f12026.Formula1.apiConfig.service.JolpicaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/standings")
@CrossOrigin
public class StandingController {

    private final JolpicaCacheService jolpicaCacheService;

    public StandingController(JolpicaCacheService jolpicaCacheService) {
        this.jolpicaCacheService = jolpicaCacheService;
    }

    @GetMapping("/drivers")
    public List<DriverStandingDTO> getDriverStandings() {
        return jolpicaCacheService.getDriverStandings();
    }

    @GetMapping("/constructors")
    public List<ConstructorStandingDTO> getConstructorStandings() {
        return jolpicaCacheService.getConstructorStandings();
    }
}