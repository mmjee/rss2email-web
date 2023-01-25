const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ]
  }
})
