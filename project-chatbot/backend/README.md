# Backend Component

This is the backend component of our Docker learning project. It's a simple Node.js/Express API server that handles API requests from the frontend and interacts with the database.

## What is this?

The backend component is a RESTful API that provides endpoints for:
- Getting all messages (`GET /api/messages`)
- Adding a new message (`POST /api/messages`)

It serves as the middle layer between the frontend (what users see and interact with) and the database (where data is stored).

## Why Node.js/Express?

Node.js and Express provide a lightweight, efficient way to build web APIs. They're perfect for this simple project because:
- Easy to set up and use
- Great for JSON APIs
- Excellent middleware ecosystem
- Non-blocking I/O makes it efficient

## How it works

1. The Express server listens for HTTP requests on port 3000
2. When requests come in, they're routed to the appropriate handler
3. The handler interacts with the PostgreSQL database
4. Results are returned to the client as JSON

## Docker Implementation

The Dockerfile uses a multi-stage build approach:
1. First stage installs all dependencies and prepares the application
2. Second stage only includes production dependencies
3. The final image is based on Node.js Alpine for a smaller footprint

This approach results in a smaller, more secure final image.

## Connection to Other Containers

- Connects to the frontend container through the `frontend-network`
- Connects to the database container through the `backend-network`
- Uses environment variables for database connection details

## Port Configuration

- The Express server runs on port 3000 inside the container
- This is mapped to port 3000 on the host in the docker-compose.yml file
- The frontend container communicates with this container through the internal Docker network

## Volume Management

- Uses a volume named `backend-logs` mounted at `/app/logs`
- This ensures that logs persist even if the container is restarted or removed
- Helps with debugging and monitoring

## Environment Variables

The backend uses several environment variables:
- `NODE_ENV`: Sets the application environment (development/production)
- `PORT`: The port the server listens on
- Database connection details (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`)

These are set in the docker-compose.yml file and passed to the container at runtime.