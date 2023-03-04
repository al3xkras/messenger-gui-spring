FROM openjdk:8-jdk-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
ARG JAR_FILE=./target/messenger-gui-service-1.1.jar
COPY ${JAR_FILE} ui-service.jar
ENTRYPOINT ["java", "-jar", "-Dfile.encoding=UTF-8", "-Dspring.profiles.active=default", "-Dmysql-host=host.docker.internal", "/ui-service.jar"]