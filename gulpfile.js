'use strict';

let path = require("path");
let watchify = require('watchify');
let browserify = require('browserify');
let gulp = require('gulp');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let gutil = require('gulp-util');
let sourcemaps = require('gulp-sourcemaps');
let assign = require('lodash.assign');
let minimist = require('minimist');
let browserSync = require('browser-sync');
let glob = require('glob');
let es = require('event-stream');
let rename = require('gulp-rename');
let gulpif = require('gulp-if');
let LessPluginAutoPrefix = require('less-plugin-autoprefix');
let autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });
let util = require('./gulp_util.js');
let config = require('./gulp_config.js');
let outputDir = config.outputDir;
let view = config.currview;
// 当前视图根目录
let viewDir = outputDir + "/" + view;
let ignoreFilesPattens = util.getIgnoreFiles(config.ignoreFilesPatterns);
let reload = browserSync.reload;
// 外部传参封装 eg: gulp --env prod
let knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'prod' }
};
let options = minimist(process.argv.slice(2), knownOptions);
let isProd = options.env === 'prod';
// 任务列表
var tasks = ["transfer", "bundles", "serve"];
isProd && tasks.pop();

// 迁移所有源码
function transfer(){
  let stream = gulp.src(["./views/**/*"].concat(ignoreFilesPattens))
  .pipe(gulp.dest(outputDir));
  return stream; 
}

function bundle(){
  return this.b.bundle()
    // 如果有错误发生，记录这些错误
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(this.entry))
    // .pipe(rename({
    //     extname: '.bundle.js'
    // }))
    // 可选项，如果你不需要缓存文件内容，就删除
    .pipe(buffer())
    // 可选项，如果你不需要 sourcemaps，就删除
    .pipe(gulpif(!isProd, sourcemaps.init({loadMaps: true}))) // 从 browserify 文件载入 map
    // 在这里将变换操作加入管道
    .pipe(gulpif(!isProd, sourcemaps.write('./'))) // 写入 .map 文件
    .pipe(gulp.dest(outputDir))
    .on('end', reload);
}

function bundles() {
  glob('./views/**/*.js', function(err, files) {
      let boot = './components/boot/index.js';
      let tasks = files.map(function(entry) {
          let customOpts = { entries: [boot, entry] }
          let opts = assign({}, watchify.args, customOpts);
          let b = isProd ? browserify(opts) : watchify(browserify(opts));
          // b.transform('browserify-css', {global: true});
          let opt = {
            compileOptions: {
              compress: true,
              plugins: [autoprefix]
            }
          };
          b.transform('node-lessify', opt);
          let bundleFn = bundle.bind(
            {
              "b": b,
              "entry": entry.replace("./views/", '') // path.basename(entry)
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

// 启动服务器
function serve() {
  browserSync({
    server: {
      // 服务器根目录
      baseDir: viewDir
      // 指定入口页
      ,index: "index.html"
    }
  });
}

// 迁移资源
gulp.task('transfer', transfer);

// 编译项目
gulp.task('bundles', bundles);

// 启动服务器
gulp.task('serve', serve);

// 主任务
gulp.task('default', tasks);
