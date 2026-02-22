# 🐳 Docker Hub Deployment Guide

Push your Docker images to Docker Hub for easy sharing and deployment.

## Prerequisites

1. **Docker Hub Account**
   - Sign up at https://hub.docker.com
   - Create account (free)

2. **Docker Installed**
   - Docker Desktop or Docker Engine

## Quick Push

### Windows PowerShell
```powershell
.\push-to-dockerhub.ps1 your-dockerhub-username
```

### Linux/Mac
```bash
chmod +x push-to-dockerhub.sh
./push-to-dockerhub.sh your-dockerhub-username
```

## Manual Push Steps

### 1. Login to Docker Hub
```bash
docker login -u your-username
# Enter your password when prompted
```

### 2. Build Backend Image
```bash
cd backend
docker build -t your-username/ecom-backend:latest .
```

### 3. Tag Backend Image
```bash
docker tag your-username/ecom-backend:latest your-username/ecom-backend:latest
docker tag your-username/ecom-backend:latest your-username/ecom-backend:20250215
```

### 4. Push Backend Image
```bash
docker push your-username/ecom-backend:latest
docker push your-username/ecom-backend:20250215
```

### 5. Build Frontend Image
```bash
cd ..
docker build --build-arg VITE_API_URL=http://localhost:8080 -t your-username/ecom-frontend:latest .
```

### 6. Tag Frontend Image
```bash
docker tag your-username/ecom-frontend:latest your-username/ecom-frontend:latest
docker tag your-username/ecom-frontend:latest your-username/ecom-frontend:20250215
```

### 7. Push Frontend Image
```bash
docker push your-username/ecom-frontend:latest
docker push your-username/ecom-frontend:20250215
```

## Using Docker Hub Images

### Option 1: Update docker-compose.yml

Replace `build:` sections with `image:`:

```yaml
backend:
  image: your-username/ecom-backend:latest
  # Remove build: section

frontend:
  image: your-username/ecom-frontend:latest
  # Remove build: section
```

### Option 2: Use docker-compose.dockerhub.yml

```bash
# Set your Docker Hub username
export DOCKERHUB_USERNAME=your-username

# Use the Docker Hub compose file
docker-compose -f docker-compose.dockerhub.yml up -d
```

## Pull and Run Anywhere

Once pushed, anyone can pull and run:

```bash
# Pull images
docker pull your-username/ecom-backend:latest
docker pull your-username/ecom-frontend:latest

# Run with docker-compose.dockerhub.yml
docker-compose -f docker-compose.dockerhub.yml up -d
```

## Image Tags

- `latest` - Always points to most recent version
- `20250215` - Date-based tag (versioned)
- Custom tags - Use semantic versioning: `v1.0.0`

## Public vs Private Repositories

### Public (Default)
- Anyone can pull
- Free unlimited
- Good for open source/demos

### Private
- Requires authentication
- Free: 1 private repo
- Paid: Unlimited private repos

Make private:
1. Go to Docker Hub
2. Select repository
3. Settings → Make Private

## Best Practices

1. **Use version tags** - Don't rely only on `latest`
2. **Tag with dates** - `20250215` for tracking
3. **Use semantic versioning** - `v1.0.0`, `v1.1.0`
4. **Keep images small** - Multi-stage builds (already done)
5. **Scan for vulnerabilities** - Docker Hub auto-scans

## Troubleshooting

**Login failed?**
```bash
# Try logging out and back in
docker logout
docker login -u your-username
```

**Push denied?**
- Check repository name matches username
- Verify you're logged in: `docker info`
- Check repository exists on Docker Hub

**Image too large?**
- Use multi-stage builds (already configured)
- Remove unnecessary files (.dockerignore)
- Use .dockerignore (already configured)

## Sharing Your Demo

Once pushed, share:

```bash
# Share this command
docker-compose -f docker-compose.dockerhub.yml up -d

# Or direct pull
docker pull your-username/ecom-backend:latest
docker pull your-username/ecom-frontend:latest
```

## Next Steps

After pushing to Docker Hub:
1. ✅ Images are publicly available
2. ✅ Can deploy anywhere Docker runs
3. ✅ Easy to share with others
4. ✅ Ready for AWS ECS/EC2 deployment

---

**Your images are now on Docker Hub!** 🎉
