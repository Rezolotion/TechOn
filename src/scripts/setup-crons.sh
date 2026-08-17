#!/usr/bin/env bash
# TechOn Cron Setup & Background Runner

NODE_BIN=$(which node 2>/dev/null || echo "/home/rezolotion/.nvm/versions/node/v20.20.2/bin/node")
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "Setting up crons for TechOn in $PROJECT_DIR using Node: $NODE_BIN"

# Check if crontab is available
CRON_CMD_1="0 * * * * cd $PROJECT_DIR && $NODE_BIN src/scripts/cron-hourly-test.js >> logs/hourly-test.log 2>&1"
CRON_CMD_2="30 * * * * cd $PROJECT_DIR && $NODE_BIN src/scripts/cron-architecture-check.js >> logs/architecture-audit.log 2>&1"

echo "Configuring crontab entries..."
(crontab -l 2>/dev/null | grep -v "TechOn"; echo "$CRON_CMD_1"; echo "$CRON_CMD_2") | crontab -

echo "✅ Crontab installed successfully!"
echo "Hourly test runs at minute 00 of every hour."
echo "Architecture compliance check runs at minute 30 of every hour."
