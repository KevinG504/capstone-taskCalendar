const express = require('express');
const path = require('path');
const db = require('./src/db/database');
const sessionMiddleware = require('./src/middleware/sessionMiddleware');
const errorHandler = require('./src/middleware/errorHandler');
const tasksRouter = require('./src/api/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); 
app.use(sessionMiddleware); // Session management

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    sessionId: req.sessionId,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/tasks', tasksRouter);

// Error handler 
app.use(errorHandler);

// Initialize database and start server
async function start() {
  try {
    await db.init();
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}/api/tasks`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();