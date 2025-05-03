# Database Service

## What is this?

The Database service is where our application stores all its data. It:
- Persistently saves all messages posted by users
- Organizes data in a structured way
- Allows the Backend to store and retrieve data efficiently
- Ensures data isn't lost when the application restarts

Think of it as the filing cabinet of our application - it stores information so we can find it again later.

## Technologies Used

This service uses:
- **PostgreSQL**: A powerful, open-source relational database system
- **SQL**: The language used to query and manipulate the database

## How It Works

1. The PostgreSQL server runs inside the container
2. When first started, it automatically creates the necessary tables using the `init.sql` script
3. It stores all its data files in a persistent volume
4. The Backend service connects to this database to:
   - Retrieve messages when users view the message board
   - Save new messages when users post them

## Database Schema

The database uses a simple structure:

**messages table**:
- `id`: A unique identifier for each message (automatically generated)
- `author`: The name of the person who wrote the message
- `content`: The text of the message
- `created_at`: When the message was posted

## Docker Implementation

This service runs inside a Docker container. Here's what that means:

- **Docker Image**: We build a custom image based on the official PostgreSQL image
- **Initialization**: When first started, it automatically runs the `init.sql` script to set up tables
- **Networking**: The container connects to the Backend container through an internal network (`backend-network`)
- **Volume**: Uses a persistent volume (`postgres-data`) to store the database files
- **Security**: 
  - Database credentials are passed via environment variables
  - The database port isn't exposed to the host computer
  - Only the Backend container can access the database

## Key Files

- `Dockerfile`: Instructions for building the Docker image
- `init.sql`: SQL script that runs when the container first starts
  - Creates the `messages` table if it doesn't exist
  - Adds some initial sample messages

## Docker Concepts Demonstrated

- **Data Persistence**: Using Docker volumes to store data long-term
- **Container Isolation**: Securing the database by not exposing it directly
- **Environment Variables**: Securely passing database credentials
- **Container Initialization**: Running setup scripts when a container first starts

## How to Interact With This Service

The Database service isn't directly accessible to users. Instead:
- The Backend service interacts with the Database on behalf of users
- Data is stored in the `postgres-data` volume, which persists even if the container is removed
- For development or debugging, you could connect to the database using a PostgreSQL client

## Relationship to Other Services

The Database service:
- Receives queries from the Backend service
- Stores all application data
- Doesn't directly interact with the Frontend service
- Is the most isolated component for security reasons

## Understanding the Dockerfile

```dockerfile
# Use the official PostgreSQL image as the base image
FROM postgres:13-alpine

# Default environment variables (these will be overridden by docker-compose)
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=messages

# Copy initialization SQL script
# This script will be executed when the container is first started
COPY init.sql /docker-entrypoint-initdb.d/

# Expose port 5432
EXPOSE 5432
```

This Dockerfile demonstrates:

1. **Base Image Usage**: We extend the official PostgreSQL image rather than building from scratch
2. **Environment Variables**: We set default values that can be overridden when deploying
3. **Initialization Scripts**: We use PostgreSQL's standard mechanism for initializing databases
4. **Docker Knowledge**: Understanding how the official PostgreSQL image works

## Understanding Docker Volumes for Databases

The database service uses a persistent volume to store data:

```yaml
volumes:
  - postgres-data:/var/lib/postgresql/data
```

This is crucial because:

1. Without this volume, all data would be lost when the container stops
2. The volume exists independently from the container
3. You can remove and recreate the database container without losing data
4. This is how Docker enables stateful applications
