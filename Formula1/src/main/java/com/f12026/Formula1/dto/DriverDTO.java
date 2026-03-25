package com.f12026.Formula1.dto;

public class DriverDTO {

    private String driverId;
    private String code;
    private String givenName;
    private String familyName;
    private String nationality;

    public String getConstructorName() {
        return constructorName;
    }

    public void setConstructorName(String constructorName) {
        this.constructorName = constructorName;
    }

    public String getTeamColor() {
        return teamColor;
    }

    public void setTeamColor(String teamColor) {
        this.teamColor = teamColor;
    }

    private String permanentNumber;
    private String constructorName;
    private String teamColor;

    public DriverDTO() {}

    public DriverDTO(String driverId, String code, String givenName,
                     String familyName, String nationality, String permanentNumber, String constructorName,String teamColor) {
        this.driverId = driverId;
        this.code = code;
        this.givenName = givenName;
        this.familyName = familyName;
        this.nationality = nationality;
        this.permanentNumber = permanentNumber;
        this.constructorName = constructorName;
        this.teamColor = teamColor;
    }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getGivenName() { return givenName; }
    public void setGivenName(String givenName) { this.givenName = givenName; }

    public String getFamilyName() { return familyName; }
    public void setFamilyName(String familyName) { this.familyName = familyName; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public String getPermanentNumber() { return permanentNumber; }
    public void setPermanentNumber(String permanentNumber) { this.permanentNumber = permanentNumber; }
}