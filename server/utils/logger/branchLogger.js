const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');
const DailyRotateFile = require('winston-daily-rotate-file');

// Define custom log levels
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
  },
};

// Define the log directory and ensure it exists for branchLogger
const branchLogDir = path.join(__dirname, '..', '..', 'logs', 'Branch Logs');
if (!fs.existsSync(branchLogDir)) {
  fs.mkdirSync(branchLogDir, { recursive: true });
}

// Daily rotate file transport for branchLogger
const dailyRotateFileTransportBranch = new DailyRotateFile({
  filename: path.join(branchLogDir, 'Branch-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json() // For file logs
  ),
});

// Console transport with timestamp first for branchLogger
const consoleTransportBranch = new transports.Console({
  level: 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize(), // Add colors to the log levels
    format.printf(({ timestamp, level, message, ...meta }) => {
      let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
      if (Object.keys(meta).length) {
        logMessage += ` ${JSON.stringify(meta, (key, value) =>
          key === 'password' ? '***' : value // Mask sensitive data
        )}`;
      }
      return logMessage;
    })
  ),
});

// Create branchLogger
const branchLogger = createLogger({
  levels: customLevels.levels,
  transports: [
    dailyRotateFileTransportBranch,
    consoleTransportBranch,
  ],
});

// Apply colors to the console logs
require('winston').addColors(customLevels.colors);

module.exports = branchLogger;
