const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    },
    host: 'localhost',
    client: {
      webSocketURL: 'ws://localhost:8081/ws'
    }
  },
  lintOnSave: false
})
