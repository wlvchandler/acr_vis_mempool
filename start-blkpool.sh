#!/bin/bash
PORT=3000
cd /home/will/testcode/acr_interactive/blkpool-simulator

#lsof -ti:$PORT | xargs kill -9

nohup serve -s build -l $PORT > server.log 2>&1 &

echo "Running on port $PORT"
