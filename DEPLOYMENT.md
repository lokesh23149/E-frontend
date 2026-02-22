# AWS Deployment Guide

This guide covers deploying the e-commerce application to AWS using Docker.

## Prerequisites

- AWS Account
- AWS CLI configured
- Docker installed locally
- ECR repository created (or use Docker Hub)

## Architecture

- **Frontend**: React app served via Nginx
- **Backend**: Spring Boot API
- **Database**: MySQL (use AWS RDS for production)

## Step 1: Prepare Environment Variables

Create `.env.prod` file:

```bash
# Database (use RDS endpoint for production)
SPRING_DATASOURCE_URL=jdbc:mysql://your-rds-endpoint.region.rds.amazonaws.com:3306/e_com
SPRING_DATASOURCE_USERNAME=admin
SPRING_DATASOURCE_PASSWORD=your-secure-password
DB_NAME=e_com
DB_USER=admin
DB_PASSWORD=your-secure-password
DB_ROOT_PASSWORD=your-secure-password

# API Keys
GROQ_API_KEY=your-groq-key
OPENAI_API_KEY=your-openai-key

# Frontend
VITE_API_URL=https://api.yourdomain.com

# Ports
BACKEND_PORT=8080
FRONTEND_PORT=80
```

## Step 2: Build Docker Images

### Build Backend
```bash
cd backend
docker build -t ecom-backend:latest .
```

### Build Frontend
```bash
docker build --build-arg VITE_API_URL=https://api.yourdomain.com -t ecom-frontend:latest .
```

## Step 3: Push to AWS ECR

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com

# Tag images
docker tag ecom-backend:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/ecom-backend:latest
docker tag ecom-frontend:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/ecom-frontend:latest

# Push images
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/ecom-backend:latest
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/ecom-frontend:latest
```

## Step 4: Deploy to AWS ECS / EC2

### Option A: AWS ECS (Recommended)

1. Create ECS Cluster
2. Create Task Definition:
   - Use ECR images
   - Set environment variables from `.env.prod`
   - Configure health checks
3. Create Service:
   - Use Application Load Balancer
   - Configure target groups for frontend (port 80) and backend (port 8080)

### Option B: AWS EC2

1. Launch EC2 instance (Ubuntu 22.04)
2. Install Docker:
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
```

3. Copy files and deploy:
```bash
# Copy docker-compose.prod.yml and .env.prod
scp docker-compose.prod.yml .env.prod ec2-user@your-ec2-ip:~/

# SSH into EC2
ssh ec2-user@your-ec2-ip

# Pull images from ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com
docker pull your-account-id.dkr.ecr.us-east-1.amazonaws.com/ecom-backend:latest
docker pull your-account-id.dkr.ecr.us-east-1.amazonaws.com/ecom-frontend:latest

# Start services
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

## Step 5: Setup AWS RDS MySQL

1. Create RDS MySQL instance:
   - Engine: MySQL 8.0
   - Instance class: db.t3.micro (free tier) or larger
   - Storage: 20GB+
   - Public access: Yes (or use VPC)
   - Security group: Allow port 3306 from your ECS/EC2

2. Update `SPRING_DATASOURCE_URL` in `.env.prod` with RDS endpoint

## Step 6: Configure Load Balancer / Domain

### Application Load Balancer (ALB)

1. Create ALB
2. Create Target Groups:
   - Frontend: Port 80
   - Backend: Port 8080
3. Create Listeners:
   - Port 443 (HTTPS) → Frontend target group
   - Port 443 (HTTPS) → Backend target group (path: /api/*)
4. Add SSL certificate (ACM)

### Route 53 (Optional)

1. Create hosted zone
2. Create A record pointing to ALB

## Step 7: Security Groups

### Backend Security Group
- Inbound: Port 8080 from ALB
- Outbound: All traffic

### Frontend Security Group
- Inbound: Port 80, 443 from 0.0.0.0/0
- Outbound: All traffic

### RDS Security Group
- Inbound: Port 3306 from Backend Security Group
- Outbound: None

## Step 8: Environment Variables in AWS

For ECS, set these in Task Definition:

```
SPRING_DATASOURCE_URL=jdbc:mysql://rds-endpoint:3306/e_com
SPRING_DATASOURCE_USERNAME=admin
SPRING_DATASOURCE_PASSWORD=*** (use Secrets Manager)
GROQ_API_KEY=*** (use Secrets Manager)
VITE_API_URL=https://api.yourdomain.com
```

## Health Checks

- Frontend: `http://your-domain/health`
- Backend: `http://your-domain:8080/actuator/health`

## Monitoring

- CloudWatch Logs for containers
- CloudWatch Metrics for CPU/Memory
- RDS Performance Insights

## Troubleshooting

1. **Backend won't start**: Check RDS connectivity and credentials
2. **Frontend can't reach backend**: Verify VITE_API_URL and CORS settings
3. **Database connection failed**: Check security groups and RDS endpoint

## Cost Optimization

- Use ECS Fargate Spot for non-production
- Use RDS db.t3.micro for development
- Enable CloudFront CDN for frontend
- Use S3 for file uploads instead of local storage
