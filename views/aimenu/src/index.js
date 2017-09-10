require("../../../component_modules/jQuery-menu-aim/example/css/bootstrap-responsive.css");
require("./style.less");
require("../../../component_modules/jQuery-menu-aim/jquery.menu-aim");

var sidebar = $('#sidebar');
var togglebtn = $('#sidebar-toggle');
togglebtn.on('click', function(){
    $(this).toggleClass("icon-unfold");
    sidebar.toggleClass("sidebar-mini");
});