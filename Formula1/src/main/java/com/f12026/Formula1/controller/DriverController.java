package com.f12026.Formula1.controller;

import com.f12026.Formula1.apiConfig.service.JolpicaCacheService;
import com.f12026.Formula1.model.Driver;
import com.f12026.Formula1.dto.DriverDTO;
import com.f12026.Formula1.apiConfig.service.JolpicaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin
public class DriverController {

    private final JolpicaCacheService jolpicaCacheService;

    public DriverController(JolpicaCacheService jolpicaCacheService) {
        this.jolpicaCacheService = jolpicaCacheService;
    }

    @GetMapping
    public List<DriverDTO> getDrivers() {
        return jolpicaCacheService.getDrivers();
    }
}
