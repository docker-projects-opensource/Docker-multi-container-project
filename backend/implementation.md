# Backend Implementation Details

## Design Decisions

1. **Express Framework**: Using Express for its simplicity and middleware support
2. **PostgreSQL Client**: Using the `pg` library to connect to PostgreSQL
3. **Environment Variables**: Using environment variables for configuration
4. **Docker Volumes**: Using a volume for logs to persist them across container restarts

## Implementation Process

1. Set up a basic Express server
2. Create routes for getting and posting messages
3. Implement database connection and queries
4. Create a multi-stage Dockerfile
5. Configure networking in docker-compose.yml

## Technical Details

### Server Organization

The server code is organized as follows:
- `server.js`: Main entry point that starts the Express server
- Database connection and API endpoint logic are all contained in this file for simplicity

### Database Interaction

The backend connects to the PostgreSQL database using the `pg` library:
- Connection details come from environment variables
- Queries are simple SELECT and INSERT operations
- Connection pooling is used for efficiency

### API Endpoints

The API provides two main endpoints:
- `GET /api/messages`: Retrieves all messages from the database
- `POST /api/messages`: Adds a new message to the database

### Docker Networking

- Connected to `frontend-network` to receive requests from the frontend
- Connected to `backend-network` to send queries to the database
- Uses the service name `database` to connect to the database container
  
This demonstrates how Docker's internal DNS resolves service names to container IPs.

### Docker Volumes

- Uses a volume named `backend-logs` for persistent log storage
- Mounted at `/app/logs` in the container
- The server writes logs to this directory
- Logs persist even if the container is removed

### Multi-stage Dockerfile Explanation

The Dockerfile uses a multi-stage build:
1. Build stage
   - Installs all dependencies (including dev dependencies)
   - Prepares the application

2. Production stage
   - Starts from a clean Node.js Alpine image
   - Installs only production dependencies
   - Copies only necessary files from the build stage
   - Sets up proper user permissions

This approach results in a smaller, more secure final image.

### Container Security

- The container runs as a non-root user (node)
- Only production dependencies are installed
- The image is based on Alpine Linux for a smaller attack surface