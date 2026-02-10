const app = require('./app');
const config = require('./config/environment');
const pool = require('./db');

const PORT = config.port;

// Test database connection before starting server
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }

  console.log('Database connection successful');

  // Start the server
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${config.nodeEnv} mode`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      pool.end(() => {
        console.log('Database pool closed');
        process.exit(0);
      });
    });
  });

  process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      pool.end(() => {
        console.log('Database pool closed');
        process.exit(0);
      });
    });
  });
});
