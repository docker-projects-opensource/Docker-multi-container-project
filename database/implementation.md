# Database Implementation Details

## Design Decisions

1. **PostgreSQL**: Using PostgreSQL for its reliability and features
2. **Initialization Script**: Using an init script to set up the database schema
3. **Docker Volume**: Using a volume for data persistence
4. **Environment Variables**: Using environment variables for configuration

## Implementation Process

1. Extend the official PostgreSQL Docker image
2. Add an initialization script to create the database schema
3. Configure the Docker volume for data persistence
4. Configure environment variables for security

## Technical Details

### Database Schema

The database has a simple schema with a single table:
- `messages`: Stores all messages in the application
  - `id`: Primary key
  - `author`: Message author
  - `content`: Message content
  - `created_at`: Timestamp when the message was created

### Initialization Process

When a PostgreSQL container is first started, it looks for `.sql`, `.sql.gz`, or `.sh` scripts in the `/docker-entrypoint-initdb.d/` directory and executes them. We use this feature to:

1. Create our tables if they don't exist
2. Add some initial data

This happens automatically when the container is first created.

### Docker Volume

- Uses a volume named `postgres-data`
- Mounted at `/var/lib/postgresql/data` in the container
- This is where PostgreSQL stores its data files
- When the container is removed and recreated, the data remains intact
- This is a key concept in Docker for data persistence

The volume is managed by Docker and can be viewed with:
```
docker volume ls
```

You can also inspect the volume with:
```
docker volume inspect postgres-data
```

### Security

- Database credentials are passed through environment variables
- These variables are defined in the root `.env` file
- They're shared with the backend container through Docker Compose
- The database port is not exposed to the host
- Only containers on the same network can access the database

### Multi-stage Build Consideration

For the database, a multi-stage build isn't necessary because:
1. We're extending a well-optimized official image
2. We're not building any code
3. The initialization script is small and doesn't require a build phase

This demonstrates that you don't always need multi-stage builds for simple components.