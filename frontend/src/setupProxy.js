const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://liftoff-pro-service.westeurope.cloudapp.azure.com',
            changeOrigin: true,
            pathRewrite: { '^/api': '' }
        })
    );
    
    app.use(
        '/steam-api',
        createProxyMiddleware({
            target: 'https://api.steampowered.com',
            changeOrigin: true,
            pathRewrite: { '^/steam-api': '' }
        })
    );
};
    