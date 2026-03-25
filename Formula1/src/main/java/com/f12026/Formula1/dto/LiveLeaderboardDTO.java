package com.f12026.Formula1.dto;

public class LiveLeaderboardDTO {

    private int position;
    private int driverNumber;

    private String driverName;
    private String teamName;

    private String lastLapTime;
    private String tireCompound;
    private boolean pitStop;

    private String gap;        // gap to leader
    private String interval;

    // getters and setters


    public LiveLeaderboardDTO() {
    }

    public LiveLeaderboardDTO(int position, int driverNumber, String driverName, String teamName, String lastLapTime, String tireCompound, boolean pitStop, String gap, String interval) {
        this.position = position;
        this.driverNumber = driverNumber;
        this.driverName = driverName;
        this.teamName = teamName;
        this.lastLapTime = lastLapTime;
        this.tireCompound = tireCompound;
        this.pitStop = pitStop;
        this.gap = gap;
        this.interval = interval;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }

    public int getDriverNumber() {
        return driverNumber;
    }

    public void setDriverNumber(int driverNumber) {
        this.driverNumber = driverNumber;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getLastLapTime() {
        return lastLapTime;
    }

    public void setLastLapTime(String lastLapTime) {
        this.lastLapTime = lastLapTime;
    }

    public String getTireCompound() {
        return tireCompound;
    }

    public void setTireCompound(String tireCompound) {
        this.tireCompound = tireCompound;
    }

    public boolean isPitStop() {
        return pitStop;
    }

    public void setPitStop(boolean pitStop) {
        this.pitStop = pitStop;
    }

    public String getGap() {
        return gap;
    }

    public void setGap(String gap) {
        this.gap = gap;
    }

    public String getInterval() {
        return interval;
    }

    public void setInterval(String interval) {
        this.interval = interval;
    }
}