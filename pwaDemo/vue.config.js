module.exports = {
  pwa: {
    name: 'Pwa_Demo',
    workboxOptions: {
      include: [/\.html$/, /\.js$/],
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
          {
              urlPattern: new RegExp('^https://newsapi\.org/'),
              handler: 'networkFirst',
          }
      ]
    },
    appleMobileWebAppCapable: 'yes',
    
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://newsapi.org/',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      },
    }
  }
}
