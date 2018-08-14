$(function () {
    getCommunitysList();
});

/**
 * 区列表
 */
function getCommunitysList() {
    var params = {
        "method": "communityList",
        "userid": "",
        "token": "",
        "params": {}
    };

    communityListHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            alert("网络错误，请稍候重试");
            return;
        }

        for (item of re.result){
            communityListAppendHtml(item);
        }
    })
}
function communityListAppendHtml(item) {
    var itemDiv = $("<div></div>").addClass("item");
    var qimgDiv = $("<div></div>").addClass("qimg");
    var qnameDiv = $("<div></div>").addClass("qname");
    var qdataDiv = $("<div></div>").addClass("qdata");


    qimgDiv.append($("<a></a>").attr("href","shequlist.html?id="+item.id).append($("<img>").attr("src",item.imageUrl)));
    qnameDiv.append($("<h3></h3>").append($("<a></a>").attr("href","shequlist.html?id="+item.id).text(item.name)));
    qnameDiv.append($("<p></p>").append($("<span></span>").text("今日新帖："+item.todayComments), $("<span></span>").text("主题："+item.todayPosts)));

    var ali = $("<li></li>").css("width","20%").text(item.posts);
    var bli = $("<li></li>").css("width","20%").text(item.comments);
    var cli = $("<li></li>").css("width","30%").text(item.userName);
    var dli = $("<li></li>").css("width","30%").text(formatData(item.commentsTime));
    qdataDiv.append($("<ul></ul>").append(ali, bli, cli, dli));

    itemDiv.append(qimgDiv, qnameDiv, qdataDiv);
    $(".forumList").append(itemDiv);
}

//格式化日期
function formatData(date) {
    return date.substring(0,date.indexOf(" ")).replace(/-/g,"/");
}


/** api http **/
function communityListHttp(data, callback) {
    var url_communityList = url + "/communitys!request.action";
    httpRequest(url_communityList, data, callback);
}