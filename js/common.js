/**
 * 引入页头页脚
 */
$(function () {
    $("#header").load("components/header.html",headCallback);
    $("#footer").load("components/footer.html");
    $("#popup").load("components/popup/popup.html");

    //自定义滚动条
    // $(".scroll").niceScroll({
    //     cursorcolor: "#F3F3F3",
    //     cursorwidth: "8px"
    // });
});

/**
 * 页头回调
 */
var headCallback = function () {
    var user = getUserInfo();

    if(user){
        topMenuElDisabled();
        topMenuInit(user);

        $(".logout").on("click",function () {
            onLogout(user);
        })
    }




    //报告下拉
    reprotSelect();

    //示例报告二级NAV
    navdomeDisplay();

    //nav当前页面
    navAddActive();
}

function topMenuInit(user) {
    $(".menu-username").text(user.name);
}
function topMenuElDisabled() {
    $(".top-menu").css("display","block");
    $(".report").css("display","block");
    $(".usernav").css("display","none");
}

function navAddActive() {
    var pathname = location.pathname;
    var currPage = pathname.substring(pathname.lastIndexOf("/")+1,pathname.indexOf(".html"))
    if(currPage == "index") {
        $(".nav-home").children("a").addClass("active");
        return;
    }
    if(currPage == "jianceliucheng") {
        $(".nav-liucheng").children("a").addClass("active");
        return;
    }
    if(currPage == "baogaojianfei" || currPage == "baogaomeiyan" || currPage == "baogaoyingyang" || currPage == "baogaomanbing" || currPage == "baogaoaibing"){
        $(".nav-demo").children("a").addClass("active");
        return;
    }
    if(currPage == "shequ"){
        $(".nav-shequ").children("a").addClass("active");
        return;
    }
    if(currPage == "meiyanxiangqing" || currPage == "jianfeixiangqing" || currPage == "yingyangxiangqing" || currPage == "manxingbingxiangqing" || currPage == "aibingxiangqing"){
        $(".nav-goumai").children("a").addClass("active");
        return;
    }
    // if(currPage == "goumai"){
    //     $(".nav-goumai").children("a").addClass("active");
    //     return;
    // }
}

function navdomeDisplay() {
    $('.navbar li').on("mouseover",function () {
        var d = $(this).hasClass("nav-demo");
        var g = $(this).hasClass("nav-goumai");

        if(d){
            $("#demo").addClass("active");
        }
        if(g){
            $("#goods").addClass("active");
        }
    });
    $('.navbar li').on("mouseout",function () {
        var d = $(this).hasClass("nav-demo");
        var g = $(this).hasClass("nav-goumai");
        if(d){
            $("#demo").removeClass("active");
        }
        if(g){
            $("#goods").removeClass("active");
        }
    });
    $('.nav-toggle .toggle').on("mouseover",function () {
        var d = $(this).hasClass("demo");
        var g = $(this).hasClass("goods");

        if(d){
            $("#demo").addClass("active");
        }
        if(g){
            $("#goods").addClass("active");
        }
    });
    $('.nav-toggle .toggle').on("mouseout",function () {
        var d = $(this).hasClass("demo");
        var g = $(this).hasClass("goods");

        if(d){
            $("#demo").removeClass("active");
        }
        if(g){
            $("#goods").removeClass("active");
        }
    });
}

function reprotSelect() {
    $('.dropdown').on("mouseover",function () {
        $(".dropdown .content").show();
    });
    $('.dropdown').on("mouseout",function () {
        $(".dropdown .content").hide();
    });
}


function onLogout(user) {
    var params = {
        "userid": user.id,
        "method": "logout",
        "token": user.token,
        "params": {}
    };
    logoutHttp(params, function (status, re) {
        if(status != "SUCCESS"){
            return;
        }
        removeUserInfo();
        openSuccess();
    })
}

/** api http **/
function logoutHttp(data, callback) {
    var url_logout = url + "/userInfo!request.action";
    httpRequest(url_logout, data, callback);
}



// 导航滚动
$(window).scroll(function ()
{
    if ($(window).scrollTop() >= 106)
    {
        $('.header').addClass('fixed');
    }
    else
    {
        $('.header').removeClass('fixed');
    }
});


/** 工具方法 **/

/**
 * 获取url参数
 * @param name
 * @returns {null}
 * @constructor
 */
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

//此处皮一下 2018/5/9
console.log("%c 我的愿望是世界和平","color:#4FB1F7;font-size:16px;font-weight:400;font-family:SimKai;")



