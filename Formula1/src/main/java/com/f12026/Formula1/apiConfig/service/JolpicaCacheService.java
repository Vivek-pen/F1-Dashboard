package com.f12026.Formula1.apiConfig.service;

import com.f12026.Formula1.dto.*;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class JolpicaCacheService {

    private final JolpicaService jolpicaService;
    private final MockDataService mockDataService;

    private volatile boolean updating = false;

    private List<DriverDTO> cachedDrivers = Collections.emptyList();
    private List<ConstructorDTO> cachedConstructors = Collections.emptyList();
    private List<RaceDTO> cachedSchedule = Collections.emptyList();
    private List<RaceDTO> cachedUpcoming = Collections.emptyList();
    private RaceDTO cachedNextRace = null;

    private List<DriverStandingDTO> cachedDriverStandings = Collections.emptyList();
    private List<ConstructorStandingDTO> cachedConstructorStandings = Collections.emptyList();

    private Map<String, List<RaceResultDTO>> cachedRaceResults = new ConcurrentHashMap<>();
    private Map<Integer, RaceDetailsDTO> cachedRaceDetails = new ConcurrentHashMap<>();

    public JolpicaCacheService(JolpicaService jolpicaService, MockDataService mockDataService) {
        this.jolpicaService = jolpicaService;
        this.mockDataService = mockDataService;
    }

    /**
     * Refresh Jolpica data every 60 seconds
     */
    @Scheduled(cron = "0 0 0 * * MON")
    public void refreshStandings() {

        try {

            cachedDriverStandings = jolpicaService.getDriverStandings();
            cachedConstructorStandings = jolpicaService.getConstructorStandings();
            
            // If empty, use mock data
            if (cachedDriverStandings.isEmpty()) {
                cachedDriverStandings = mockDataService.getMockDriverStandings();
            }
            if (cachedConstructorStandings.isEmpty()) {
                cachedConstructorStandings = mockDataService.getMockConstructorStandings();
            }

        } catch (Exception e) {
            // On error, use mock data
            cachedDriverStandings = mockDataService.getMockDriverStandings();
            cachedConstructorStandings = mockDataService.getMockConstructorStandings();
        }
    }

    // -------------------------
    // Cached getters
    // -------------------------

    public List<DriverDTO> getDrivers() {
        return cachedDrivers;
    }

    public List<ConstructorDTO> getConstructors() {
        return cachedConstructors;
    }

    public List<RaceDTO> getRaceSchedule() {
        return cachedSchedule;
    }

    public List<RaceDTO> getUpcomingRaces() {
        return cachedUpcoming;
    }

    public RaceDTO getNextRace() {
        return cachedNextRace;
    }

    public List<DriverStandingDTO> getDriverStandings() {
        return cachedDriverStandings;
    }

    public List<ConstructorStandingDTO> getConstructorStandings() {
        return cachedConstructorStandings;
    }

    /**
     * Cache race results per round
     */
    public List<RaceResultDTO> getRaceResults(String round) {

        return cachedRaceResults.computeIfAbsent(
                round,
                r -> jolpicaService.getRaceResults(r)
        );
    }

    /**
     * Cache race details per round - with fallback to mock data
     */
    public RaceDetailsDTO getRaceDetails(int round) {

        return cachedRaceDetails.computeIfAbsent(
                round,
                r -> {
                    try {
                        RaceDetailsDTO details = jolpicaService.getRaceDetails(r);
                        // If no results, use mock data
                        if (details == null || details.getResults() == null || details.getResults().isEmpty()) {
                            return mockDataService.getMockRaceDetails(r);
                        }
                        return details;
                    } catch (Exception e) {
                        // On error, use mock data
                        return mockDataService.getMockRaceDetails(r);
                    }
                }
        );
    }

    @PostConstruct
    public void loadStaticData() {

        cachedDrivers = jolpicaService.getDrivers();
        cachedConstructors = jolpicaService.getConstructors();
        cachedSchedule = jolpicaService.getRaceSchedule();
        cachedUpcoming = jolpicaService.getUpcomingRaces();
        cachedNextRace = jolpicaService.getNextRace();
        
        // Load mock standings on startup
        try {
            cachedDriverStandings = jolpicaService.getDriverStandings();
            cachedConstructorStandings = jolpicaService.getConstructorStandings();
            
            if (cachedDriverStandings.isEmpty()) {
                cachedDriverStandings = mockDataService.getMockDriverStandings();
                System.out.println("Loaded mock driver standings (" + cachedDriverStandings.size() + " drivers)");
            }
            if (cachedConstructorStandings.isEmpty()) {
                cachedConstructorStandings = mockDataService.getMockConstructorStandings();
                System.out.println("Loaded mock constructor standings (" + cachedConstructorStandings.size() + " teams)");
            }
        } catch (Exception e) {
            cachedDriverStandings = mockDataService.getMockDriverStandings();
            cachedConstructorStandings = mockDataService.getMockConstructorStandings();
            System.out.println("Using mock data for standings due to API error");
        }
    }
}