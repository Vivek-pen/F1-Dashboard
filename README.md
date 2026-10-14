# Formula 1 2026 Dashboard

## Project Overview
This project is a comprehensive full-stack application designed to display, analyze, and replay Formula 1 data for the 2026 season. It consists of a robust Spring Boot backend handling data persistence and real-time telemetry streaming, coupled with a modern React frontend providing an interactive user interface.

## Architecture

### Backend: Formula1
The backend service is located in the `Formula1` directory and provides RESTful APIs alongside WebSocket endpoints for live data processing.
* Technology Stack: Java 17, Spring Boot 3.5.11
* Key Modules:
  * Spring Web for REST framework
  * Spring Data JPA for persistent data management
  * Spring WebFlux for reactive operations
  * Spring WebSocket for real-time telemetry streaming
  * PostgreSQL for the relational database management system
  * Lombok for code boilerplate reduction

### Frontend: f1-dashboard
The client-side application is located in the `f1-dashboard` directory and acts as the presentation layer.
* Technology Stack: React 19, Vite
* Key Modules:
  * TailwindCSS v4 for utility-first styling and responsive design
  * React Router DOM for component routing
  * Axios for standard HTTP client requests
  * STOMP.js for consuming WebSocket messages
  * Lucide React for consistent iconography

## Features
* Home Dashboard: A centralized view of the application.
* Drivers and Teams Profiles: Access specific information regarding team rosters and driver statistics.
* Championship Standings: Up-to-date tracking of constructor and driver points.
* Race Calendar and Details: Historical results and schedule information.
* Telemetry Replay: Real-time race data visualization relying on WebSocket integration.

## Prerequisites
Ensure the following tools are installed on your environment:
* Java Development Kit (JDK) 17
* Node.js (v18 or newer recommended)
* PostgreSQL
* Maven (optional, as the Maven wrapper is provided)

## Setup and Installation

### 1. Database Configuration
1. Start your local PostgreSQL server.
2. Create a new database named `F1`.
3. The system defaults to the following credentials format:
   * URL: `jdbc:postgresql://localhost:5432/F1`
   * Username: `postgres`
   * Password: ``
4. Modify the `Formula1/src/main/resources/application.properties` file if your local database credentials differ.

### 2. Backend Initialization
1. Navigate to the backend directory:
   ```bash
   cd Formula1
   ```
2. Start the Spring Boot application using the provided wrapper (ensure the database is running):
   ```bash
   ./mvnw spring-boot:run
   ```
   *Note: On Windows environments, execute `mvnw.cmd spring-boot:run`.*
3. The server will initialize and begin listening on port `9090`.

### 3. Frontend Initialization
1. Open a new terminal instance and navigate to the frontend directory:
   ```bash
   cd f1-dashboard
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Open the provided localhost URL in your web browser to view the application.

## System Configuration Details
Notable application properties include:
* `server.port=9090`: Defines the backend communication port.
* `telemetry.mode=replay`: Specifies the telemetry service behavior.
* `telemetry.refresh=1000`: Sets the polling or refresh interval to 1000 milliseconds.
