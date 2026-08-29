module.exports = {
    apps: [
        {
            name: "tailor-pro-node-production",
            script: "src/app.js",
            env: {
                NODE_ENV: "production"
            }
        },
        {
            name: "tailor-pro-node-staging",
            script: "src/app.js",
            env: {
                NODE_ENV: "staging"
            }
        }
    ]
};
