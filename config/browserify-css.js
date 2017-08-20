module.exports = {
    // 根目录 用于计算绝对路径 默认 "./"
    "rootDir": "./",
    // 是否 自动注入内联样式 默认 true
    "autoInject": true,
    // 自动注入样式配置项
    "autoInjectOptions": {
        // 是否 显示样式路径 eg: data-href="css/app.css"，设置"autoInjectOptions"后，默认为false，没有设置，默认为true
        "verbose": true,
        // header中注入位置 可选值 "bottom"(默认)；"top"
        "insertAt": "bottom"
    },
    // 是否 压缩 默认 false
    "minify": false,
    // CleanCSS 配置 默认 {}
    "minifyOptions": {},
    // 是否 转base64格式 默认 false
    "inlineImages": true,
    // 转base64格式配置
    "inlineImagesOptions": {
        // 多大尺寸以下才触发转换格式 单位 bytes，但 0 表示一律转换，不受限制
        "limit": 500*1E3 // 500KB
    }
};