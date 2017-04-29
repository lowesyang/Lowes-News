#!/bin/sh

echo "======================"
echo "Start deployment"
echo "pulling source code..."
git pull origin master
git checkout master
echo "Pull finished"
npm run deploy
echo "build completed"
echo "pm2 reload completed"