var user;
var communityId = GetQueryString("id");
var currentPage = 1;  //当前页
var countPerPage = 15;  //每页数量
var isInitPage = true;  //是否第一次加载

$(function () {
    user = getUserInfo();
    if(!communityId){
        location.href = "shequ.html";
    }

    getPostList();

    $(".publish").on("click",function () {
        if(!user){
            alert("请先登录");
            return;
        }
        location.href = "shequques.html";
    });
});

function setPage(tp, cp) {
    $(".tcdPageCode").createPage({
        pageCount:tp,
        current:cp,
        backFn:function(p){
            currentPage = p;
            getPostList();
        }
    });
}

/**
 * 帖子列表
 */
function getPostList() {
    var params = {
        "method": "postList",
        "userid": "",
        "token": "",
        "params": {
            "communityId": communityId,
            "currentPage": currentPage,
            "countPerPage": countPerPage
        }
    };

    postListHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            alert("网络繁忙，请稍候重试");
            return;
        }

        for (item of re.result.postList){
            postListAppendHtml(item);
        }

        if(isInitPage){
            var totalPage = parseInt((re.result.amount + countPerPage - 1)/countPerPage);
            setPage(totalPage, currentPage);
            isInitPage = false;
        }
    })
}
function postListAppendHtml(item) {
    var itemDiv = $("<div></div>").addClass("item");
    var tzimgDiv = $("<div></div>").addClass("tzimg");
    var tznameDiv = $("<div></div>").addClass("tzname");
    var tzdataDiv = $("<div></div>").addClass("tzdata");


    tzimgDiv.append($("<a></a>").attr("href","shequdetails.html?postId="+item.id+"&communityId="+communityId).append($("<img>").attr("src",item.userInfo.headImage)));
    tznameDiv.append($("<p></p>").append($("<a></a>").attr("href","shequdetails.html?postId="+item.id+"&communityId="+communityId).text(item.title)));
    tznameDiv.append($("<p></p>").append($("<span></span>").text(item.userInfo.name)));
    tzdataDiv.append($("<p></p>").append($("<span></span>").text(formatData(item.createTime))));
    var scanAEl = $("<a></a>").attr("href","javascript:;").html('<i class="iconfont icon-yanjing"></i>'+item.scanNum);
    var commentAEl = $("<a></a>").attr("href","javascript:;").html('<i class="iconfont icon-xiaoxi"></i>'+item.commentNum);
    tzdataDiv.append($("<p></p>").append(scanAEl,commentAEl ));

    itemDiv.append(tzimgDiv, tznameDiv, tzdataDiv);
    $(".postList").append(itemDiv);
}

//格式化日期
function formatData(date) {
    return date.substring(5,date.indexOf(" "));
}


/** api http **/
function postListHttp(data, callback) {
    var url_postList = url + "/posts!request.action";
    httpRequest(url_postList, data, callback);
}




