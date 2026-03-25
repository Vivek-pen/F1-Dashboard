package com.f12026.Formula1.model;

import jakarta.persistence.*;

@Entity
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String nationality;
    private Integer driverNumber;

    @ManyToOne
    private Team team;
}