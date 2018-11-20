const path = require('path')
const server = require('./server')

function resolveDev(dir) {
  return path.join(__dirname, '../src/', dir)
}

function resolveBuild(dir) {
  return path.join(__dirname, '../dist/', dir)
}

module.exports = {
  dev: {
    dest: './dist',
    static: './static/**/*', // 静态资源 例如: 图片字体
    vendor: './vendor/**/*', // 第三方资源库文件资源 例如: jquery, layer, lodash.js 
    html:  [resolveDev('/**/*.html'), '!./src/include/**/*'],
    allhtml: resolveDev('/**/*.html'),
    styles: resolveDev('static/css/**/*.{less,css}'),
    script: [resolveDev('static/js/**/*.js'), '!./src/static/js/lib/**/*'],
    images: resolveDev('static/images/**/*.{png,jpg,jpeg,gif,svg}'),
  },

  build: {
    static: resolveBuild('static'),
    vendor: resolveBuild('vendor'),
    html: resolveBuild(''),
    styles: resolveBuild('static/css'),
    script: resolveBuild('static/js'),
    images: resolveBuild('static/images'),
  },

  zip: {
    name: 'gulpProject.zip',
    path: resolveBuild('**/*'),
    dest: path.join(__dirname, '../')
  },

  server,
  useEslint: false, 
  useWebpack: false,
  productionZip: false
}
