module.exports = {
  apps : [{
    name: "cache-it", // Name of your app
    script: "./server.js", // Path to the entry file of your application
    instances: 1, // Number of instances to start (use 'max' for as many instances as CPU cores)
    autorestart: true, // Restart app automatically if it crashes
    watch: false, // Watch for file changes and restart; set to true in development
    max_memory_restart: "1G", // Restart the app if it reaches this memory limit
    env: {
      NODE_ENV: "development", // Default environment variables
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};
