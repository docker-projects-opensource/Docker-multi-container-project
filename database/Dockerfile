# Use the official PostgreSQL image as the base image
FROM postgres:13-alpine

# Default environment variables (these will be overridden by docker-compose)
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=messages

# Copy initialization SQL script
# This script will be executed when the container is first started
# The entrypoint.sh script in the base image automatically runs any *.sql files
# found in /docker-entrypoint-initdb.d/
COPY init.sql /docker-entrypoint-initdb.d/

# The official postgres image already sets up a volume at /var/lib/postgresql/data
# We don't need to explicitly define it here as it's handled in docker-compose.yml

# Expose port 5432
EXPOSE 5432

# The base image already has a CMD that starts PostgreSQL