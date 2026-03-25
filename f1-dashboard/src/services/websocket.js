// src/services/websocket.js
import { Client } from '@stomp/stompjs';

export const connectLiveTelemetry = (onMessageReceived) => {
  const client = new Client({
    brokerURL: 'ws://localhost:9090/ws/live-race', // Your Spring Boot WS endpoint
    reconnectDelay: 5000, // Auto-reconnect if the server drops
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    
    onConnect: () => {
      console.log('✅ Connected to F1 Live Telemetry');
      
      // Subscribe to the topic your backend is broadcasting on
      client.subscribe('/topic/live-telemetry', (message) => {
        if (message.body) {
          const telemetryData = JSON.parse(message.body);
          onMessageReceived(telemetryData);
        }
      });
    },
    
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
  });

  client.activate();
  
  // Return a cleanup function so React can disconnect when leaving the page
  return () => {
    if (client.active) {
      client.deactivate();
      console.log('❌ Disconnected from Telemetry');
    }
  };
};