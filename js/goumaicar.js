var goodsInfo;  //商品
var goodsNum = 1;  //商品数量
var provinceId = "";  //省
var cityId = "";  //市
var countyId = "";  //区/县


$(function () {
    var goodsId = GetQueryString("id");
    var user = getUserInfo();

    if(!goodsId || !user){
        location.href = "index.html";
        return;
    }

    init();
    getProvinceList();
    getGoodsInfo(goodsId);
    
    $(".submitOrder").on("click",function () {
        var order = {
            "name": $(".addrName").val(),
            "phone": $(".addrPhone").val(),
            "goodsId": goodsId,
            "goodsNum": goodsNum,
            "provinceId": provinceId,
            "cityId": cityId,
            "countyId": countyId,
            "address": $(".address").val(),
            "payType": $("input[name='paymethod']:checked").val(),
            "billType": $("input[name='ticketType']:checked").val(),
            "billTitle": $(".ticketTitle").val(),
            "billNum": $(".tickeNo").val(),
            "remark": $(".remark").val()
        };

        // 校验
        if(order.name == ""){
            alert("请输入收货人");
            return;
        }
        if(order.phone == ""){
            alert("请输入手机号");
            return;
        }
        if(!reg.phone.test(order.phone)){
            alert("请输入正确的手机号");
            return;
        }
        if(order.provinceId == "" || order.countyId == "" || order.cityId == ""){
            alert("请选择省/市/区");
            return;
        }
        if(order.address == ""){
            alert("请输入详细地址");
            return;
        }
        if(order.billType == 2){
            if(order.billTitle == ""){
                alert("请输入发票抬头");
                return;
            }
            if(order.billNum == ""){
                alert("请输入发票编号");
                return;
            }
        }

        onSubmitOrder(user, order);
        // goumaiorder.html
    });
});

function init() {

    //初始化选择支付类型
    $(".pt").on("click",function (e) {
        $(".pt").removeClass("active");
        $(this).addClass("active");
    });

    //初始化选择发票类型
    $(".ticketType").on("click",function (e) {
        var tiketType = $("input[name='ticketType']:checked").val();

        if(tiketType == 0){
            $(".taitou").addClass("hide");
            $(".bianhao").addClass("hide");
            $(".beizhu").addClass("hide");
        } else if(tiketType == 1){
            $(".taitou").addClass("hide");
            $(".bianhao").addClass("hide");
            $(".beizhu").removeClass("hide");
        } else {
            $(".taitou").removeClass("hide");
            $(".bianhao").removeClass("hide");
            $(".beizhu").removeClass("hide");
        }
    });

    //初始化选择器
    $( "#province" ).selectmenu({
        change: function() {
            provinceId = $(this).val();
            getCityList(provinceId);
        }
    });
    $( "#city" ).selectmenu({
        change: function() {
            cityId = $(this).val();
            getCountyList(cityId);
        }
    });
    $( "#county" ).selectmenu({
        change: function() {
            countyId = $(this).val();
        }
    });

    //初始化amount控件
    $(".amount-input").val(goodsNum);
    $(".reduce").on("click",function () {
        goodsNum = $(".amount-input").val();
        --goodsNum;
        if(goodsNum<1){
            $(".amount-input").val(1);
            return;
        }
        $(".amount-input").val(goodsNum);
        getTotalPrice(goodsInfo.price, goodsNum);
    });
    $(".increase").on("click",function () {
        goodsNum = $(".amount-input").val();
        ++goodsNum;
        if(goodsNum > 9999){
            return;
        }
        $(".amount-input").val(goodsNum);
        getTotalPrice(goodsInfo.price, goodsNum);
    });
    $(".amount-input").on("change",function () {
        var currNum = $(".amount-input").val();
        goodsNum = currNum<1 ? 1:currNum;
        $(".amount-input").val(goodsNum);
        getTotalPrice(goodsInfo.price, goodsNum);
    });
}

/**
 * 总计
 * @param num
 * @param price
 */
function getTotalPrice(num, price) {
    $(".total-price span").html("&yen;"+(price*num).toFixed(2));
    $(".pay-price span").html("&yen;"+(price*num).toFixed(2));
}

/**
 * 省市区
 */
