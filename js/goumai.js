$(function () {
    var user = getUserInfo();

    getGoodsList();

    $(".goodsList").on("click",".paybtn > a",function () {
        if(!user){
            alert("请先登录");
            return;
        }
        location.href = "goumaicar.html?id="+$(this).attr("goodsId");
    });
});

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

        var goodsList = re.result;
        goodsList.forEach(function (item, index) {
            goodsListAppendHtml(index,item);
        })
    });
}
function goodsListAppendHtml(i,goods) {
    var itemDiv = $("<div></div>").addClass("clearfix goumai-item");
    var dataDiv = $("<div></div>").addClass("gmdata");
    var descDiv = $("<div></div>").addClass("gmdesc");
    var imgDiv = $("<div></div>").addClass("gmimg");
    var priceP = $("<p></p>").addClass("price").html("&yen;"+goods.price);
    var paybtnP = $("<p></p>").addClass("paybtn");
    var buyA = $("<a></a>").addClass("btn btn-blue buy").attr("href","javascript:;").text("购买").attr("goodsId",goods.id);

    dataDiv.append(priceP, paybtnP.append(buyA));
    descDiv.append($("<h3></h3>").text(goods.name),$("<p></p>").text(goods.description));
    imgDiv.append($("<img>").attr("src",goods.goodsImageUrl));

    if(i%2 == 0){
        itemDiv.append(dataDiv, descDiv, imgDiv);
    } else {
        itemDiv.append(imgDiv, descDiv, dataDiv).addClass("even");
    }
    $(".goodsList").append(itemDiv);
}


/** api http **/
function goodsListHttp(data, callback) {
    var url_goodsList = url + "/detectionGoods!request.action";
    httpRequest(url_goodsList, data, callback);
}
