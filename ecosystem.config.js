module.exports = {
    apps: [
        {
            name: "chatboat-backend-production",
            script: "src/app.js",
            env: {
                NODE_ENV: "production"
            }
        },
        {
            name: "chatboat-backend-staging",
            script: "src/app.js",
            env: {
                NODE_ENV: "staging"
            }
        }
    ]
};
