# Deployment Guide - Innovertex Hackathon Platform

## Overview
This guide covers deploying the SQLite-based hackathon platform backend using Docker and production configurations.

## Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Git for version control

## Environment Configuration

### 1. Create Environment File
Copy the example environment file and configure it:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

#### Development Configuration (.env)
```env
NODE_ENV=development
PORT=5000
DATABASE_PATH=./database/hackathon.db
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-for-security-change-this
JWT_EXPIRATION=24h
CORS_ORIGIN=http://localhost:5173
SOCKET_CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

#### Production Configuration
```env
NODE_ENV=production
PORT=5000
DATABASE_PATH=/app/database/hackathon.db
JWT_SECRET=your-production-jwt-secret-key-minimum-32-characters-very-secure
JWT_EXPIRATION=24h
CORS_ORIGIN=https://your-frontend-domain.com
SOCKET_CORS_ORIGIN=https://your-frontend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=your-s3-bucket-name
AWS_REGION=us-east-1
```

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

This will:
- Start the server on port 5000
- Create SQLite database in `./database/hackathon.db`
- Automatically seed sample data
- Enable hot reload with nodemon

### 3. Reset Database (if needed)
```bash
# Linux/Mac
npm run reset-db

# Windows
npm run reset-db:win
```

### 4. Manual Seeding
```bash
npm run seed
```

## Docker Deployment

### 1. Build Docker Image
```bash
npm run docker:build
# or
docker build -t hackathon-backend .
```

### 2. Run with Docker Compose
```bash
npm run docker:run
# or
docker-compose up -d
```

### 3. View Logs
```bash
npm run docker:logs
# or
docker-compose logs -f hackathon-backend
```

### 4. Stop Services
```bash
npm run docker:stop
# or
docker-compose down
```

## Production Deployment

### 1. Server Setup
Ensure your server has:
- Docker and Docker Compose installed
- Proper firewall configuration (ports 80, 443, 5000)
- SSL certificates (for HTTPS)

### 2. Clone Repository
```bash
git clone https://github.com/your-org/innovertex-hackathon.git
cd innovertex-hackathon/backend
```

### 3. Configure Production Environment
```bash
cp .env.example .env
# Edit .env with production values
nano .env
```

### 4. Create Required Directories
```bash
mkdir -p database uploads logs
chmod 755 database uploads logs
```

### 5. Deploy with Docker Compose
```bash
# Production deployment with nginx
docker-compose --profile production up -d

# Or basic deployment without nginx
docker-compose up -d hackathon-backend
```

### 6. Verify Deployment
```bash
# Check container status
docker-compose ps

# Check logs
docker-compose logs hackathon-backend

# Test health endpoint
curl http://localhost:5000/health
```

## Database Management

### 1. SQLite Database Location
- Development: `./database/hackathon.db`
- Production: `./database/hackathon.db` (mounted volume)

### 2. Database Backup
```bash
# Create backup
cp database/hackathon.db database/hackathon-backup-$(date +%Y%m%d).db

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp database/hackathon.db backups/hackathon-$DATE.db
find backups/ -name "hackathon-*.db" -mtime +7 -delete
```

### 3. Database Migration
The application automatically handles database schema updates using Sequelize sync.

### 4. Database Reset (Production)
```bash
# CAUTION: This will delete all data
docker-compose down
rm database/hackathon.db
docker-compose up -d
```

## SSL/HTTPS Configuration

### 1. Obtain SSL Certificates
```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
```

### 2. Configure Nginx (Optional)
Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server hackathon-backend:5000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;

        location / {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Socket.io support
        location /socket.io/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## Monitoring and Logging

### 1. Application Logs
```bash
# View real-time logs
docker-compose logs -f hackathon-backend

# View specific number of lines
docker-compose logs --tail=100 hackathon-backend
```

### 2. Health Monitoring
The application includes a health check endpoint:
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-10-05T04:30:00.000Z",
  "environment": "production"
}
```

### 3. Performance Monitoring
Monitor key metrics:
- Response times
- Memory usage
- Database file size
- Active connections
- Error rates

### 4. Log Rotation
Configure log rotation to prevent disk space issues:
```bash
# Add to crontab
0 2 * * * docker-compose logs --no-color hackathon-backend > /var/log/hackathon-$(date +\%Y\%m\%d).log 2>&1
```

## Security Considerations

### 1. Environment Variables
- Use strong JWT secrets (minimum 32 characters)
- Never commit `.env` files to version control
- Rotate secrets regularly

### 2. Database Security
- Ensure database files have proper permissions (600)
- Regular backups to secure locations
- Monitor for unauthorized access

### 3. Network Security
- Use HTTPS in production
- Configure proper CORS origins
- Implement rate limiting
- Use firewall rules

### 4. Container Security
- Use non-root user in containers
- Keep base images updated
- Scan for vulnerabilities

## Troubleshooting

### 1. Common Issues

#### Database Connection Failed
```bash
# Check database file permissions
ls -la database/
# Ensure directory exists and is writable
mkdir -p database
chmod 755 database
```

#### Port Already in Use
```bash
# Check what's using port 5000
lsof -i :5000
# Kill process or change port in .env
```

#### Docker Build Fails
```bash
# Clean Docker cache
docker system prune -a
# Rebuild without cache
docker build --no-cache -t hackathon-backend .
```

#### Socket.io Connection Issues
- Verify CORS configuration
- Check firewall settings
- Ensure WebSocket support

### 2. Debug Mode
Enable debug logging:
```env
NODE_ENV=development
```

### 3. Database Issues
```bash
# Check database integrity
sqlite3 database/hackathon.db "PRAGMA integrity_check;"

# View database schema
sqlite3 database/hackathon.db ".schema"

# Check table contents
sqlite3 database/hackathon.db "SELECT COUNT(*) FROM users;"
```

## Performance Optimization

### 1. SQLite Optimizations
- WAL mode enabled for better concurrency
- Proper indexing on frequently queried columns
- Connection pooling configured

### 2. Application Optimizations
- Gzip compression enabled
- Rate limiting configured
- Efficient queries with proper includes

### 3. Docker Optimizations
- Multi-stage builds for smaller images
- Non-root user for security
- Health checks for reliability

## Backup and Recovery

### 1. Automated Backup Script
```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups"
DB_PATH="database/hackathon.db"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
cp $DB_PATH $BACKUP_DIR/hackathon-$DATE.db

# Compress backup
gzip $BACKUP_DIR/hackathon-$DATE.db

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "hackathon-*.db.gz" -mtime +30 -delete

echo "Backup completed: hackathon-$DATE.db.gz"
```

### 2. Recovery Process
```bash
# Stop application
docker-compose down

# Restore from backup
gunzip backups/hackathon-20251005_120000.db.gz
cp backups/hackathon-20251005_120000.db database/hackathon.db

# Restart application
docker-compose up -d
```

## Scaling Considerations

### 1. Horizontal Scaling
SQLite is not suitable for horizontal scaling. For high-traffic scenarios, consider:
- Migrating to PostgreSQL
- Implementing read replicas
- Using Redis for caching

### 2. Vertical Scaling
- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement caching strategies

### 3. Load Balancing
For multiple instances, use:
- Nginx load balancer
- Sticky sessions for Socket.io
- Shared database storage

This deployment guide ensures a robust, secure, and scalable deployment of the Innovertex Hackathon Platform backend.
