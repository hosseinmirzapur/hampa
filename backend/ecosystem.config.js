// backend/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'hampa-backend',
      script: './dist/main.js', // Point directly to the compiled JavaScript file
      interpreter: '/home/hossein/.bun/bin/bun', // Specify the full path to Bun
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
