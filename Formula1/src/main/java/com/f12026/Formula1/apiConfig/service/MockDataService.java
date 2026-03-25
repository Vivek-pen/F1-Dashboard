package com.f12026.Formula1.apiConfig.service;

import com.f12026.Formula1.dto.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MockDataService {

    /**
     * Generate realistic driver standings based on 2024 season performance
     */
    public List<DriverStandingDTO> getMockDriverStandings() {
        List<DriverStandingDTO> standings = new ArrayList<>();
        
        standings.add(new DriverStandingDTO(1, "Max Verstappen", "Red Bull Racing", 437, 9));
        standings.add(new DriverStandingDTO(2, "Charles Leclerc", "Ferrari", 319, 3));
        standings.add(new DriverStandingDTO(3, "Lando Norris", "McLaren", 307, 3));
        standings.add(new DriverStandingDTO(4, "Oscar Piastri", "McLaren", 269, 2));
        standings.add(new DriverStandingDTO(5, "Carlos Sainz", "Ferrari", 259, 2));
        standings.add(new DriverStandingDTO(6, "George Russell", "Mercedes", 217, 2));
        standings.add(new DriverStandingDTO(7, "Lewis Hamilton", "Mercedes", 208, 2));
        standings.add(new DriverStandingDTO(8, "Sergio Perez", "Red Bull Racing", 152, 0));
        standings.add(new DriverStandingDTO(9, "Fernando Alonso", "Aston Martin", 68, 0));
        standings.add(new DriverStandingDTO(10, "Nico Hulkenberg", "Haas F1 Team", 41, 0));
        standings.add(new DriverStandingDTO(11, "Yuki Tsunoda", "RB", 30, 0));
        standings.add(new DriverStandingDTO(12, "Pierre Gasly", "Alpine", 26, 0));
        standings.add(new DriverStandingDTO(13, "Lance Stroll", "Aston Martin", 24, 0));
        standings.add(new DriverStandingDTO(14, "Esteban Ocon", "Alpine", 23, 0));
        standings.add(new DriverStandingDTO(15, "Kevin Magnussen", "Haas F1 Team", 16, 0));
        standings.add(new DriverStandingDTO(16, "Alexander Albon", "Williams", 12, 0));
        standings.add(new DriverStandingDTO(17, "Daniel Ricciardo", "RB", 12, 0));
        standings.add(new DriverStandingDTO(18, "Oliver Bearman", "Ferrari", 7, 0));
        standings.add(new DriverStandingDTO(19, "Franco Colapinto", "Williams", 5, 0));
        standings.add(new DriverStandingDTO(20, "Zhou Guanyu", "Kick Sauber", 4, 0));
        standings.add(new DriverStandingDTO(21, "Liam Lawson", "RB", 4, 0));
        standings.add(new DriverStandingDTO(22, "Valtteri Bottas", "Kick Sauber", 0, 0));
        standings.add(new DriverStandingDTO(23, "Logan Sargeant", "Williams", 0, 0));
        
        return standings;
    }

    /**
     * Generate realistic constructor standings
     */
    public List<ConstructorStandingDTO> getMockConstructorStandings() {
        List<ConstructorStandingDTO> standings = new ArrayList<>();
        
        standings.add(new ConstructorStandingDTO(1, "McLaren", 666, 6, "#FF8700"));
        standings.add(new ConstructorStandingDTO(2, "Ferrari", 652, 5, "#DC0000"));
        standings.add(new ConstructorStandingDTO(3, "Red Bull Racing", 589, 9, "#0600EF"));
        standings.add(new ConstructorStandingDTO(4, "Mercedes", 425, 4, "#00D2BE"));
        standings.add(new ConstructorStandingDTO(5, "Aston Martin", 94, 0, "#006F62"));
        standings.add(new ConstructorStandingDTO(6, "Alpine", 65, 0, "#0090FF"));
        standings.add(new ConstructorStandingDTO(7, "Haas F1 Team", 58, 0, "#FFFFFF"));
        standings.add(new ConstructorStandingDTO(8, "RB", 46, 0, "#2B4562"));
        standings.add(new ConstructorStandingDTO(9, "Williams", 17, 0, "#005AFF"));
        standings.add(new ConstructorStandingDTO(10, "Kick Sauber", 4, 0, "#00E701"));
        
        return standings;
    }

    /**
     * Generate race details for a specific round
     */
    public RaceDetailsDTO getMockRaceDetails(int round) {
        // Monaco GP (Round 8 in 2024)
        if (round == 8) {
            RaceDetailsDTO details = new RaceDetailsDTO();
            details.setRound(8);
            details.setRaceName("Monaco Grand Prix");
            details.setCircuitName("Circuit de Monaco");
            details.setLocality("Monte Carlo");
            details.setCountry("Monaco");
            details.setRaceDateTime("2024-05-26T15:00:00Z");
            
            List<RaceResultDTO> results = new ArrayList<>();
            results.add(createResult(1, "Charles Leclerc", "Ferrari", 25));
            results.add(createResult(2, "Oscar Piastri", "McLaren", 18));
            results.add(createResult(3, "Carlos Sainz", "Ferrari", 15));
            results.add(createResult(4, "Lando Norris", "McLaren", 12));
            results.add(createResult(5, "George Russell", "Mercedes", 10));
            results.add(createResult(6, "Max Verstappen", "Red Bull Racing", 8));
            results.add(createResult(7, "Lewis Hamilton", "Mercedes", 6));
            results.add(createResult(8, "Yuki Tsunoda", "RB", 4));
            results.add(createResult(9, "Alexander Albon", "Williams", 2));
            results.add(createResult(10, "Pierre Gasly", "Alpine", 1));
            results.add(createResult(11, "Fernando Alonso", "Aston Martin", 0));
            results.add(createResult(12, "Daniel Ricciardo", "RB", 0));
            results.add(createResult(13, "Valtteri Bottas", "Kick Sauber", 0));
            results.add(createResult(14, "Lance Stroll", "Aston Martin", 0));
            results.add(createResult(15, "Logan Sargeant", "Williams", 0));
            results.add(createResult(16, "Kevin Magnussen", "Haas F1 Team", 0));
            results.add(createResult(17, "Nico Hulkenberg", "Haas F1 Team", 0));
            results.add(createResult(18, "Esteban Ocon", "Alpine", 0));
            results.add(createResult(19, "Sergio Perez", "Red Bull Racing", 0));
            
            details.setResults(results);
            details.setWinner(results.get(0));
            details.setSecond(results.get(1));
            details.setThird(results.get(2));
            
            return details;
        }
        
        // Abu Dhabi GP (Round 24 - Season Finale)
        if (round == 24) {
            RaceDetailsDTO details = new RaceDetailsDTO();
            details.setRound(24);
            details.setRaceName("Abu Dhabi Grand Prix");
            details.setCircuitName("Yas Marina Circuit");
            details.setLocality("Abu Dhabi");
            details.setCountry("United Arab Emirates");
            details.setRaceDateTime("2024-12-08T13:00:00Z");
            
            List<RaceResultDTO> results = new ArrayList<>();
            results.add(createResult(1, "Lando Norris", "McLaren", 26)); // +1 for fastest lap
            results.add(createResult(2, "Carlos Sainz", "Ferrari", 18));
            results.add(createResult(3, "Charles Leclerc", "Ferrari", 15));
            results.add(createResult(4, "Lewis Hamilton", "Mercedes", 12));
            results.add(createResult(5, "George Russell", "Mercedes", 10));
            results.add(createResult(6, "Max Verstappen", "Red Bull Racing", 8));
            results.add(createResult(7, "Oscar Piastri", "McLaren", 6));
            results.add(createResult(8, "Nico Hulkenberg", "Haas F1 Team", 4));
            results.add(createResult(9, "Fernando Alonso", "Aston Martin", 2));
            results.add(createResult(10, "Yuki Tsunoda", "RB", 1));
            results.add(createResult(11, "Pierre Gasly", "Alpine", 0));
            results.add(createResult(12, "Esteban Ocon", "Alpine", 0));
            results.add(createResult(13, "Valtteri Bottas", "Kick Sauber", 0));
            results.add(createResult(14, "Zhou Guanyu", "Kick Sauber", 0));
            results.add(createResult(15, "Kevin Magnussen", "Haas F1 Team", 0));
            results.add(createResult(16, "Alexander Albon", "Williams", 0));
            results.add(createResult(17, "Franco Colapinto", "Williams", 0));
            results.add(createResult(18, "Sergio Perez", "Red Bull Racing", 0));
            results.add(createResult(19, "Liam Lawson", "RB", 0));
            results.add(createResult(20, "Lance Stroll", "Aston Martin", 0));
            
            details.setResults(results);
            details.setWinner(results.get(0));
            details.setSecond(results.get(1));
            details.setThird(results.get(2));
            
            return details;
        }
        
        // Generic race result for other rounds
        return generateGenericRaceDetails(round);
    }
    
    private RaceResultDTO createResult(int position, String driverName, String constructor, int points) {
        RaceResultDTO result = new RaceResultDTO();
        result.setPosition(position);
        result.setDriverName(driverName);
        result.setConstructorName(constructor);
        result.setPoints(points);
        return result;
    }
    
    private RaceDetailsDTO generateGenericRaceDetails(int round) {
        RaceDetailsDTO details = new RaceDetailsDTO();
        details.setRound(round);
        details.setRaceName("Grand Prix Round " + round);
        details.setCircuitName("International Circuit");
        details.setLocality("City");
        details.setCountry("Country");
        details.setRaceDateTime("2024-06-01T13:00:00Z");
        
        List<RaceResultDTO> results = new ArrayList<>();
        results.add(createResult(1, "Max Verstappen", "Red Bull Racing", 25));
        results.add(createResult(2, "Charles Leclerc", "Ferrari", 18));
        results.add(createResult(3, "Lando Norris", "McLaren", 15));
        results.add(createResult(4, "Carlos Sainz", "Ferrari", 12));
        results.add(createResult(5, "Oscar Piastri", "McLaren", 10));
        results.add(createResult(6, "George Russell", "Mercedes", 8));
        results.add(createResult(7, "Lewis Hamilton", "Mercedes", 6));
        results.add(createResult(8, "Sergio Perez", "Red Bull Racing", 4));
        results.add(createResult(9, "Fernando Alonso", "Aston Martin", 2));
        results.add(createResult(10, "Nico Hulkenberg", "Haas F1 Team", 1));
        
        details.setResults(results);
        details.setWinner(results.get(0));
        details.setSecond(results.get(1));
        details.setThird(results.get(2));
        
        return details;
    }
}
