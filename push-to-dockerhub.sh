#!/bin/bash

# Push Docker images to Docker Hub
# Usage: ./push-to-dockerhub.sh [your-dockerhub-username]

set -e

DOCKERHUB_USER=${1:-your-username}

if [ "$DOCKERHUB_USER" == "your-username" ]; then
    echo "❌ Please provide your Docker Hub username:"
    echo "   ./push-to-dockerhub.sh your-username"
    exit 1
fi

echo "🐳 Pushing to Docker Hub..."
echo "Username: $DOCKERHUB_USER"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Login to Docker Hub
echo -e "${BLUE}🔐 Logging into Docker Hub...${NC}"
docker login -u $DOCKERHUB_USER

# Build and push backend
echo -e "${BLUE}🔨 Building backend...${NC}"
cd backend
docker build -t $DOCKERHUB_USER/ecom-backend:latest .
docker tag $DOCKERHUB_USER/ecom-backend:latest $DOCKERHUB_USER/ecom-backend:$(date +%Y%m%d)
echo -e "${BLUE}📤 Pushing backend...${NC}"
docker push $DOCKERHUB_USER/ecom-backend:latest
docker push $DOCKERHUB_USER/ecom-backend:$(date +%Y%m%d)
cd ..

# Build and push frontend
echo -e "${BLUE}🔨 Building frontend...${NC}"
VITE_API_URL=${VITE_API_URL:-http://localhost:8080}
docker build --build-arg VITE_API_URL=$VITE_API_URL -t $DOCKERHUB_USER/ecom-frontend:latest .
docker tag $DOCKERHUB_USER/ecom-frontend:latest $DOCKERHUB_USER/ecom-frontend:$(date +%Y%m%d)
echo -e "${BLUE}📤 Pushing frontend...${NC}"
docker push $DOCKERHUB_USER/ecom-frontend:latest
docker push $DOCKERHUB_USER/ecom-frontend:$(date +%Y%m%d)

echo ""
echo -e "${GREEN}✅ Images pushed successfully!${NC}"
echo ""
echo "Images available at:"
echo "  - $DOCKERHUB_USER/ecom-backend:latest"
echo "  - $DOCKERHUB_USER/ecom-frontend:latest"
echo ""
echo "To use these images, update docker-compose.yml with:"
echo "  image: $DOCKERHUB_USER/ecom-backend:latest"
echo "  image: $DOCKERHUB_USER/ecom-frontend:latest"
