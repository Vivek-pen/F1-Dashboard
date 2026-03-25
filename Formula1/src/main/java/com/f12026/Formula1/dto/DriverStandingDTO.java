package com.f12026.Formula1.dto;

public class DriverStandingDTO {

    private int position;
    private String driverName;
    private String constructorName;
    private int points;
    private int wins;

    public DriverStandingDTO() {}

    public DriverStandingDTO(int position, String driverName,
                             String constructorName, int points, int wins) {
        this.position = position;
        this.driverName = driverName;
        this.constructorName = constructorName;
        this.points = points;
        this.wins = wins;
    }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getConstructorName() { return constructorName; }
    public void setConstructorName(String constructorName) { this.constructorName = constructorName; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public int getWins() { return wins; }
    public void setWins(int wins) { this.wins = wins; }
}
