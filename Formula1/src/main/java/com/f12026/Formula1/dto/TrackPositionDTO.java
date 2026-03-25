package com.f12026.Formula1.dto;

public class TrackPositionDTO {

    private int driverNumber;
    private double x;
    private double y;
    private int position;

    public TrackPositionDTO() {
    }

    public TrackPositionDTO(int driverNumber, double x, double y, int position) {
        this.driverNumber = driverNumber;
        this.x = x;
        this.y = y;
        this.position = position;
    }

    public int getDriverNumber() {
        return driverNumber;
    }

    public void setDriverNumber(int driverNumber) {
        this.driverNumber = driverNumber;
    }

    public double getX() {
        return x;
    }

    public void setX(double x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }
}
