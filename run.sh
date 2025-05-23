#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# PID files
SERVER_PID_FILE=".server.pid"
CLIENT_PID_FILE=".client.pid"

# Function to display usage
show_usage() {
    echo -e "${BLUE}TribeMiner Control Script${NC}"
    echo -e "${YELLOW}Usage:${NC}"
    echo "  ./run.sh start    - Start both server and client"
    echo "  ./run.sh stop     - Stop both server and client"
    echo "  ./run.sh restart  - Restart both server and client"
    echo "  ./run.sh status   - Show status of both processes"
    echo "  ./run.sh help     - Show this help message"
}

# Function to start processes
start_processes() {
    echo -e "${GREEN}Starting TribeMiner...${NC}"
    
    # Check if processes are already running
    if [ -f "$SERVER_PID_FILE" ] || [ -f "$CLIENT_PID_FILE" ]; then
        echo -e "${YELLOW}Warning: Some processes may already be running. Use 'stop' first.${NC}"
    fi
    
    # Start server
    echo -e "${BLUE}Starting server...${NC}"
    npm run server > server.log 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > $SERVER_PID_FILE
    echo -e "${GREEN}Server started with PID: $SERVER_PID${NC}"
    
    # Wait a moment for server to start
    sleep 2
    
    # Start client
    echo -e "${BLUE}Starting client...${NC}"
    npm run dev > client.log 2>&1 &
    CLIENT_PID=$!
    echo $CLIENT_PID > $CLIENT_PID_FILE
    echo -e "${GREEN}Client started with PID: $CLIENT_PID${NC}"
    
    echo -e "${GREEN}✅ TribeMiner is running!${NC}"
    echo -e "${BLUE}Server:${NC} http://localhost:3000"
    echo -e "${BLUE}Client:${NC} http://localhost:5173"
    echo -e "${YELLOW}Logs:${NC} server.log and client.log"
}

# Function to stop processes
stop_processes() {
    echo -e "${YELLOW}Stopping TribeMiner...${NC}"
    
    # Stop server
    if [ -f "$SERVER_PID_FILE" ]; then
        SERVER_PID=$(cat $SERVER_PID_FILE)
        if kill -0 $SERVER_PID 2>/dev/null; then
            kill $SERVER_PID
            echo -e "${GREEN}Server stopped (PID: $SERVER_PID)${NC}"
        else
            echo -e "${YELLOW}Server process not found${NC}"
        fi
        rm -f $SERVER_PID_FILE
    fi
    
    # Stop client
    if [ -f "$CLIENT_PID_FILE" ]; then
        CLIENT_PID=$(cat $CLIENT_PID_FILE)
        if kill -0 $CLIENT_PID 2>/dev/null; then
            kill $CLIENT_PID
            echo -e "${GREEN}Client stopped (PID: $CLIENT_PID)${NC}"
        else
            echo -e "${YELLOW}Client process not found${NC}"
        fi
        rm -f $CLIENT_PID_FILE
    fi
    
    # Kill any remaining processes
    pkill -f "npm run server" 2>/dev/null
    pkill -f "npm run dev" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    pkill -f "node src/backend/server.js" 2>/dev/null
    
    echo -e "${GREEN}✅ TribeMiner stopped!${NC}"
}

# Function to show status
show_status() {
    echo -e "${BLUE}TribeMiner Status:${NC}"
    
    # Check server
    if [ -f "$SERVER_PID_FILE" ]; then
        SERVER_PID=$(cat $SERVER_PID_FILE)
        if kill -0 $SERVER_PID 2>/dev/null; then
            echo -e "${GREEN}✅ Server running (PID: $SERVER_PID)${NC}"
        else
            echo -e "${RED}❌ Server not running${NC}"
            rm -f $SERVER_PID_FILE
        fi
    else
        echo -e "${RED}❌ Server not running${NC}"
    fi
    
    # Check client
    if [ -f "$CLIENT_PID_FILE" ]; then
        CLIENT_PID=$(cat $CLIENT_PID_FILE)
        if kill -0 $CLIENT_PID 2>/dev/null; then
            echo -e "${GREEN}✅ Client running (PID: $CLIENT_PID)${NC}"
        else
            echo -e "${RED}❌ Client not running${NC}"
            rm -f $CLIENT_PID_FILE
        fi
    else
        echo -e "${RED}❌ Client not running${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}URLs:${NC}"
    echo -e "Server: http://localhost:3000"
    echo -e "Client: http://localhost:5173"
}

# Function to restart processes
restart_processes() {
    echo -e "${YELLOW}Restarting TribeMiner...${NC}"
    stop_processes
    sleep 2
    start_processes
}

# Main script logic
case "$1" in
    start)
        start_processes
        ;;
    stop)
        stop_processes
        ;;
    restart)
        restart_processes
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        echo -e "${RED}Error: Invalid command '$1'${NC}"
        echo ""
        show_usage
        exit 1
        ;;
esac 