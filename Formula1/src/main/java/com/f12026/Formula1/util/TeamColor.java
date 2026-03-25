package com.f12026.Formula1.util;

import java.util.Map;

public class TeamColor {

    public static final Map<String, String> COLORS = Map.of(
            "Red Bull", "#1E41FF",
            "Ferrari", "#DC0000",
            "Mercedes", "#00D2BE",
            "McLaren", "#FF8700",
            "Aston Martin", "#006F62",
            "Alpine", "#0090FF",
            "Williams", "#005AFF",
            "RB", "#2B4562",
            "Sauber", "#52E252",
            "Haas", "#B6BABD"
    );

    public static String getColor(String team) {
        return COLORS.getOrDefault(team, "#333333");
    }
}