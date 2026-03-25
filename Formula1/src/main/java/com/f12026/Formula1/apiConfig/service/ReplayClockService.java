package com.f12026.Formula1.apiConfig.service;

import org.springframework.stereotype.Service;

@Service
public class ReplayClockService {

    private final long replayStart = System.currentTimeMillis();

    public long getReplayElapsed() {
        return System.currentTimeMillis() - replayStart;
    }
}