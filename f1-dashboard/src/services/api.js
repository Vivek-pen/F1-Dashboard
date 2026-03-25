// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9090/api', // Keep your existing port
  timeout: 10000,
});

export const getDrivers = () => api.get('/drivers');
export const getTeams = () => api.get('/teams');
export const getDriverStandings = () => api.get('/standings/drivers');
export const getConstructorStandings = () => api.get('/standings/constructors');

// --- UPDATED ENDPOINTS ---
export const getRaces = () => api.get('/races');
export const getUpcomingRaces = () => api.get('/races/upcoming');
export const getNextRace = () => api.get('/races/next'); 
export const getRaceDetails = (round) => api.get(`/races/${round}`); 
export const getLiveLeaderboard = () => api.get('/live/leaderboard');
export const getLiveTrack = () => api.get('/live/track');