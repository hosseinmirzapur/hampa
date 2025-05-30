// backend/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'hampa-backend',
      script: 'bun',
      args: 'run start:prod',
      cwd: './',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      autorestart: true,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
  ],
};
