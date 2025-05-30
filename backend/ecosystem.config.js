// backend/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'hampa-backend', // Name for your backend PM2 process
      script: 'bun', // Use bun as the runner
      args: 'run start:prod', // Executes the 'start:prod' script from your backend's package.json
      cwd: './', // Sets the current working directory for the script to the backend folder
      instances: 'max', // Leverages all available CPUs by creating a worker for each
      exec_mode: 'cluster', // Enables clustering for better performance and zero-downtime reloads
      watch: false, // File watching is disabled, suitable for production
      autorestart: true, // Automatically restarts the app if it crashes
      env_production: {
        // Environment variables loaded when starting with '--env production'
        NODE_ENV: 'production',
        // PORT: 3001,             // Your NestJS 'start:prod' script or app should listen on process.env.PORT
        // Example: await app.listen(process.env.PORT || 3000);
        // DATABASE_URL: 'your_production_database_url',
        // JWT_SECRET: 'your_production_jwt_secret',
        // Add any other backend-specific production environment variables here
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z', // Optional: standardizes log timestamps
    },
  ],
};
