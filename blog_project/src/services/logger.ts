import pino from "pino";
import path from "path";
import fs from "fs";

// Define the path for the log file
const logFilePath = path.join(__dirname, "../../logs/app.log");

// Create a write stream to the log file
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

// Create a Pino logger instance with the file destination
const logger = pino({ level: "info" }, logStream);

export default logger;
