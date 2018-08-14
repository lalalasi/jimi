$(function () {
    var goodsId = GetQueryString("id");
    var user = getUserInfo();

    if(!goodsId){
        location.href = "index.html";
        return;
    }

    //获取价格
    getPriceById(goodsId);

    $(".buyBtn").on("click",function () {
        if(!user){
            alert("请先登录");
            return;
        }

        location.href = "goumaicar.html?id="+goodsId;
    });
});

function closePmsg(){
    $("#mbg").hide();
    $("#popmsg").fadeOut(100);

    window.location.href = "login.html"
}

function getPriceById(id) {
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
            if(item.id = id){
                $(".buyBtn").html("&yen;"+item.price+"&nbsp;购买");
            }
        })
    });
}

/** api http **/
function goodsListHttp(data, callback) {
    var url_goodsList = url + "/detectionGoods!request.action";
    httpRequest(url_goodsList, data, callback);
}