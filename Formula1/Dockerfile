# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy the pom.xml and download dependencies first to optimize Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the project
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre
WORKDIR /app

# Load Environment Variables for Deployment
ENV DB_URL=jdbc:postgresql://ep-wandering-hill-a1hljsdk-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
ENV DB_USERNAME=neondb_owner
ENV DB_PASSWORD=npg_B3FKufWche1g
ENV FRONTEND_URL=https://f1-dashboard-eight.vercel.app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application port
EXPOSE 9090

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
