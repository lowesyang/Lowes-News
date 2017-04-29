#!/bin/sh

echo "======================"
echo "Start deployment"
echo "pulling source code..."
git pull origin master
git checkout master
echo "Pull finished"
npm run build
echo "build completed"
pm2 reload lowesnews
echo "pm2 reload completed"