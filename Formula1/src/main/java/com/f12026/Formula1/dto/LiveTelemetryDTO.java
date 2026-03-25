package com.f12026.Formula1.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LiveTelemetryDTO {

    private int driverNumber;
    private double x;
    private double y;
    private int position;
    private int positionChange;

    public int getDriverNumber() { return driverNumber; }
    public void setDriverNumber(int driverNumber) { this.driverNumber = driverNumber; }

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }

    public int getPositionChange() { return positionChange; }
    public void setPositionChange(int positionChange) { this.positionChange = positionChange; }
}