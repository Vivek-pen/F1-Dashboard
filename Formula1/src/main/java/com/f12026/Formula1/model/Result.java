package com.f12026.Formula1.model;

import jakarta.persistence.*;

@Entity
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer position;
    private Integer points;

    @ManyToOne
    private Driver driver;

    @ManyToOne
    private Race race;

}