# Kubernetes 3-Tier Application Troubleshooting Guide

This document covers common issues, troubleshooting steps, and solutions when deploying a 3-tier application (Frontend, Backend, Database) to Kubernetes.

## Architecture Overview

Our application consists of:

- **Frontend**: NGINX serving static files and proxying API requests
- **Backend**: Node.js Express service connecting to PostgreSQL
- **Database**: PostgreSQL storing application data

## Common Issues and Solutions

### 1. NGINX Host Resolution Failure

#### Error
```
[emerg] host not found in upstream "backend" in /etc/nginx/conf.d/default.conf:14
```

#### Root Cause
NGINX is configured to proxy requests to a host named `backend`, but the Kubernetes service providing that backend has a different name (`backend-service`).

#### Solution Options

**Option 1**: Rename the service to match NGINX configuration
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend  # Changed from backend-service
spec:
  selector:
    app: backend
  ports:
    - port: 3000
```

**Option 2**: Update NGINX configuration to use the correct service name
```
# In NGINX default.conf, change
proxy_pass http://backend;
# to
proxy_pass http://backend-service:3000;
```

**Prevention Tip**: Always ensure service names in Kubernetes match exactly what's expected in application configurations.

### 2. Database Authentication Failure

#### Error
```
Error fetching messages: error: password authentication failed for user "postgres"
```

#### Root Cause
Environment variable naming mismatch between container conventions:
- PostgreSQL container uses `POSTGRES_PASSWORD`
- Node.js app uses `DB_PASSWORD`

#### Solution
Update the Kubernetes Secret to include variables for both naming conventions:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
stringData:
  # For PostgreSQL container
  POSTGRES_USER: "postgres"
  POSTGRES_PASSWORD: "secret_password"
  POSTGRES_DB: "messages"
  # For Node.js application
  DB_USER: "postgres"
  DB_PASSWORD: "secret_password"
  DB_NAME: "messages"
```

**Prevention Tip**: When connecting different systems, be aware that environment variable conventions may differ between applications.

### 3. Missing Database Schema/Tables

#### Error
```
Error: relation "messages" does not exist
```

#### Root Cause
When migrating from Docker Compose to Kubernetes, database initialization scripts aren't automatically carried over. In Docker Compose, initialization scripts in the `./database` directory might be automatically mounted to `/docker-entrypoint-initdb.d/` where PostgreSQL executes them.

#### Solution
1. Create a ConfigMap for database initialization:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-init-scripts
data:
  init.sql: |
    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        author VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    INSERT INTO messages (author, content) VALUES
    ('System', 'Welcome to the message board!');
```

2. Mount the ConfigMap to the database container:

```yaml
spec:
  template:
    spec:
      containers:
      - name: database
        # ...
        volumeMounts:
        - name: postgres-data
          mountPath: /var/lib/postgresql/data
        - name: postgres-init-scripts
          mountPath: /docker-entrypoint-initdb.d
      volumes:
      - name: postgres-init-scripts
        configMap:
          name: postgres-init-scripts
```

**Prevention Tip**: Always consider database initialization when migrating to Kubernetes. PostgreSQL only runs initialization scripts on first startup with an empty data directory.

## Port Forwarding in k3d

When using k3d (Kubernetes in Docker), additional port mapping is needed to access NodePort services from the host.

#### Solution Options

**Option 1**: Create cluster with port mapping
```bash
k3d cluster create myapp --api-port 6550 -p "30080:30080@loadbalancer"
```

**Option 2**: Update existing cluster
```bash
docker stop k3d-myapp-serverlb
docker update --publish 30080:30080 k3d-myapp-serverlb
docker start k3d-myapp-serverlb
```

**Option 3**: Use kubectl port-forward
```bash
kubectl port-forward svc/frontend-service 8080:80
```

## Useful Troubleshooting Commands

### Service and Pod Status
```bash
# List all pods and their status
kubectl get pods

# List all services
kubectl get svc

# Get detailed information about a pod
kubectl describe pod <pod-name>
```

### Log Inspection
```bash
# View logs for a specific pod
kubectl logs <pod-name>

# View logs for all pods with a specific label
kubectl logs -l app=backend

# Stream logs in real-time
kubectl logs -f <pod-name>
```

### Container Debugging
```bash
# Execute a command in a pod
kubectl exec -it <pod-name> -- <command>

# Get a shell in a pod
kubectl exec -it <pod-name> -- bash

# Check environment variables
kubectl exec -it <pod-name> -- env
```

### Testing Connectivity
```bash
# Test connectivity between pods
kubectl exec -it <source-pod> -- curl <destination-service>

# Test DNS resolution
kubectl exec -it <pod-name> -- nslookup <service-name>
```

## Common Kubernetes Gotchas

1. **Volume Persistence**: StatefulSet PVCs persist data even when pods are deleted. If you need a fresh database, you must delete the PVC.

2. **Namespace Isolation**: Services from different namespaces aren't directly accessible. Use fully-qualified names (`service.namespace.svc.cluster.local`).

3. **Image Pull Policy**: With local development, use `imagePullPolicy: IfNotPresent` or `Never` to use locally built images.

4. **Init Containers**: Consider using init containers for database schema initialization rather than relying on PostgreSQL's init scripts.

5. **Health Checks**: Implement readiness and liveness probes to ensure application availability and proper rolling updates.

## Conclusion

Most issues when moving to Kubernetes revolve around:
- Service discovery and naming
- Environment variable configuration
- Volume management and persistence
- Container initialization

By methodically troubleshooting these areas, most application deployment issues in Kubernetes can be resolved.