# Database Component

This is the database component of our Docker learning project. It's a PostgreSQL database that stores data for our application.

## What is this?

The database component is responsible for persistently storing all the messages in our application. PostgreSQL is a powerful, open-source relational database system that's perfect for this task.

## Why PostgreSQL?

PostgreSQL is an excellent choice for this project because:
- It's robust and reliable
- Has excellent support for JSON data
- Is widely used in production environments
- Works well in containerized environments

## How it works

1. The PostgreSQL server runs inside the container
2. Data is stored in a persistent volume
3. The initialization script creates the necessary tables on first run
4. The backend connects to this database to store and retrieve data

## Docker Implementation

The Dockerfile extends the official PostgreSQL image and adds:
- Custom initialization scripts to set up the schema and initial data
- Configuration optimized for a containerized environment

## Connection to Other Containers

- Connected to the backend container through the `backend-network`
- The backend container connects to this database using the service name `database`
- Database credentials are passed through environment variables

## Port Configuration

- PostgreSQL runs on port 5432 inside the container
- The port is not exposed to the host for security
- Only the backend container can communicate with the database

## Volume Management

- Uses a Docker volume named `postgres-data`
- Mounted at `/var/lib/postgresql/data` in the container
- Ensures data survives container restarts or removals
- This is a key part of data persistence in Docker

## Environment Variables

The database uses several environment variables:
- `POSTGRES_USER`: The database user
- `POSTGRES_PASSWORD`: The database password
- `POSTGRES_DB`: The database name

These are set in the docker-compose.yml file and passed to the container at runtime from the `.env` file.