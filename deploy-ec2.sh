#!/bin/bash
# ==============================================================================
# Swadeshi Kitchen - Automated AWS EC2 Production Deployment Script
# Target Domain: swadeshikitchen.shop
# EC2 IP: 43.204.145.203
# ==============================================================================

set -e # Exit immediately if any command returns non-zero status

echo "🚀 Starting Production Deployment for Swadeshi Kitchen..."

# Step 1: Pull latest code from GitHub
echo "📦 1/7 Pulling latest commits from GitHub..."
git pull origin main

# Step 2: Install Frontend Dependencies & Build Production Bundle
echo "⚡ 2/7 Building Frontend Production Bundle..."
npm install
npm run build

# Step 3: Copy Production Build to /var/www/swadeshikitchen/dist
echo "📂 3/7 Deploying static build assets to /var/www/swadeshikitchen/dist..."
sudo mkdir -p /var/www/swadeshikitchen/dist
sudo cp -r dist/* /var/www/swadeshikitchen/dist/
sudo chown -R ec2-user:ec2-user /var/www/swadeshikitchen 2>/dev/null || true

# Step 4: Deploy Backend API with PM2
echo "⚙️ 4/7 Starting Backend API with PM2..."
cd backend
npm install
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js || pm2 start server.js --name "swadeshi-backend"
pm2 save

# Step 5: Copy Nginx Configuration
echo "🌐 5/7 Configuring Nginx Reverse Proxy..."
if [ -d "/etc/nginx/conf.d" ]; then
    sudo cp nginx.conf /etc/nginx/conf.d/swadeshikitchen.conf
fi

# Step 6: Test & Reload Nginx
echo "🔄 6/7 Testing and Reloading Nginx Web Server..."
sudo nginx -t
sudo systemctl reload nginx 2>/dev/null || sudo systemctl restart nginx 2>/dev/null || sudo service nginx reload

# Step 7: Local API Health Check
echo "🔍 7/7 Verifying Backend API Health..."
sleep 2
curl -f http://localhost:5000/health && echo ""

echo "=============================================================================="
echo "🎉 AWS EC2 DEPLOYMENT COMPLETE!"
echo "Website is live at: http://swadeshikitchen.shop or http://43.204.145.203"
echo "=============================================================================="
