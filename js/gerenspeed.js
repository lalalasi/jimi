var user;

$(function () {
    user = getUserInfo();

    if(!user){
        location.href = "index.html";
        return;
    }

    getUserOrderList();
});


function getUserOrderList() {
    var params = {
        "method": "userSampleList",
        "userid": user.id,
        "token": user.token,
        "params": {}
    };

    userSampleListHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            return;
        }

        var list = re.result;
        if(list.length != 0){
            list.forEach(function (item) {
                goodsTypeListAppendHtml(item);
            });
        } else {
            $(".goodsTypeList").addClass("hide");
            $('.noOrder').removeClass("hide");
        }
    })
}

function goodsTypeListAppendHtml(data) {
    var itemDiv = $("<div></div>").addClass("item");
    var titleDiv = $("<div></div>").addClass("title");
    var contenDiv = $("<div></div>").addClass("conten");

    titleDiv.append(data.goodsName);

    data.sampleList.forEach(function (item) {
        item.goodsImageUrl = data.goodsImageUrl;
        orderListAppendHtml(contenDiv, item);
    });

    itemDiv.append(titleDiv, contenDiv);
    $(".goodsTypeList").append(itemDiv);
}
function orderListAppendHtml(el,data) {
    var bindItemDiv = $("<div></div>").addClass("binditem clearfix");

    bindItemDiv.append($("<div></div>").addClass("img").append($("<img>").attr("src",data.goodsImageUrl)));

    var name = $("<span></span>").addClass("name").text("检测人："+data.name);
    var gender = $("<span></span>").addClass("gender").text(getGenderText(data.sex));
    var birthday = $("<span></span>").addClass("birthday").text(formatData(data.createTime));
    var nation = $("<span></span>").addClass("nation").text(data.nation);
    var userInfoDiv = $("<div></div>").addClass("user-info").append(name, gender, birthday, nation);

    var bindno = $("<span></span>").addClass("bind-no").text("套件码："+data.sampleCode);
    var binddate = $("<span></span>").addClass("bind-date").text("绑定日期："+formatData(data.createTime));
    var bindInfoDiv = $("<div></div>").addClass("bind-info").append(bindno, binddate);

    bindItemDiv.append($("<div></div>").addClass("info").append(userInfoDiv, bindInfoDiv));

    var speed = $("<div></div>").addClass("speed").text(getStatusText(data.status));
    var look = $("<div></div>").addClass("look");
    if(data.status == 3){
        speed.addClass("red");
        look.append($("<a></a>").attr("href","gerenbaogao.html?reportId="+data.id).html('<i class="iconfont icon-xiazai"></i>查看报告'));
    }
    bindItemDiv.append($("<div></div>").addClass("result").append(speed, look));
    el.append(bindItemDiv);
}
//格式化日期
function formatData(date) {
    return date.substring(0,date.indexOf(" ")).replace(/-/g,"/");
}
function getGenderText(g) {
    if(g == 0){
        return "男"
    }
    if(g == 1){
        return "女"
    }
    if(g == 2){
        return "保密"
    }
}
function getStatusText(s) {
    if(s == 0){
        return "套件运送中"
    }
    if(s == 1){
        return "检测中"
    }
    if(s == 2){
        return "检测完成"
    }
    if(s == 3){
        return "报告已出"
    }
}


/** api http **/
function userSampleListHttp(data, callback) {
    var url_userSampleList = url + "/userSample!request.action";
    httpRequest(url_userSampleList, data, callback);
}



