package com.f12026.Formula1.dto;

public class RaceDTO {

    private int round;
    private String raceName;
    private String circuitName;
    private String locality;
    private String country;
    private String raceDateTime;

    private String qualifyingTime;
    private String sprintQualifyingTime;
    private String sprintRaceTime;


    public RaceDTO() {}

    public RaceDTO(int round, String raceName, String circuitName,
                   String locality, String country, String raceDateTime,String qualifyingTime,String sprintQualifyingTime,String sprintRaceTime) {
        this.round = round;
        this.raceName = raceName;
        this.circuitName = circuitName;
        this.locality = locality;
        this.country = country;
        this.raceDateTime = raceDateTime;
        this.qualifyingTime = qualifyingTime;
        this.sprintRaceTime = sprintRaceTime;
        this.sprintQualifyingTime = sprintQualifyingTime;
    }

    public int getRound() { return round; }
    public void setRound(int round) { this.round = round; }

    public String getRaceName() { return raceName; }
    public void setRaceName(String raceName) { this.raceName = raceName; }

    public String getCircuitName() { return circuitName; }
    public void setCircuitName(String circuitName) { this.circuitName = circuitName; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getRaceDateTime() {
        return raceDateTime;
    }

    public void setRaceDateTime(String raceDateTime) {
        this.raceDateTime = raceDateTime;
    }

    public String getQualifyingTime() {
        return qualifyingTime;
    }

    public void setQualifyingTime(String qualifyingTime) {
        this.qualifyingTime = qualifyingTime;
    }

    public String getSprintQualifyingTime() {
        return sprintQualifyingTime;
    }

    public void setSprintQualifyingTime(String sprintQualifyingTime) {
        this.sprintQualifyingTime = sprintQualifyingTime;
    }

    public String getSprintRaceTime() {
        return sprintRaceTime;
    }

    public void setSprintRaceTime(String sprintRaceTime) {
        this.sprintRaceTime = sprintRaceTime;
    }
}