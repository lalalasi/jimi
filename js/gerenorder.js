var user;

$(function () {
    user = getUserInfo();

    if(!user){
        location.href = "index.html";
        return;
    }

    getUserOrderList();
    
    $(".goodsTypeList").on("click",".order",function () {
        if($(this).children(".orderAddr").hasClass("hide")){
            $(this).children(".orderAddr").removeClass("hide");
            return;
        }
        $(this).children(".orderAddr").addClass("hide");
    });
});


function getUserOrderList() {
    var params = {
        "method": "userOrderList",
        "userid": user.id,
        "token": user.token,
        "params": {}
    };

    userOrderListHttp(params,function (status,re) {
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
    var orderAddrDiv = $("<div></div>").addClass("order-data clearfix orderAddr hide");

    orderInfoDiv.append($("<div></div>").addClass("oimg").append($("<img>").attr("src",data.goodsImageUrl)));
    var nameDiv = $("<div></div>").addClass("name").text("收货人："+data.name);
    var dataDiv = $("<div></div>").addClass("data").text(formatData(data.createTime));
    // dataDiv.append($("<a></a>").text("绑定").attr("href","gerenbind.html?orderId="+data.id).css("margin-left","20px"));
    orderInfoDiv.append($("<div></div>").addClass("oname").append(nameDiv, dataDiv));
    var phoneDiv = $("<div></div>").addClass("name").text("联系方式："+data.phone);
    orderInfoDiv.append($("<div></div>").addClass("ophone").append(phoneDiv));
    var amountDiv = $("<div></div>").addClass("amount").text("X"+data.num);
    var totalDiv = $("<div></div>").addClass("total").html("合计：&yen;"+data.price);
    orderInfoDiv.append($("<div></div>").addClass("oprice").append(amountDiv, totalDiv));

    var addrDiv = $("<div></div>").text("收货地址："+data.province+data.city+data.county+data.address);
    var orderNoDiv = $("<div></div>").text("订单编号："+data.orderCode);
    var ticketDiv = $("<div></div>").text("发票信息："+(data.billTitle==""?"无":data.billTitle));
    orderAddrDiv.append(addrDiv, orderNoDiv, ticketDiv);

    orderDiv.append(orderInfoDiv, orderAddrDiv);
    el.append(orderDiv);
}
//格式化日期
function formatData(date) {
    return date.substring(0,date.indexOf(" ")).replace(/-/g,"/");
}


/** api http **/
function userOrderListHttp(data, callback) {
    var url_userOrderList = url + "/userOrder!request.action";
    httpRequest(url_userOrderList, data, callback);
}



