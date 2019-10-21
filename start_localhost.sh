#!/bin/bash

echo "STARTING"
sudo lsof -t -i:3000
sudo meteor --port 3000 --allow-superuser --settings settings_localhost.json
