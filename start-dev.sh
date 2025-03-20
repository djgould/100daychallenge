#!/bin/bash

# Colors for better output visibility
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Next.js is already running on any of the typical ports
for port in 3000 3001 3002 3003 3004; do
  # Check if a process is listening on the port
  if lsof -i:$port -sTCP:LISTEN > /dev/null 2>&1; then
    echo -e "${YELLOW}Next.js is already running on port $port${NC}"
    
    # Get the process ID
    pid=$(lsof -i:$port -sTCP:LISTEN | tail -n 1 | awk '{print $2}')
    
    # Get process information
    echo -e "${YELLOW}Running process details:${NC}"
    ps -p $pid -o pid,ppid,user,%cpu,%mem,start,time,command
    
    echo -e "\n${YELLOW}To stop this process, use:${NC} kill $pid"
    echo -e "${YELLOW}Or visit:${NC} http://localhost:$port"
    
    exit 0
  fi
done

# If no running instance was found, start the app
echo -e "${GREEN}No running Next.js instance found. Starting development server...${NC}"
npm run dev 