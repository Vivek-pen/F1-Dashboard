package com.f12026.Formula1.controller;

import com.f12026.Formula1.apiConfig.service.JolpicaCacheService;
import com.f12026.Formula1.apiConfig.service.JolpicaService;
import com.f12026.Formula1.dto.ConstructorDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin
public class TeamController {

    private final JolpicaCacheService jolpicaCacheService;

    public TeamController(JolpicaCacheService jolpicaCacheService) {
        this.jolpicaCacheService=jolpicaCacheService;
    }

    @GetMapping
    public List<ConstructorDTO> getConstructors() {
        return jolpicaCacheService.getConstructors();
    }
}