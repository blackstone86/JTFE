require("./style.less");

var sidebar = $('#sidebar');
var navs = $('.sidebar-nav');
var firstnav = navs.eq(0);
var togglebtn = $('#sidebar-toggle');

togglebtn.on('click', function(){
    $(this).toggleClass("icon-unfold");
    sidebar.toggleClass("sidebar-mini");
});

navs.on('click', function(){
    var ele = $(this);
    var istoggle = ele.hasClass('sidebar-nav-active');
    var list = ele.find('ul');
    var items = list.find('li');
    
    if(istoggle){
        ele.removeClass('sidebar-nav-active');
        list.css('maxHeight', 0);
    }else{
        navs.removeClass('sidebar-nav-active');
        navs.find('ul').css('maxHeight', 0);
    
        ele.addClass('sidebar-nav-active');
        list.css('maxHeight', items.length*40);
    }
});

firstnav.click();