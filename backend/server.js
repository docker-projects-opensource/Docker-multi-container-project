const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

// Create log file
const logFile = path.join(logsDir, 'server.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Simple logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${req.method} ${req.url}\n`;
    
    console.log(logMessage);
    logStream.write(logMessage);
    
    next();
});

// Routes
app.get('/api/messages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching messages:', error);
        logStream.write(`Error fetching messages: ${error.message}\n`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/messages', async (req, res) => {
    const { author, content } = req.body;
    
    // Validate input
    if (!author || !content) {
        return res.status(400).json({ error: 'Author and content are required' });
    }
    
    try {
        const result = await pool.query(
            'INSERT INTO messages (author, content) VALUES ($1, $2) RETURNING *',
            [author, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating message:', error);
        logStream.write(`Error creating message: ${error.message}\n`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Start server
app.listen(port, () => {
    const message = `Server running on port ${port}`;
    console.log(message);
    logStream.write(`[${new Date().toISOString()}] ${message}\n`);
});

// Handle process termination
process.on('SIGINT', () => {
    logStream.end();
    process.exit();
});