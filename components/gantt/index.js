// 引入样式
require("../../component_modules/jQueryGantt/libs/jquery/dateField/jquery.dateField.css");
require("./css/platform.css");
require("./css/gantt.css");
require("./css/index.css");
// 初始化数据
var data    = require("./data");
// 本地缓存封装对象
var ls      = require("../storage");
// 公共模块
var common  = require("../common");
// 国际化
var seti18n = require("./i18n");
// 引入甘特图库
var livequery       = require("../../component_modules/jQueryGantt/libs/jquery/jquery.livequery.1.1.1.min");
var timers          = require("../../component_modules/jQueryGantt/libs/jquery/jquery.timers");
var dateField       = require("../../component_modules/jQueryGantt/libs/jquery/dateField/jquery.dateField");
var JST             = require("../../component_modules/jQueryGantt/libs/jquery/JST/jquery.JST");
var svg             = require("../../component_modules/jQueryGantt/libs/jquery/svg/jquery.svg.min");
var svgdom          = require("../../component_modules/jQueryGantt/libs/jquery/svg/jquery.svgdom.1.8");
var utilities       = require("../../component_modules/jQueryGantt/libs/utilities");
var forms           = require("../../component_modules/jQueryGantt/libs/forms");
var date            = require("../../component_modules/jQueryGantt/libs/date");
var dialog          = require("../../component_modules/jQueryGantt/libs/dialogs");
var layout          = require("../../component_modules/jQueryGantt/libs/layout");
var i18nJs          = require("../../component_modules/jQueryGantt/libs/i18nJs");
var ganttUtilities  = require("../../component_modules/jQueryGantt/ganttUtilities");
var ganttTask       = require("../../component_modules/jQueryGantt/ganttTask");
var ganttDrawerSVG  = require("../../component_modules/jQueryGantt/ganttDrawerSVG");
var ganttGridEditor = require("../../component_modules/jQueryGantt/ganttGridEditor");
var ganttMaster     = require("../../component_modules/jQueryGantt/ganttMaster");
// 注册模板
var _tpls = {
    "assignment_row"  : require("./tpls/assignment_row.tpl")
    ,"change_status"  : require("./tpls/change_status.tpl")
    ,"gantbuttons"    : require("./tpls/gantbuttons.tpl")
    ,"resource_editor": require("./tpls/resource_editor.tpl")
    ,"resource_row"   : require("./tpls/resource_row.tpl")
    ,"task_editor"    : require("./tpls/task_editor.tpl")
    ,"taskbar"        : require("./tpls/taskbar.tpl")
    ,"taskemptyrow"   : require("./tpls/taskemptyrow.tpl")
    ,"taskrow"        : require("./tpls/taskrow.tpl")
    ,"tasksedithead"  : require("./tpls/tasksedithead.tpl")
};

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
    // 资源路径
    ,resourceUrl: "../components/gantt/imgs/"
}

/**
 * 甘特图构造函数
 * @param {Object} conf 模块配置
 * @public
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

/**
 * 甘特图原型对象
 * @public
*/
var GP = Gantt.prototype;

/**
 * 初始化函数
 * @return {Object} 模块实例
 * @public
 */
GP.init = function(){

    if (this.ready) {
        return this;
    }

    // 实例化甘特图，ganttMaster.js 用到 ge 实例对象
    window.ge = this.$gantt = new GanttMaster({
        resourceUrl: this.config.resourceUrl
    });

    // Gantt 实例对象，供模板调用实例方法
    window._ge = this;

    // 缓存模板
    this.tplCache();

    // 甘特图初始化
    this.$gantt.init(this.config.target);

    // 任务关闭后进度设置为100%
    this.$gantt.set100OnClose = true;

    // 设置语言
    this.setLanguage(this.config.language);

    // 强制计算最佳缩放比例
    delete this.$gantt.gantt.zoom;

    // 设置数据
    this.setData();

    // 清空 undo 堆栈
    this.$gantt.checkpoint();

    this.$gantt.editor.element.oneTime(100, "cl", function () {
        $(this).find("tr.emptyRow:first").click();
    });

    this.ready = true;

    return this;
}

/**
 * 缓存模板
 * @public
 */
