package com.f12026.Formula1.dto;

public class LivePositionDTO {

    private int position;
    private int driverNumber;
    private String fullName;
    private String teamName;
    private int lapNumber;

    public LivePositionDTO() {}

    public LivePositionDTO(int position, int driverNumber,
                           String fullName, String teamName, int lapNumber) {
        this.position = position;
        this.driverNumber = driverNumber;
        this.fullName = fullName;
        this.teamName = teamName;
        this.lapNumber = lapNumber;
    }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }

    public int getDriverNumber() { return driverNumber; }
    public void setDriverNumber(int driverNumber) { this.driverNumber = driverNumber; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public int getLapNumber() { return lapNumber; }
    public void setLapNumber(int lapNumber) { this.lapNumber = lapNumber; }
}