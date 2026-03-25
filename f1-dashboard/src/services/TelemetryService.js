// src/services/TelemetryService.js
import axios from 'axios';

// Ensure your base URL matches your Spring Boot configuration
const api = axios.create({
  baseURL: 'http://localhost:8080/api', 
});

export const TelemetryService = {
  getLiveTrack: () => api.get('/live/track'),
  getLiveLeaderboard: () => api.get('/live/leaderboard'),
  
  // Static Endpoints (for reference/usage elsewhere)
  getDrivers: () => api.get('/drivers'),
  getTeams: () => api.get('/teams'),
  getRaces: () => api.get('/races'),
  getUpcomingRaces: () => api.get('/races/upcoming'),
  getNextRace: () => api.get('/races/next'),
  getRaceDetails: (round) => api.get(`/races/${round}`),
  getDriverStandings: () => api.get('/standings/drivers'),
  getConstructorStandings: () => api.get('/standings/constructors'),
};