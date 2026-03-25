package com.f12026.Formula1.apiConfig.service;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Component
public class OpenF1RateLimiter {

    private static final int MAX_REQUESTS_PER_MINUTE = 25;

    private AtomicInteger requestCount = new AtomicInteger(0);
    private long minuteStart = System.currentTimeMillis();

    public synchronized void acquire() {

        long now = System.currentTimeMillis();

        if (now - minuteStart > 60000) {
            minuteStart = now;
            requestCount.set(0);
        }

        if (requestCount.get() >= MAX_REQUESTS_PER_MINUTE) {

            long waitTime = 60000 - (now - minuteStart);

            try {
                Thread.sleep(waitTime);
            } catch (InterruptedException ignored) {}

            minuteStart = System.currentTimeMillis();
            requestCount.set(0);
        }

        requestCount.incrementAndGet();
    }
}