# Use an official Maven image to build the app
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
# Download dependencies
RUN mvn dependency:go-offline
# Copy source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar backend-0.0.1-SNAPSHOT.jar
# Expose port
EXPOSE 8080
# Run the application
ENTRYPOINT ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
