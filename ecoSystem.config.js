module.exports = {
  apps: [
    {
      name: "eventmanagement",
      script: "bin/www",
      watch: false,
      env: { NODE_ENV: "production", instances: "max", exec_mode: "cluster", PORT: 80},
    }
  ]
};
