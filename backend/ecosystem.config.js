// backend/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'hampa-backend',
      script: 'npm',
      args: 'run start:prod',
      cwd: './',
      interpreter: 'node',
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
