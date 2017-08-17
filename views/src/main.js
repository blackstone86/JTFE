// 甘特图构造函数
var Gantt = require("../../components/gantt");

// 甘特图容器
var container = $('#ganttwrap');

// 甘特图配置
var config = {
    target: container
}

// 初始化甘特图
var gantt = new Gantt(config);