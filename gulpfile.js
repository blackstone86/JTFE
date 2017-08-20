'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var minimist = require('minimist');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// 外部传参封装 eg: gulp --env prod
var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'prod' }
};
var options = minimist(process.argv.slice(2), knownOptions);
var isProd = options.env === 'prod';

// 在这里添加自定义 browserify 选项
var customOpts = {
  entries: 
  [
      './components/boot/index.js'
      ,'./views/src/main.js'
  ]
  ,debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = isProd ? browserify(opts) : watchify(browserify(opts)); 

// 在这里加入变换操作
b.transform('browserify-css', {global: true});

gulp.task('build', bundle); // 运行 `gulp pack` 编译文件
b.on('update', bundle); // 当任何依赖发生改变的时候，运行打包工具
b.on('log', gutil.log); // 输出编译日志到终端

function bundle() {
  return b.bundle()
    // 如果有错误发生，记录这些错误
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // 可选项，如果你不需要缓存文件内容，就删除
    .pipe(buffer())
    // 可选项，如果你不需要 sourcemaps，就删除
    .pipe(sourcemaps.init({loadMaps: true})) // 从 browserify 文件载入 map
    // 在这里将变换操作加入管道
    .pipe(sourcemaps.write('./')) // 写入 .map 文件
    .pipe(gulp.dest('./dist'));
}

// 编译项目
gulp.task('default', ['build'], function(){});

// 监视文件改动并重新载入
gulp.task('serve', function() {
  browserSync({
    server: {
      // 服务器根目录
      baseDir: './'
      // 指定入口页
      ,index: "views/index.html"
    }
  });

  gulp.watch(['./dist/*.js',"./views/*.html"], {
    // 服务器根目录
    cwd: './'
  }, reload);
});