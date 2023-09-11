const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    open: true,
    host: 'localhost',
    port: 8081,
    https: false,
    // 以上的ip和端口是我们本机的;下面为需要跨域的
    proxy: { // 配置跨域
      '/api': {
        target: 'http://10.176.34.91:9312', // 后端给的测试服务器地址
        ws: true,
        changOrigin: true, // 允许跨域
        // rewrite: path => path.replace(/^\/api/, '')
        pathRewrite: {
          '^/api': ''
        }
      },
      '/suggest': {
        target: 'http://10.177.21.124:1438',
        changOrigin: true, // 允许跨域
        pathRewrite: {
          '^/suggest': '' // 请求的时候使用这个api就可以
        }
      }
      // '/video': {
      //   target: 'ws://10.177.29.226:1234',
      //   ws: true,
      //   changOrigin: true, // 允许跨域
      //   pathRewrite: {
      //     '^/video': '' // 请求的时候使用这个api就可以
      //   }
      // }
    }
  },
  chainWebpack: config => {
    config.plugin('html')
      .tap(args => {
        args[0].title = 'SELab智慧办公'
        return args
      })
  }
})
