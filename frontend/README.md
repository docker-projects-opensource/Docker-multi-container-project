# Frontend Component

This is the frontend component of our Docker learning project. It's a simple Nginx web server that serves static HTML, CSS, and JavaScript files.

========
# Tag frontend
docker tag 3tier-docker-compose-project-frontend arunponugotii/frontend:latestmvp

# Tag backend
docker tag 3tier-docker-compose-project-backend arunponugotii/backend:latestmvp

# Tag database
docker tag 3tier-docker-compose-project-database arunponugotii/database:latest
# Push frontend
docker push arunponugotii/frontend:latestmvp

# Push backend
docker push arunponugotii/backend:latestmvp

# Push database
docker push YOUR_DOCKERHUB_USERNAME/database:latest

=======
## What is this?

This component is responsible for the user interface of our application. It provides a simple web interface where users can view and add messages.

## Why Nginx?

Nginx is a lightweight, high-performance web server that's perfect for serving static content. It's also commonly used as a reverse proxy, which makes it ideal for routing requests to our backend API.

## How it works

1. Nginx serves static files from the `/usr/share/nginx/html` directory
2. JavaScript in the browser makes AJAX requests to the backend API
3. Nginx is configured to proxy API requests to the backend service

## Docker Implementation

The Dockerfile uses a multi-stage build approach:
1. First stage copies the static files to a temporary location
2. Second stage uses the Nginx base image and copies the configuration and static files
3. This approach results in a smaller final image because it doesn't include any build tools or intermediary files

## Connection to Other Containers

- This container connects to the backend container through the `frontend-network`
- It communicates with the backend on port 3000
- The Nginx configuration proxies API requests to the backend service

## Port Configuration

- The Nginx server runs on port 80 inside the container
- This is mapped to port 8080 on the host in the docker-compose.yml file
- Users access the application at http://localhost:8080

## Volume Management

This container doesn't use volumes because:
1. The static content is built into the image
2. There's no persistent data that needs to be stored

## Environment Variables

This container doesn't require environment variables as its configuration is static. The connection to the backend is done using Docker's internal DNS system, which resolves the service name "backend" to the appropriate container IP.