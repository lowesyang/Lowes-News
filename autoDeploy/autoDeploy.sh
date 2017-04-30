#!/bin/sh

unset GIT_DIR

echo "======================"
echo "Start deployment"
echo "pulling source code..."
git pull origin master
echo "Pull finished"
cnpm install
npm run deploy
echo "Deploy completed"
pm2 reload news_server
echo "pm2 reload completed"