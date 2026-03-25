package com.f12026.Formula1.dto;


public class RaceResultDTO {

    private int position;
    private String driverName;
    private String constructorName;
    private int points;
    private String status;

    public RaceResultDTO() {}

    public RaceResultDTO(int position, String driverName,
                         String constructorName, int points, String status) {
        this.position = position;
        this.driverName = driverName;
        this.constructorName = constructorName;
        this.points = points;
        this.status = status;
    }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getConstructorName() { return constructorName; }
    public void setConstructorName(String constructorName) { this.constructorName = constructorName; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}