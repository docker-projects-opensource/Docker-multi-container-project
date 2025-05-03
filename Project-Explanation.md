# Docker Learning Project

This project is designed to help you understand Docker by building a simple multi-container application. It demonstrates important Docker concepts through a practical example that you can run on your own computer.

## What is this project?

This is a simple message board application where users can:
- View messages posted by others
- Add their own messages

While the application itself is straightforward, the way it's built using Docker showcases many important container concepts and best practices.

## Project Components

The application consists of three main parts (containers):

1. **Frontend** - What users see in their browser
   - A simple website built with HTML, CSS, and JavaScript
   - Runs in an Nginx web server container

2. **Backend** - Processes requests and manages data
   - A Node.js/Express API server
   - Handles requests from the frontend
   - Communicates with the database

3. **Database** - Stores all the messages
   - A PostgreSQL database
   - Keeps data persistent using Docker volumes

## Docker Concepts You'll Learn

By exploring this project, you'll learn about:

- **Docker Containers**: Isolated environments that package everything an application needs to run
- **Docker Images**: Templates used to create containers
- **Docker Compose**: A tool for defining and running multi-container applications
- **Multi-stage Builds**: Creating efficient, secure Docker images
- **Container Networking**: How containers communicate with each other
- **Volumes & Persistence**: How to store data that survives container restarts
- **Environment Variables**: Configuring containers without changing code
- **Docker Best Practices**: Security, efficiency, and organization

## Project Structure

```
docker-learning-project/
├── docker-compose.yml      # Defines all services and how they work together
├── .env                    # Environment variables for the project
├── README.md               # Main documentation (this file)
├── frontend/               # The website users interact with
│   ├── Dockerfile
│   ├── nginx.conf 
│   └── public/             # HTML, CSS, JavaScript files
├── backend/                # The API service
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
└── database/               # The PostgreSQL database
    ├── Dockerfile
    └── init.sql
```

## Getting Started

1. **Prerequisites**:
   - Install [Docker](https://docs.docker.com/get-docker/)
   - Install [Docker Compose](https://docs.docker.com/compose/install/) (may be included with Docker Desktop)

2. **Run the application**:
   ```bash
   # Clone this repository
   git clone <repository-url>
   
   # Navigate to the project directory
   cd docker-learning-project
   
   # Start all services
   docker-compose up -d
   ```

3. **Access the application**:
   - Open your web browser and go to http://localhost:8082
   - You should see the message board with some initial messages
   - Try adding your own message!

4. **View logs and status**:
   ```bash
   # See container status
   docker-compose ps
   
   # View logs from all containers
   docker-compose logs
   
   # View logs from a specific service
   docker-compose logs backend
   ```

5. **Stop the application**:
   ```bash
   docker-compose down
   ```

## Networking

This project uses two Docker networks:

1. **frontend-network**: Connects the Frontend and Backend containers
2. **backend-network**: Connects the Backend and Database containers

This setup demonstrates how to:
- Isolate services that don't need to communicate directly
- Keep the database secure by not exposing it to the frontend

## Data Persistence

The application uses two Docker volumes:

1. **postgres-data**: Stores the database files
   - This ensures your messages aren't lost when containers restart

2. **backend-logs**: Stores application logs
   - Helps with debugging and monitoring

## How Data Flows Through the Application

When you use the application:

1. Your browser loads the Frontend from the Nginx container
2. When you view messages, JavaScript code:
   - Makes a request to the Backend API
   - The Backend queries the Database
   - The Database returns the messages
   - The Backend formats and sends them to the Frontend
   - The Frontend displays them in your browser

3. When you add a message:
   - The Frontend sends it to the Backend
   - The Backend validates and saves it to the Database
   - The page refreshes to show the updated list

## Learning Path

1. Start by understanding the overall architecture
2. Look at the `docker-compose.yml` file to see how services are connected
3. Examine each service's Dockerfile to understand how the images are built
4. Explore the application code to see how it interacts between containers
5. Try modifying parts of the application to deepen your understanding

## Common Docker Commands to Try

```bash
# List running containers
docker ps

# View logs from a container
docker logs <container-id>

# Get a shell inside a container
docker exec -it <container-id> sh

# List volumes
docker volume ls

# Inspect a volume to see where it's stored
docker volume inspect postgres-data

# List networks
docker network ls

# See containers connected to a network
docker network inspect frontend-network
```

## Further Learning

After understanding this project, you might want to:

1. Add a new feature to the application
2. Add a fourth service (like a Redis cache)
3. Learn about container orchestration with Kubernetes
4. Explore Docker Swarm for managing multiple Docker hosts
5. Set up CI/CD pipelines for containerized applications

## Troubleshooting

If you encounter issues:

1. Check container status with `docker-compose ps`
2. View logs with `docker-compose logs`
3. Ensure all required ports are available on your machine
4. Verify that Docker has enough resources allocated (especially on Docker Desktop)
5. Try stopping all containers (`docker-compose down`) and starting again
