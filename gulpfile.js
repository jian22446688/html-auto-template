const config = require('./config')

const path = require('path')
const chalk = require('chalk')
const gulp = require('gulp')
const gulpif = require('gulp-if')
const htmlmin = require('gulp-htmlmin')
const fileinclude = require('gulp-file-include')
const less = require('gulp-less')
const postcss = require('gulp-postcss')
const cleanCSS = require('gulp-clean-css')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const cache  = require('gulp-cache')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const uglify = require('gulp-uglify')
const eslint = require('gulp-eslint')
const stripDebug = require('gulp-strip-debug')
const babel = require('gulp-babel')
const sequence = require('gulp-sequence')
const zip = require('gulp-zip')
const del = require('del')
const bSync = require('browser-sync') 
const bom = require('gulp-bom')
const chokidar = require('chokidar');
const _ = require('lodash')

// webpack
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const webpackConfig = require('./webpack.config.js')

// server
const browserSync = bSync.create()
const reload = browserSync.reload


// NODE_ENV
const env = process.env.NODE_ENV || 'development'
const condition = env === 'production'

function respath(dir) {
  return path.join(__dirname, './', dir)
}

function onError(error) {
  const title = error.plugin + ' ' + error.name
  const msg = error.message
  const errContent = msg.replace(/\n/g, '\\A ')

  notify.onError({
    title: title,
    message: errContent,
    sound: true
  })(error)

  this.emit('end')
}

function cbTask(task) {
  return new Promise((resolve, reject) => {
    del(respath('dist'))
    .then(paths => {
      console.log(chalk.green(`
      -----------------------------
        Clean tasks are completed
      -----------------------------`))
      sequence(task, () => {
        console.log(chalk.green(`
        -----------------------------
          All tasks are completed
        -----------------------------`))
        resolve('completed')
      })
    })
  })
}

gulp.task('html', () => {
  return gulp.src(config.dev.html)
    .pipe(plumber(onError))
    .pipe(fileinclude({
      prefix: '@@',
      indent:true, //保留文件的缩进
      basepath: respath('src/include/'),
    }))
    .pipe(gulpif(condition, htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true
    })))
    .pipe(bom())
    .pipe(gulp.dest(config.build.html))
})

gulp.task('styles', () => {
  return gulp.src(config.dev.styles)
    .pipe(plumber(onError))
    .pipe(less())
    .pipe(gulpif(condition, cleanCSS({debug: true})))
    .pipe(postcss('./.postcssrc.js'))
    .pipe(gulp.dest(config.build.styles))
})

gulp.task('images', () => {
  return gulp.src(config.dev.images)
    .pipe(plumber(onError))
    .pipe(cache(imagemin({
      progressive: true, // 无损压缩JPG图片
      svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
      use: [pngquant()] // 使用pngquant插件进行深度压缩
    })))
    .pipe(gulp.dest(config.build.images))
})

gulp.task('eslint', () => {
  return gulp.src(config.dev.script)
   .pipe(plumber(onError))
   .pipe(gulpif(condition, stripDebug()))
   .pipe(eslint({ configFle: './.eslintrc' }))
   .pipe(eslint.format())
   .pipe(eslint.failAfterError());
})

const useEslint = config.useEslint ? ['eslint'] : [];
gulp.task('script', useEslint, () => {
  return gulp.src(config.dev.script)
    .pipe(plumber(onError))
    .pipe(gulpif(condition, babel({
      presets: ['env']
    })))
    .pipe(gulpif(config.useWebpack, webpackStream(webpackConfig, webpack)))
    .pipe(gulpif(condition, uglify()))
    .pipe(gulp.dest(config.build.script))
})

// 静态资源 例如: 图片字体
gulp.task('static', () => {
  return gulp.src(config.dev.static)
    .pipe(gulp.dest(config.build.static))
})

// 第三方资源库文件资源 例如: jquery, layer, lodash.js 
gulp.task('vendor', ()=> {
  return gulp.src(config.dev.vendor)
    .pipe(gulp.dest(config.build.vendor))
})

gulp.task('clean', () => {
  del('./dist').then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
})

gulp.task('watch', () => {
  // BrowserSync 监听 dist 目录 不监听文件的新增
  gulp.watch(config.dev.allhtml, ['html']).on('change', reload)
  gulp.watch(config.dev.styles, ['styles']).on('change', reload)
  gulp.watch(config.dev.script, ['script']).on('change', reload)
  gulp.watch(config.dev.images, ['images']).on('change', reload)
  gulp.watch(config.dev.static, ['static']).on('change', reload)
  gulp.watch(config.dev.vendor, ['vendor']).on('change', reload)
})

gulp.task('zip', () => {
  return gulp.src(config.zip.path)
  .pipe(plumber(onError))
  .pipe(zip(config.zip.name))
  .pipe(gulp.dest(config.zip.dest))
})

gulp.task('server', () => {
  const task = ['html', 'styles', 'script', 'images', 'static', 'vendor']
  cbTask(task).then(() => {
    browserSync.init(config.server)
    console.log(chalk.cyan('  Server complete.\n'))
    gulp.start('watch')
  })
})

gulp.task('build', () => {
  const task = ['html', 'styles', 'script', 'images', 'static', 'vendor']
  cbTask(task).then(() => {
    console.log(chalk.cyan('  Build complete.\n'))
    if (config.productionZip) {
      gulp.start('zip', () => {
        console.log(chalk.cyan('  Zip complete.\n'))
      })
    }
  })
})

gulp.task('reload', ()=> {
  console.log('on reload')
  reload()
})

gulp.task('default', () => {
  console.log(chalk.green(
  `
  Build Setup
    开发环境： npm run dev
    生产环境： npm run build
    执行压缩： gulp zip
    编译页面： gulp html
    编译脚本： gulp script
    编译样式： gulp styles
    语法检测： gulp eslint
    压缩图片： gulp images
  `
  ))
})
