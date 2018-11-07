const proxy = require('./poxy')
const url = require('url')
const proxy = require('proxy-middleware')

// 设置代理方法
const proxyPrase = function(data) {
  let proxyOptions
  if (data.target) {
    proxyOptions = url.parse(data.target)
    proxyOptions.route = data.route
    return proxy(proxyOptions)
  }
  return ''
}

module.exports = {
  // 禁用UI
  ui: false,
  // files: ['**'],
  // 服务器
  server: {
   
    baseDir: './dist',
    middleware: [
      // proxyPrase(
      //   {
      //     target: 'http://localhost:8000/api',
      //     route: '/api'
      //   }
      // )
    ]
  },
  // 是否开启多端同步
  ghostMode: {
    click: false, // 同步点击
    scroll: false // 同步滚动
  },
  // 再控制台打印前缀
  // logPrefix: 'browserSync in gulp',
  // 运行后自动打开的；浏览器 （不填默认则是系统设置的默认浏览器）
  browser: ['chrome'],
  // 自动打开浏览器
  open: false,
  // 使用端口`
  port: '8000',
  //不显示在浏览器中的任何通知。
  notify: false,
  // 刷新浏览器时 重新启动 Browsersync 
  // reloadOnRestart: true,
  //等待2秒钟之前的任何浏览器应该尝试注入/加载的文件。 
  // reloadDelay: 500
}
