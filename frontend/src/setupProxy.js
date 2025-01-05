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
};