package com.f12026.Formula1.apiConfig.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DriverMappingService {

    private final Map<Integer,String> driverNames = new HashMap<>();
    private final Map<Integer,String> teams = new HashMap<>();

    public void loadDrivers(String driversJson){

        try{

            ObjectMapper mapper = new ObjectMapper();
            JsonNode drivers = mapper.readTree(driversJson);

            for(JsonNode d : drivers){

                int number = d.path("driver_number").asInt();

                String name =
                        d.path("first_name").asText() + " " +
                                d.path("last_name").asText();

                String team = d.path("team_name").asText();

                driverNames.put(number,name);
                teams.put(number,team);
            }

        }catch(Exception ignored){}
    }

    public String getDriverName(int number){
        return driverNames.getOrDefault(number,"Driver " + number);
    }

    public String getTeam(int number){
        return teams.getOrDefault(number,"Unknown");
    }
}