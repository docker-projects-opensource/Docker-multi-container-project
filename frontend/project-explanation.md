# Frontend Service

## What is this?

The Frontend service is the part of our application that users see and interact with in their web browser. It's a simple website that:
- Shows a message board where users can see all messages
- Provides a form where users can add new messages
- Sends user inputs to the Backend service for processing

Think of it as the "face" of our application - it's all the visual elements and user interactions.

## Technologies Used

This service uses:
- **Nginx**: A lightweight, fast web server that delivers our HTML, CSS, and JavaScript files to users' browsers
- **HTML**: The structure of our webpage
- **CSS**: The styling that makes our webpage look nice
- **JavaScript**: Code that runs in the user's browser to make the page interactive

## How It Works

1. When you visit the application website, Nginx serves the HTML, CSS, and JavaScript files to your browser
2. Your browser loads these files and displays the message board application
3. When you view messages, JavaScript in your browser requests data from the Backend service
4. When you add a new message, JavaScript collects your input and sends it to the Backend service

## Docker Implementation

This service runs inside a Docker container. Here's what that means:

- **Docker Image**: We build a custom image based on the official Nginx image
- **Multi-stage Build**: The Dockerfile uses a two-stage process to create a smaller, more efficient image:
  - First stage: Prepares the static files (HTML, CSS, JS)
  - Second stage: Builds the final Nginx image with only the necessary files
- **Networking**: The container connects to the Backend container through an internal Docker network named `frontend-network`
- **Port Mapping**: The container exposes port 80 internally, which is mapped to port 8082 on your computer
- **Configuration**: We use a custom Nginx configuration to properly route API requests to the Backend service

## Key Files

- `Dockerfile`: Instructions for building the Docker image
- `nginx.conf`: Configuration for the Nginx web server
- `public/`: Directory containing the static files (HTML, CSS, JavaScript)
  - `index.html`: The main webpage structure
  - `style.css`: Styling for the webpage
  - `script.js`: JavaScript code for interactivity

## Docker Concepts Demonstrated

- **Docker Images**: A read-only template used to create containers
- **Multi-stage Builds**: A method to create smaller, more secure Docker images
- **Container Networking**: How containers communicate with each other
- **Port Mapping**: How to make services inside containers accessible from outside

## How to Interact With This Service

Once the application is running, you can:
1. Open your web browser and go to http://localhost:8082
2. View the existing messages displayed on the page
3. Use the form to add your own messages
4. Refresh the page to see all updated messages

## Relationship to Other Services

The Frontend service:
- Depends on the Backend service to process API requests
- Doesn't directly interact with the Database service (it goes through the Backend)
- Is the only service directly accessible by users through their web browsers

## Understanding the Dockerfile

```dockerfile
# Stage 1: Build stage (for organizing files)
FROM alpine:3.14 as build

# Create working directory
WORKDIR /app

# Copy the public directory to the build stage
COPY ./public /app/public
COPY ./nginx.conf /app/nginx.conf

# Stage 2: Production stage
FROM nginx:1.21-alpine

# Copy the static files from the build stage
COPY --from=build /app/public /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
```

This Dockerfile demonstrates:
1. **Multi-stage builds**: We use two stages to keep our final image small
2. **Base images**: We use Alpine Linux which is small and secure
3. **File copying**: We carefully copy only what we need for the final image
4. **Port exposure**: We tell Docker that our container listens on port 80
