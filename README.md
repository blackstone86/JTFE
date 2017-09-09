基于Browserify的模块化前端架构 1.0.0
---------------------------------

## 开发环境配置
1. 项目需要`nodeJS` 6.10.3 或以上的版本

1. 安装开发工具
    ```shell
    npm install
    ```

1. clone项目（以下为示例）

    ```shell
    git clone https://github.com/blackstone86/JTFE.git
    ```

1. 在当前终端/命令行窗口，使用 `npm run dev` 构建项目，监听脚本变更，浏览器自动刷新

> 注：使用 `npm run prod` 构建项目

1. 浏览项目效果 http://localhost:3000

## 文件结构说明
```
├── README.md
├── component_modules
├── components
├── config
├── dist
├── node_modules
├── views
├── .bowerrc
├── .gitignore
├── .nvmrc
├── bower.json
├── gulpfile.js
└── package.json
```

- `README.md` 项目说明文档
- `component_modules目录` 公共组件目录
- `components目录` 业务组件目录
- `config目录` 工程配置文件目录
- `dist目录` 打包目录
- `node_modules目录` node模块目录
- `views目录` 静态资源目录
- `.bowerrc` bower配置文件
- `.gitignore` 忽略提交文件配置文件
- `.nvmrc` nvm 项目使用 nodeJS 版本配置文件
- `bower.json` bower工程描述文件
- `gulpfile.js` gulp打包脚本文件
- `package.json` node工程描述文件

## 开发约定

- 书写符合`CommonJS`规范的代码

## 特性

- css支持`@import`语法
- js支持`require`语法
- 图片自动转`base64`格式
- 实时按需编译（只编译变更过的文件）
- 浏览器自动刷新、清缓存
- 自动压缩、合并、资源内联

# 常用组件

## 一、业务组件

### gantt 甘特图

``` html
html:
     <div id="ganttwrap"></div>
```

``` js
js:
    // 甘特图构造函数
    var Gantt = require("../../components/gantt");

    // 甘特图容器
    var container = $('#ganttwrap');

    // 甘特图配置
    var config = {
        target: container
        ,key: 'teamworkGantDemo'
    }

    // 初始化甘特图
    var gantt = new Gantt(config);
```




