// backend/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'hampa-backend',
      script: '/var/www/hampa/backend/dist/main.js',
      interpreter: '/home/hossein/.bun/bin/bun', // Confirm path with `which bun`
      instances: 1,
      exec_mode: 'fork', // Use 'fork' for Bun compatibility
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
