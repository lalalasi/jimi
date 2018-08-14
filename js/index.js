var questionlist = getQuestionList();

$(function () {
    getGoodsList();
    loadQlist();
    qtitleOnClick();
});

/**
 * 问题显示折叠
 */
function qtitleOnClick() {
    $('.home-question .title').on("click",function (e) {
        var bel = $(this).next(".content");
        var iel = $(this).children("i.iconfont");
        if(bel.css("display") == "block") {
            iel.addClass("icon-xiangxia");
            iel.removeClass("icon-xiangshang");
            bel.css("display", "none");
            return;
        }

        iel.addClass("icon-xiangshang");
        iel.removeClass("icon-xiangxia");
        bel.css("display", "block");
    });
}
function loadQlist() {
    for (var questionItem of questionlist){
        if(questionItem.id>3){
            return;
        }
        qlistAppendHtml(questionItem);
    }
}
function qlistAppendHtml(data) {
    var html = '<li><div class="title"><a href="javascript:;">'+data.title+'</a><i class="iconfont icon-xiangxia"></i></div><div class="content hide"><p>'+data.conten+'</p></div></li>';
    $("#qlist").append(html);
}

/**
 * 商品列表
 */
function getGoodsList() {
    var params = {
        "method": "goodsList",
        "userid": "",
        "token": "",
        "params": {}
    };
    
    goodsListHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            return;
        }

        var goodsList = ascOrderList(re.result);
        goodsList.forEach(function (item, index) {
            if(index > 4){
                return;
            }

            goodsListAppendHtml(item, index);
        })
    });
}
function goodsListAppendHtml(goods, index) {
    var li = $("<li></li>");
    var h3 = $("<h3></h3>");
    var a = $("<a></a>");
    var span = $("<span></span>");

    if(goods.id == 1) {
        // li.addClass("hufu");
        span.text("更了解肌肤潜质，让护肤的每一分钱都物超所值");
        a.addClass("details").text("了解详情").attr("href","meiyanxiangqing.html?id=1");
    } else if(goods.id == 2) {
        // li.addClass("manbing");
        span.text("指导养成健康生活习惯，远离常见慢性病");
        a.addClass("details").text("了解详情").attr("href","manxingbingxiangqing.html?id=2");
    } else if(goods.id == 3) {
        // li.addClass("yingyang");
        span.text("按需补充营养，让孩子茁壮成长");
        a.addClass("details").text("了解详情").attr("href","yingyangxiangqing.html?id=3");
    } else if(goods.id == 4) {
        // li.addClass("huanbing");
        span.text("指导养成健康生活习惯，降低疾病发生概率");
        a.addClass("details").text("了解详情").attr("href","aibingxiangqing.html?id=4");
    } else {
        // li.addClass("jianfei");
        span.text("掌握更适合自己的减肥方法，事半功倍");
        a.addClass("details").text("了解详情").attr("href","jianfeixiangqing.html?id=5");
    }
    h3.append($("<a></a>").text(goods.name).attr("href","javascript:;"));
    li.css("background-image","url("+goods.scanImageUrl+")");
    li.append(h3, span, a);
    $(".goodsList").append(li);
}

function ascOrderList(list) {

    list.sort(compare("seqNum"));

    return list;
}
function compare(property) {

    return function (a, b) {
        var a = parseInt(a[property]);
        var b = parseInt(b[property]);
        return a-b;
    };
}


/** api http **/
function goodsListHttp(data, callback) {
    var url_goodsList = url + "/detectionGoods!request.action";
    httpRequest(url_goodsList, data, callback);
}
