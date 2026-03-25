package com.f12026.Formula1.apiConfig.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class CircuitMapService {

    private static final Map<String, CircuitMap> CIRCUIT_MAPS = new HashMap<>();

    static {
        CIRCUIT_MAPS.put("monaco", new CircuitMap("Circuit de Monaco", "🇲🇨", new double[][]{
            {0, 0}, {50, 0}, {100, 0}, {150, 0}, {200, 0}, {250, 0}, {280, -20}, {300, -50}, {310, -85}, {310, -120},
            {310, -160}, {310, -200}, {305, -240}, {295, -275}, {280, -300}, {260, -315}, {235, -325}, {205, -330},
            {170, -330}, {140, -325}, {115, -310}, {95, -290}, {80, -265}, {70, -235}, {65, -205}, {60, -175},
            {55, -145}, {48, -115}, {40, -85}, {30, -60}, {15, -40}, {-5, -25}, {-25, -15}, {-45, -10},
            {-75, -5}, {-110, 0}, {-150, 5}, {-195, 10}, {-240, 15}, {-285, 20}, {-330, 25}, {-370, 28},
            {-405, 30}, {-435, 30}, {-460, 28}, {-480, 22}, {-495, 10}, {-505, -5}, {-510, -25}, {-510, -45},
            {-508, -65}, {-500, -80}, {-485, -90}, {-465, -95}, {-440, -100}, {-410, -100}, {-380, -95}, {-355, -85},
            {-335, -70}, {-320, -50}, {-310, -25}, {-305, 0}, {-305, 25}, {-310, 50}, {-320, 70}, {-335, 85},
            {-355, 95}, {-380, 100}, {-410, 100}, {-435, 95}, {-455, 85}, {-470, 70}, {-480, 50}, {-485, 25},
            {-485, 0}, {-480, -25}, {-470, -45}, {-455, -60}, {-430, -70}, {-400, -75}, {-360, -75}, {-320, -70},
            {-280, -60}, {-240, -45}, {-200, -30}, {-160, -15}, {-120, -5}, {-80, 0}, {-40, 0}
        }, "-550 -380 700 550"));

        CIRCUIT_MAPS.put("silverstone", new CircuitMap("Silverstone Circuit", "🇬🇧", new double[][]{
            {0, 0}, {80, 0}, {160, 0}, {220, -30}, {260, -70}, {280, -120}, {280, -180}, {260, -230}, 
            {220, -270}, {160, -300}, {80, -300}, {0, -300}, {-80, -300}, {-140, -270}, {-180, -230}, 
            {-200, -180}, {-200, -120}, {-180, -70}, {-140, -30}, {-80, 0}
        }, "-250 -350 550 400"));

        CIRCUIT_MAPS.put("spa", new CircuitMap("Circuit de Spa-Francorchamps", "🇧🇪", new double[][]{
            {0, 0}, {50, -30}, {90, -80}, {110, -140}, {110, -200}, {90, -260}, {50, -310}, {-10, -340}, 
            {-80, -350}, {-150, -340}, {-210, -310}, {-250, -260}, {-270, -200}, {-270, -140}, {-250, -80}, 
            {-210, -30}, {-150, 0}, {-80, 10}, {-10, 0}
        }, "-320 -400 450 450"));

        CIRCUIT_MAPS.put("monza", new CircuitMap("Autodromo Nazionale di Monza", "🇮🇹", new double[][]{
            {0, 0}, {100, 0}, {200, 0}, {280, -40}, {320, -100}, {320, -180}, {280, -240}, {200, -280}, 
            {100, -280}, {0, -280}, {-80, -240}, {-120, -180}, {-120, -100}, {-80, -40}, {0, 0}
        }, "-170 -330 540 380"));

        CIRCUIT_MAPS.put("suzuka", new CircuitMap("Suzuka International Racing Course", "🇯🇵", new double[][]{
            {0, 0}, {60, -20}, {110, -60}, {140, -110}, {150, -170}, {140, -230}, {110, -280}, {60, -320}, 
            {0, -340}, {-60, -340}, {-110, -320}, {-150, -280}, {-170, -230}, {-170, -170}, {-150, -110}, 
            {-110, -60}, {-60, -20}, {0, 0}
        }, "-220 -390 420 440"));

        CIRCUIT_MAPS.put("interlagos", new CircuitMap("Autódromo José Carlos Pace", "🇧🇷", new double[][]{
            {0, 0}, {70, 0}, {130, -30}, {170, -80}, {180, -140}, {160, -200}, {110, -240}, {40, -260}, 
            {-30, -260}, {-100, -240}, {-150, -200}, {-170, -140}, {-160, -80}, {-120, -30}, {-60, 0}
        }, "-220 -310 450 360"));

        CIRCUIT_MAPS.put("yas marina", new CircuitMap("Yas Marina Circuit", "🇦🇪", new double[][]{
            {0, 0}, {80, 0}, {150, -20}, {200, -60}, {220, -120}, {210, -180}, {170, -230}, {110, -260}, 
            {40, -270}, {-30, -260}, {-90, -230}, {-130, -180}, {-140, -120}, {-120, -60}, {-70, -20}, {0, 0}
        }, "-190 -320 460 370"));

        CIRCUIT_MAPS.put("bahrain", new CircuitMap("Bahrain International Circuit", "🇧🇭", new double[][]{
            {0, 0}, {100, 0}, {180, -40}, {220, -100}, {220, -180}, {180, -240}, {100, -280}, {0, -280}, 
            {-80, -240}, {-120, -180}, {-120, -100}, {-80, -40}, {0, 0}
        }, "-170 -330 440 380"));

        CIRCUIT_MAPS.put("jeddah", new CircuitMap("Jeddah Corniche Circuit", "🇸🇦", new double[][]{
            {0, 0}, {120, 0}, {230, -30}, {310, -90}, {350, -170}, {340, -260}, {280, -330}, {180, -370}, 
            {60, -380}, {-60, -370}, {-160, -330}, {-220, -260}, {-230, -170}, {-190, -90}, {-110, -30}, {0, 0}
        }, "-280 -430 680 480"));

        CIRCUIT_MAPS.put("austin", new CircuitMap("Circuit of The Americas", "🇺🇸", new double[][]{
            {0, 0}, {50, -40}, {70, -100}, {60, -170}, {20, -230}, {-40, -260}, {-110, -260}, {-170, -230}, 
            {-210, -170}, {-220, -100}, {-200, -40}, {-150, 0}, {-80, 20}, {0, 20}
        }, "-270 -310 520 370"));
    }

    public CircuitMap getCircuitMap(String circuitName) {
        if (circuitName == null) return CIRCUIT_MAPS.get("monaco");
        
        String key = circuitName.toLowerCase()
            .replace("circuit de ", "")
            .replace("autodromo nazionale di ", "")
            .replace("autódromo josé carlos pace", "interlagos")
            .replace(" circuit", "")
            .replace(" international racing course", "")
            .replace(" corniche", "")
            .trim();

        return CIRCUIT_MAPS.getOrDefault(key, CIRCUIT_MAPS.get("monaco"));
    }

    public static class CircuitMap {
        private String name;
        private String flag;
        private double[][] trackPoints;
        private String viewBox;

        public CircuitMap(String name, String flag, double[][] trackPoints, String viewBox) {
            this.name = name;
            this.flag = flag;
            this.trackPoints = trackPoints;
            this.viewBox = viewBox;
        }

        public String getName() { return name; }
        public String getFlag() { return flag; }
        public double[][] getTrackPoints() { return trackPoints; }
        public String getViewBox() { return viewBox; }
    }
}
