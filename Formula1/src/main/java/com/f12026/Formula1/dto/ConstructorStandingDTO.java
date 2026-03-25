package com.f12026.Formula1.dto;


public class ConstructorStandingDTO {

    private int position;
    private String constructorName;
    private int points;
    private int wins;
    private String teamColor;

    public ConstructorStandingDTO() {}

    public ConstructorStandingDTO(int position, String constructorName,
                                  int points, int wins,String teamColor) {
        this.position = position;
        this.constructorName = constructorName;
        this.points = points;
        this.wins = wins;
        this.teamColor = teamColor;
    }

    public String getTeamColor() {
        return teamColor;
    }

    public void setTeamColor(String teamColor) {
        this.teamColor = teamColor;
    }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }

    public String getConstructorName() { return constructorName; }
    public void setConstructorName(String constructorName) { this.constructorName = constructorName; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public int getWins() { return wins; }
    public void setWins(int wins) { this.wins = wins; }
}