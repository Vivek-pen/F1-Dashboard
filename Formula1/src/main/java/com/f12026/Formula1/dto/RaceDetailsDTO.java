package com.f12026.Formula1.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RaceDetailsDTO {

        private int round;
        private String raceName;
        private String circuitName;
        private String locality;
        private String country;

        private String raceDateTime;

        private List<RaceResultDTO> results;

        private RaceResultDTO winner;
        private RaceResultDTO second;
        private RaceResultDTO third;
}
