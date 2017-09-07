'use strict';

var path = require("path");
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
var glob = require('glob');
var es = require('event-stream');
var rename = require('gulp-rename');
var reload = browserSync.reload;
// 外部传参封装 eg: gulp --env prod
var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'prod' }
};
var options = minimist(process.argv.slice(2), knownOptions);
var isProd = options.env === 'prod';

function bundle(){
  return this.b.bundle()
    // 如果有错误发生，记录这些错误
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(this.entry))
    .pipe(rename({
        extname: '.bundle.js'
    }))
    // 可选项，如果你不需要缓存文件内容，就删除
    .pipe(buffer())
    // 可选项，如果你不需要 sourcemaps，就删除
    .pipe(sourcemaps.init({loadMaps: true})) // 从 browserify 文件载入 map
    // 在这里将变换操作加入管道
    .pipe(sourcemaps.write('./')) // 写入 .map 文件
    .pipe(gulp.dest('./dist'));
}

function bundles() {
  glob('./views/src/**.js', function(err, files) {
      var boot = './components/boot/index.js';
      var tasks = files.map(function(entry) {
          var customOpts = { entries: [boot, entry] }
          var opts = assign({}, watchify.args, customOpts);
          var b = isProd ? browserify(opts) : watchify(browserify(opts));
          b.transform('browserify-css', {global: true});
          var bundleFn = bundle.bind(
            {
              "b": b, 
              "entry": path.basename(entry)
            }
          );
          // 当任何依赖发生改变的时候，运行打包工具
          b.on('update', bundleFn);
          // 输出编译日志到终端
          b.on('log', gutil.log);
          return bundleFn();
      });
      es.merge(tasks).on('end', function(){});
  })
}

// 编译项目
gulp.task('default', bundles);

// 监视文件改动并重新载入
gulp.task('serve', function() {
  browserSync({
    server: {
      // 服务器根目录
      baseDir: './'
      // 指定入口页
      ,index: "views/gantt.html"
    }
  });

  gulp.watch(['./dist/*.js',"./views/*.html"], {
    // 服务器根目录
    cwd: './'
  }, reload);
});