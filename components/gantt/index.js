// 初始化数据
var data = require("./data");

// 本地缓存封装对象
var ls = require("../storage");

// 公共模块
var common = require("../common");

// 国际化
var seti18n = require("./i18n");

// 引入甘特图库
require("../../component_modules/jQueryGantt/libs/jquery/jquery.livequery.1.1.1.min");
require("../../component_modules/jQueryGantt/libs/jquery/jquery.timers");
require("../../component_modules/jQueryGantt/libs/jquery/dateField/jquery.dateField");
require("../../component_modules/jQueryGantt/libs/jquery/JST/jquery.JST");
require("../../component_modules/jQueryGantt/libs/jquery/svg/jquery.svg.min");
require("../../component_modules/jQueryGantt/libs/jquery/svg/jquery.svgdom.1.8");
require("../../component_modules/jQueryGantt/libs/jquery/JST/jquery.JST");
require("../../component_modules/jQueryGantt/libs/utilities");
require("../../component_modules/jQueryGantt/libs/forms");
require("../../component_modules/jQueryGantt/libs/date");
require("../../component_modules/jQueryGantt/libs/dialogs");
require("../../component_modules/jQueryGantt/libs/layout");
require("../../component_modules/jQueryGantt/libs/layout");
require("../../component_modules/jQueryGantt/libs/i18nJs");
require("../../component_modules/jQueryGantt/ganttUtilities");
require("../../component_modules/jQueryGantt/ganttTask");
require("../../component_modules/jQueryGantt/ganttDrawerSVG");
require("../../component_modules/jQueryGantt/ganttGridEditor");
require("../../component_modules/jQueryGantt/ganttMaster");

/**
 * 甘特图的默认设置
 * @type {Object}
 * @private
 */
var DEFAULT_SET = {
    // 本地缓存数据键
    key: common.getRandom()
    // 语言 zh-CN 简体中文，en 英文
    ,language: "zh-CN"
}

/**
 * 甘特图构造函数
 * @param {Object} conf 模块配置
 */
function Gantt(conf){

    // 扩展配置
    this.config = Object.assign(
        {
            // 甘特图容器(jquery对象)
            target: null
        }
        // 默认配置
        ,DEFAULT_SET
        // 自定义配置
        ,conf
    );

    // 外部初始化数据
    this.data = common.isArray(this.config.data) ? this.config.data : [];

    // 内部 jqueryGantt 对象
    this.$gantt = null;

    // 模块状态
    this.ready = false;

    // 初始化
    if (this.config.target) {
        this.init();
    }
}

var GP = Gantt.prototype;

/**
 * 初始化函数
 * @return {Object} 模块实例
 */
GP.init = function(){

    if (this.ready) {
        return this;
    }

    // 实例化甘特图
    this.$gantt = new GanttMaster();

    // 甘特图初始化
    this.$gantt.init(this.config.target);

    // 任务关闭后进度设置为100%
    this.$gantt.set100OnClose = true;

    // 设置语言
    this.setLanguage(this.config.language);

    // 强制计算最佳缩放比例
    delete this.$gantt.gantt.zoom;

    // 设置数据
    this.setData()

    // 清空 undo 堆栈
    this.$gantt.checkpoint();

    this.$gantt.editor.element.oneTime(100, "cl", function () {
        $(this).find("tr.emptyRow:first").click();
    });

    this.ready = true;

    return this;
}

/**
 * 设置模块语言
 * @param {String} language 语言 可选值 zh-CN 简体中文；en 英文
 */
GP.setLanguage = function(language){
    seti18n(language);
}

/**
 * 重置模块
 */
GP.reset = function(){
    if (!this.$gantt) {
        return;
    }
    // 清除数据后重绘
    this.$gantt.reset();
}

/**
 * 设置模块数据
 * @param {String} lsKey 数据键
 */
GP.setData = function(lsKey){
    // 项目数据
    var prjdat = [];

    // 甘特图容器
    var target = this.config.target;

    // 重置甘特图
    this.reset();

    // 尝试命中缓存
    ls && (prjdat = ls.get(lsKey));

    // 如没命中缓存，创建一个示例数据
    if (!prjdat || !prjdat.tasks || prjdat.tasks.length == 0){
        prjdat = data;
        // 设置项目开始时间为现在
        var now = new Date().getTime();
        // 示例数据的项目开始时间
        var start = prjdat.tasks[0].start;
        // 现在与项目开始时间的时间差
        var offset = now - start;
        // 项目开始时间设置为现在，其余所有任务顺延
        for (var i = 0, l = prjdat.tasks.length; i < l; i++) {
            var task = prjdat.tasks[i];
            task.start += offset;
        }
    }

    // 不允许新增、修改、删除任务
    if (!prjdat.canWrite){
        var writeBtn = target.find(".ganttButtonBar button.requireWrite");
        writeBtn.length && writeBtn.attr("disabled", true);
    }

    // 设置数据
    prjdat && this.$gantt.loadProject(prjdat);
};

/**
 * 设置模块数据
 * @param {String} lsKey 数据键
 */
GP.saveData = function(lsKey){
    var prjdat = this.$gantt.saveProject();
    if (ls && prjdat && lsKey) {
        ls.set(lsKey, prjdat);
    }
}

/**
 * 销毁模块
 */
GP.destroy = function(){
    if (this.$gantt) {
        this.$gantt = null;
        // 清空容器html
        this.config.target.html("");
    }
}

module.exports = Gantt;