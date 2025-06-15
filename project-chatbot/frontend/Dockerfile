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

# No need to specify CMD as the nginx image already has a default CMD
# that starts the nginx server