GP.tplCache = function(){
    Object.keys(_tpls).forEach(function(name){
        // 模板
        var tpl = _tpls[name];
        // 模板名称
        var _name = name.toUpperCase();
        // 缓存模板
        if (!tpl.match(/##\w+##/)) { // is Resig' style? e.g. (#=id#) or (# ...some javascript code 'obj' is the alias for the object #)
            var strFunc =
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "with(obj){p.push('" +
                tpl.replace(/[\r\t\n]/g, " ")
                .replace(/'(?=[^#]*#\))/g, "\t")
                .split("'").join("\\'")
                .split("\t").join("'")
                .replace(/\(#=(.+?)#\)/g, "',$1,'")
                .split("(#").join("');")
                .split("#)").join("p.push('")
                + "');}return p.join('');";
            try {
                $.JST._templates[_name] = function(obj){
                    var fn = new Function("obj","date",strFunc);
                    return fn(obj,date);
                }
            } catch (e) {
                console.error("JST error: " + _name);
            }
        } else { //plain template   e.g. ##id##
            try {
                $.JST._templates[_name] = tpl;
            } catch (e) {
                console.error("JST error: " + _name);
            }
        }
    });

    $.JST.loadDecorator("RESOURCE_ROW", function(resTr, res){
        resTr.find(".delRes").click(function(){$(this).closest("tr").remove()});
    });

    $.JST.loadDecorator("ASSIGNMENT_ROW", function(assigTr, taskAssig){
        var resEl = assigTr.find("[name=resourceId]");
        var opt = $("<option>");
        resEl.append(opt);
        for(var i=0; i< taskAssig.task.master.resources.length;i++){
            var res = taskAssig.task.master.resources[i];
            opt = $("<option>");
            opt.val(res.id).html(res.name);
            if(taskAssig.assig.resourceId == res.id)
                opt.attr("selected", "true");
            resEl.append(opt);
        }
        var roleEl = assigTr.find("[name=roleId]");
        for(var i=0; i< taskAssig.task.master.roles.length;i++){
            var role = taskAssig.task.master.roles[i];
            var optr = $("<option>");
            optr.val(role.id).html(role.name);
            if(taskAssig.assig.roleId == role.id)
            optr.attr("selected", "true");
            roleEl.append(optr);
        }
        if(taskAssig.task.master.permissions.canWrite && taskAssig.task.canWrite){
            assigTr.find(".delAssig").click(function(){
                var tr = $(this).closest("[assId]").fadeOut(200, function(){$(this).remove()});
            });
        }
    });
}

/**
 * 设置模块语言
 * @param {String} language 语言 可选值 zh-CN 简体中文；en 英文
 * @public
 */
GP.setLanguage = function(language){
    seti18n(language);
}

/**
 * 重置模块
 * @public
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
 * @public
 * @todo 真实从服务端获取数据
 */
GP.setData = function(){
    // 拿本地缓存设置模块数据
    this.setDataFromLocal(this.config.key);
};

/**
 * 拿本地缓存设置模块数据
 * @param {String} lsKey 数据键
 * @public
 */
GP.setDataFromLocal = function(lsKey){
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
 * 保存模块数据到本地缓存
 * @param {String} lsKey 数据键
 * @public
 */
GP.saveDataToLocal = function(lsKey){
    var prjdat = this.$gantt.saveProject();
    if (ls && prjdat && lsKey) {
        ls.set(lsKey, prjdat);
    }
}

/**
 * 保存数据到服务器
 * 引用模板：gantbuttons.tpl
 * @public
 */
GP.saveGanttOnServer = function() {
  // 模拟实现
  this.saveDataToLocal(this.config.key);
}

/**
 * 新建项目
 * 引用模板：gantbuttons.tpl
 * @public
 */
GP.newProject = function(){
    var ge = this.$gantt;
    ge.reset();
}

/**
 * 打开一个弹窗管理资源(resources)
 * 注：模拟实现，通常资源来源于服务器
 * 引用模板：gantbuttons.tpl
 * @public
 */
GP.editResources = function(){
  var ge = this.$gantt;

  // make resource editor
  var resourceEditor = $.JST.createFromTemplate({}, "RESOURCE_EDITOR");
  var resTbl=resourceEditor.find("#resourcesTable");

  for (var i=0;i<ge.resources.length;i++){
    var res=ge.resources[i];
    resTbl.append($.JST.createFromTemplate(res, "RESOURCE_ROW"))
  }

  // bind add resource
  resourceEditor.find("#addResource").click(function(){
    resTbl.append($.JST.createFromTemplate({id:"new",name:"resource"}, "RESOURCE_ROW"))
  });

  // bind save event
  resourceEditor.find("#resSaveButton").click(function(){
    var newRes=[];
    // find for deleted res
    for (var i=0;i<ge.resources.length;i++){
      var res=ge.resources[i];
      var row = resourceEditor.find("[resId="+res.id+"]");
      if (row.length>0){
        // if still there save it
        var name = row.find("input[name]").val();
        if (name && name!="")
          res.name=name;
        newRes.push(res);
      } else {
        // remove assignments
        for (var j=0;j<ge.tasks.length;j++){
          var task=ge.tasks[j];
          var newAss=[];
          for (var k=0;k<task.assigs.length;k++){
            var ass=task.assigs[k];
            if (ass.resourceId!=res.id)
              newAss.push(ass);
          }
          task.assigs=newAss;
        }
      }
    }

    // loop on new rows
    var cnt=0
    resourceEditor.find("[resId=new]").each(function(){
      cnt++;
      var row = $(this);
      var name = row.find("input[name]").val();
      if (name && name!="")
        newRes.push (new Resource("tmp_"+new Date().getTime()+"_"+cnt,name));
    });

    ge.resources=newRes;

    dialog.closeBlackPopup();
    ge.redraw();
  });

  var ndo = dialog.createModalPopup(400, 500).append(resourceEditor);
}

/**
 * 销毁模块
 * @public
 */
GP.destroy = function(){
    if (this.$gantt) {
        window.ge = this.$gantt = null;
        // 清空容器html
        this.config.target.html("");
    }
}

module.exports = Gantt;