module.exports = {
  pwa: {
    name: 'Pwa_Demo',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
      include: [/\.html$/, /\.js$/, /\.css$/],
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
