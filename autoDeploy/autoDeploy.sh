#!/bin/sh

unset GIT_DIR

echo "======================"
echo "Start deployment"
echo "pulling source code..."
git pull origin master
echo "Pull finished"
cnpm install
npm run deploy
echo "build completed"
echo "pm2 reload completed"