function getProvinceList() {
    var params = {
        "method": "provinceList",
        "userid": "",
        "token": "",
        "params": {}
    };

    areaHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            return;
        }

        var provinceEl = $("#province");
        var provinceList = re.result;

        provinceList.forEach(function (item) {
            optionAppendHtml(provinceEl, item);
        });
        provinceEl.selectmenu().selectmenu('refresh');
    });
}
function getCityList(id) {
    var params = {
        "method": "cityList",
        "userid": "",
        "token": "",
        "params": {
            "provinceId": id
        }
    };

    areaHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            return;
        }

        var cityEl = $("#city");
        var cityList = re.result;

        cityId = "";
        cityEl.empty().prepend("<option value=''>请选择</option>");
        cityList.forEach(function (item) {
            optionAppendHtml(cityEl, item);
        });
        cityEl.selectmenu().selectmenu('refresh');

        countyId = "";
        $("#county").empty().prepend("<option value=''>请选择</option>");
        $("#county").selectmenu().selectmenu('refresh');
    });
}
function getCountyList(id) {
    var params = {
        "method": "countyList",
        "userid": "",
        "token": "",
        "params": {
            "cityId": id
        }
    };

    areaHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            return;
        }

        var countyEl = $("#county");
        var countyList = re.result;

        countyId = "";
        countyEl.empty().prepend("<option value=''>请选择</option>");
        countyList.forEach(function (item) {
            optionAppendHtml(countyEl, item);
        });
        countyEl.selectmenu().selectmenu('refresh');
    });
}
function optionAppendHtml(el,item) {
    var option = $("<option></option>").text(item.name).val(item.id);
    el.append(option);
}

/**
 * 提交订单
 */
function onSubmitOrder(user, data) {

    var params = {
        "method": "addUserOrder",
        "userid": user.id,
        "token": user.token,
        "params": {
            "name": data.name,
            "phone": data.phone,
            "goodsId": data.goodsId,
            "goodsNum": data.goodsNum,
            "provinceId": data.provinceId,
            "cityId": data.cityId,
            "countyId": data.countyId,
            "address": data.address,
            "payType": data.payType,
            "billType": data.billType,
            "billTitle": data.billTitle,
            "billNum": data.billNum,
            "remark": data.remark
        }
    };

    userOrderHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            return;
        }

        var order = re.result;
        // alert("订单提交成功！");

        if(data.payType == 0){
            alipay(user, order);
        } else {
            wechatpay(user, order);
        }
    });

}
function ona() {
    wxpopup("images/nav_aibing.png");
}
function alipay(user, order) {
    var params = {
        "method": "toAlipyPage",
        "userid": user.id,
        "token": user.token,
        "params": {
            "orderCode": order.orderCode
        }
    };
    userOrderHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            return;
        }

        $("body").append(re)
    });
}

function wechatpay(user, order) {
    var params = {
        "method": "toWechatPage",
        "userid": user.id,
        "token": user.token,
        "params": {
            "orderCode": order.orderCode
        }
    };

    userOrderHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            return;
        }

        wxpopup(re.result.payImageUrl);
        watchWxPay(user, order.orderCode);
    });
}

/**
 * 监听微信支付是否成功
 * @param user
 * @param orderCode
 */
function watchWxPay(user, orderCode) {
    var repeat = 200;
    var timer = setInterval(function() {
        // var wxmsg = $("#mbg").css("display");
        var wxmsg = $("#mbg").is(":hidden");
        if (repeat == 0 || wxmsg) {
            closeWxMsg();
            clearInterval(timer);
        } else {
            var params = {
                "method": "userOrderInfo",
                "userid": user.id,
                "token": user.token,
                "params": {
                    "orderCode": orderCode
                }
            };
            userOrderHttp(params,function (status, re) {
                if(status != "SUCCESS"){
                    return;
                }

                if(re.result.status == 1){
                    closeWxMsg();
                    clearInterval(timer);
                    window.location.href = "gerenorder.html";
                }

            });
            repeat--;
        }
    }, 3000);

}

/**
 * 商品详情
 */
function getGoodsInfo(goodsId) {
    var params = {
        "method": "goodsInfo",
        "userid": "",
        "token": "",
        "params": {
            "goodsId": goodsId
        }
    };

    goodsInfoHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            return;
        }

        goodsInfo = re.result;
        goodsInfoAppendHtml(goodsInfo);
        getTotalPrice(goodsInfo.price, goodsNum);
    });
}
function goodsInfoAppendHtml(goods) {
    $(".goods .img").append($("<img>").attr("src",goods.goodsImageUrl));
    $(".goods .name span").text(goods.name);
    $(".goods .price span").html("&yen;"+goods.price);
}


/** api http **/

/**
 * 省/市/区
 * @param data
 * @param callback
 */
function areaHttp(data, callback) {
    var url_area = url + "/area!request.action";
    httpRequest(url_area, data, callback);
}

/**
 * 商品详情
 * @param data
 * @param callback
 */
function goodsInfoHttp(data, callback) {
    var url_goodsInfo = url + "/detectionGoods!request.action";
    httpRequest(url_goodsInfo, data, callback);
}

/**
 * 提交订单
 * @param data
 * @param callback
 */
function userOrderHttp(data, callback) {
    var url_userOrder = url + "/userOrder!request.action";
    httpRequest(url_userOrder, data, callback);
}