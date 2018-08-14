var user;

$(function () {
    user = getUserInfo();

    if(!user){
        location.href = "index.html";
        return;
    }

    getBindOrderList();

});


function getBindOrderList() {
    var params = {
        "method": "getNoSamoleOrder",
        "userid": user.id,
        "token": user.token,
        "params": {}
    };

    bindOrderListHttp(params,function (status,re) {
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

    titleDiv.text(data.goodsName);
    data.orderList.forEach(function (item) {
        item.goodsImageUrl = data.goodsImageUrl;
        orderListAppendHtml(contenDiv, item);
    });

    itemDiv.append(titleDiv, contenDiv);
    $(".goodsTypeList").append(itemDiv);
}
function orderListAppendHtml(el,data) {
    var orderDiv = $("<div></div>").addClass("order");
    var orderInfoDiv = $("<div></div>").addClass("user-data clearfix");

    orderInfoDiv.append($("<div></div>").addClass("oimg").append($("<img>").attr("src",data.goodsImageUrl)));
    var nameDiv = $("<div></div>").addClass("name").text("收件人："+data.name);
    var dataDiv = $("<div></div>").addClass("data").text(formatData(data.createTime));
    orderInfoDiv.append($("<div></div>").addClass("oname").append(nameDiv, dataDiv));
    var phoneDiv = $("<div></div>").addClass("name").text("联系方式："+data.phone);
    orderInfoDiv.append($("<div></div>").addClass("ophone").append(phoneDiv));

    var bindEl;
    if(!parseInt(data.isSmple)){
        bindEl = $("<a></a>").text("绑定样本").addClass("btn").attr("href","gerenbind.html?orderId="+data.id);
    } else {
        bindEl = $("<span></span>").text("已绑定");
    }
    orderInfoDiv.append($("<div></div>").addClass("operation").append(bindEl));

    orderDiv.append(orderInfoDiv);
    el.append(orderDiv);
}
//格式化日期
function formatData(date) {
    return date.substring(0,date.indexOf(" ")).replace(/-/g,"/");
}


/** api http **/
function bindOrderListHttp(data, callback) {
    var url_userSample = url + "/userSample!request.action";
    httpRequest(url_userSample, data, callback);
}



