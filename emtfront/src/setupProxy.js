const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'http://localhost:8080', // Reemplaza con la URL de tu servidor Keycloak
      changeOrigin: true,
    })
  );
};
