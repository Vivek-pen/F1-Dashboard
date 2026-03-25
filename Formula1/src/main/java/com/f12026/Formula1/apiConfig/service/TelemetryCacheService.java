package com.f12026.Formula1.apiConfig.service;

import com.f12026.Formula1.dto.LiveLeaderboardDTO;
import com.f12026.Formula1.dto.TrackPositionDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class TelemetryCacheService {

    private final OpenF1Service openF1Service;
    private final ReplayTrackSimulator simulator;
    private final ReplayService replayService;
    private final ReplayRaceService replayRaceService;

    @Value("${telemetry.mode}")
    private String mode;

    private volatile String cachedPositions = "[]";
    private volatile String cachedLaps = "[]";

    private volatile List<LiveLeaderboardDTO> cachedLeaderboard = Collections.emptyList();
    private volatile List<TrackPositionDTO> cachedTrack = Collections.emptyList();

    private final AtomicBoolean updating = new AtomicBoolean(false);

    public TelemetryCacheService(OpenF1Service openF1Service,
                                 ReplayTrackSimulator simulator,
                                 ReplayService replayService,
                                 ReplayRaceService replayRaceService) {

        this.openF1Service = openF1Service;
        this.simulator = simulator;
        this.replayService = replayService;
        this.replayRaceService = replayRaceService;
    }

    @Scheduled(fixedRateString = "${telemetry.refresh}")
    public void refreshTelemetry(){

        if(!updating.compareAndSet(false,true)){
            return;
        }

        try{

            if(mode.equals("replay")){

                if (replayRaceService.isPlaying()) {
                    replayRaceService.advanceLap();
                }

                cachedPositions = replayService.getPositions().toString();
                cachedLaps = replayService.getLaps().toString();
                cachedTrack = simulator.nextFrame();

            }else{

                cachedPositions = openF1Service.getLivePositions();
                cachedLaps = openF1Service.getLiveLaps();

                cachedTrack = openF1Service.buildTrackPositions(
                        openF1Service.getLiveLocations()
                );
            }

            cachedLeaderboard =
                    openF1Service.buildLiveLeaderboard(
                            cachedPositions,
                            cachedLaps
                    );

        }catch(Exception ignored){}

        finally{
            updating.set(false);
        }
    }

    public List<TrackPositionDTO> getTrack(){
        return cachedTrack;
    }

    public List<LiveLeaderboardDTO> getLeaderboard(){
        return cachedLeaderboard;
    }

    public String getPositions(){
        return cachedPositions;
    }
}
