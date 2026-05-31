#!/bin/bash
# DCPL Database Backup Script
# Run daily via cron: 0 2 * * * /path/to/dcpl/scripts/backup-db.sh
#
# Usage: ./scripts/backup-db.sh [backup-dir]
# Default backup dir: ./backups

set -euo pipefail

DB_FILE="${DB_PATH:-$(dirname "$0")/../data.db}"
BACKUP_DIR="${1:-$(dirname "$0")/../backups}"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/data_$DATE.db"
KEEP_DAYS=30

mkdir -p "$BACKUP_DIR"

if [ ! -f "$DB_FILE" ]; then
  echo "ERROR: Database not found at $DB_FILE"
  exit 1
fi

# Use SQLite online backup (safe even while server is running)
sqlite3 "$DB_FILE" ".backup '$BACKUP_FILE'"

# Compress
gzip "$BACKUP_FILE"
echo "✓ Backup saved: ${BACKUP_FILE}.gz"

# Prune backups older than KEEP_DAYS days
find "$BACKUP_DIR" -name "data_*.db.gz" -mtime "+$KEEP_DAYS" -delete
echo "✓ Pruned backups older than $KEEP_DAYS days"
