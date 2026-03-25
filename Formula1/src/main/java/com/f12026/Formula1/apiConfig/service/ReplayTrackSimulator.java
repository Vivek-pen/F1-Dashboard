package com.f12026.Formula1.apiConfig.service;

import com.f12026.Formula1.dto.TrackPositionDTO;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReplayTrackSimulator {

    private static class CarState {
        int driverNumber;
        double progress;
        double speed;
        String teamName;
        double currentX;
        double currentY;
        double targetX;
        double targetY;
        long lastUpdateTime;
    }
    
    private final Map<Integer, CarState> cars = new HashMap<>();
    private final ReplayService replayService;
    private final CircuitMapService circuitMapService;
    private boolean initialized = false;
    
    private double[][] currentTrackPoints;
    private String currentCircuit = "monaco";
    
    public ReplayTrackSimulator(ReplayService replayService, CircuitMapService circuitMapService) {
        this.replayService = replayService;
        this.circuitMapService = circuitMapService;
        loadDefaultTrack();
    }
    
    private void loadDefaultTrack() {
        CircuitMapService.CircuitMap circuit = circuitMapService.getCircuitMap("monaco");
        currentTrackPoints = circuit.getTrackPoints();
    }
    
    public void setCircuit(String circuitName) {
        this.currentCircuit = circuitName;
        CircuitMapService.CircuitMap circuit = circuitMapService.getCircuitMap(circuitName);
        currentTrackPoints = circuit.getTrackPoints();
        initialized = false;
        cars.clear();
        System.out.println("Circuit changed to: " + circuit.getName());
    }
    
    private void initializeCars() {
        if (initialized) return;
        
        try {
            var positions = replayService.getPositions();
            
            if (positions != null && positions.isArray()) {
                Random random = new Random(42);
                long currentTime = System.currentTimeMillis();
                
                int carCount = 0;
                for (var pos : positions) {
                    int driverNumber = pos.path("driver_number").asInt();
                    int position = pos.path("position").asInt();
                    String teamName = pos.path("team_name").asText("Unknown");
                    
                    CarState car = new CarState();
                    car.driverNumber = driverNumber;
                    car.teamName = teamName;
                    car.progress = 0.75 - (position - 1) * 0.015;
                    car.speed = 0.008 + (20 - position) * 0.0001 + random.nextDouble() * 0.0002;
                    car.lastUpdateTime = currentTime;
                    
                    double[] pos2d = getPositionOnTrack(car.progress);
                    car.currentX = pos2d[0];
                    car.currentY = pos2d[1];
                    car.targetX = pos2d[0];
                    car.targetY = pos2d[1];
                    
                    cars.put(driverNumber, car);
                    carCount++;
                }
                
                initialized = true;
                System.out.println("Initialized " + carCount + " cars on " + currentCircuit);
            }
        } catch (Exception e) {
            System.err.println("Failed to initialize cars: " + e.getMessage());
        }
    }
    
    public List<TrackPositionDTO> nextFrame() {
        if (!initialized) {
            initializeCars();
        }
        
        if (cars.isEmpty()) {
            return Collections.emptyList();
        }
        
        List<TrackPositionDTO> frame = new ArrayList<>();
        long currentTime = System.currentTimeMillis();
        
        for (CarState car : cars.values()) {
            car.progress += car.speed;
            if (car.progress >= 1.0) {
                car.progress -= 1.0;
            }
            
            double[] targetPos = getPositionOnTrack(car.progress);
            car.targetX = targetPos[0];
            car.targetY = targetPos[1];
            
            double timeDelta = (currentTime - car.lastUpdateTime) / 1000.0;
            double interpolationSpeed = 0.3;
            
            car.currentX += (car.targetX - car.currentX) * interpolationSpeed;
            car.currentY += (car.targetY - car.currentY) * interpolationSpeed;
            car.lastUpdateTime = currentTime;
            
            TrackPositionDTO dto = new TrackPositionDTO();
            dto.setDriverNumber(car.driverNumber);
            dto.setX(car.currentX);
            dto.setY(car.currentY);
            
            frame.add(dto);
        }
        
        return frame;
    }
    
    private double[] getPositionOnTrack(double progress) {
        if (currentTrackPoints == null || currentTrackPoints.length == 0) {
            return new double[]{0, 0};
        }
        
        int totalPoints = currentTrackPoints.length;
        double exactIndex = progress * totalPoints;
        
        int index1 = (int) Math.floor(exactIndex) % totalPoints;
        int index2 = (index1 + 1) % totalPoints;
        
        double fraction = exactIndex - Math.floor(exactIndex);
        
        double[] p1 = currentTrackPoints[index1];
        double[] p2 = currentTrackPoints[index2];
        
        double t = fraction;
        double t2 = t * t;
        double t3 = t2 * t;
        
        int index0 = (index1 - 1 + totalPoints) % totalPoints;
        int index3 = (index2 + 1) % totalPoints;
        
        double[] p0 = currentTrackPoints[index0];
        double[] p3 = currentTrackPoints[index3];
        
        double x = 0.5 * (
            (2 * p1[0]) +
            (-p0[0] + p2[0]) * t +
            (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
            (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3
        );
        
        double y = 0.5 * (
            (2 * p1[1]) +
            (-p0[1] + p2[1]) * t +
            (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
            (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3
        );
        
        return new double[]{x, y};
    }
}
