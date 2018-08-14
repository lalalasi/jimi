var user;
var postId = GetQueryString("postId");
var communityId = GetQueryString("communityId");
var post;
var commentList;  //评论列表
var cCurrPage = 1;  //评论当前页
var cCountPerPage = 10;  //评论每页数量
var parentCommentId = ""; //评论父级id
var mx,my; //鼠标坐标

$(function () {
    user = getUserInfo();
    if(!postId || !communityId){
        location.href = "index.html";
        return;
    }
    if(!user){
        user = {
            id:""
        }
        $(".setmsg").removeClass("hide");
        $(".lreply-conten").addClass("hide");
    }

    init();
    getPostInfo(postId);
    getPostCommentList(postId, cCurrPage, cCountPerPage);
});

function init() {
    //初始化位置
    $(".xqbox .title").children(".loca").attr("href","shequlist.html?id="+communityId);

    //初始化用户信息
    $(".lreply-mask").children("img").attr("src",user.headImage);
    $(".lreply-name").text(user.name);

    $(".save").on("click",function () {
        var _this = $(this);

        if(!user.id){
            alert("请先去登录！");
            return;
        }

        if (post.agrees == 0){
            onSave(_this);
            return;
        }
        cancelSave(_this);
    });
    $(".care").on("click",function () {
        var _this = $(this);

        if(!user.id){
            alert("请先去登录！");
            return;
        }

        if (post.follows == 0){
            onCare(_this);
            return;
        }
        cancelCare(_this);
    });

    ue = UE.getEditor('editor',{
        toolbars: [
            [
                'bold', //加粗
                'italic', //斜体
                // 'blockquote', //引用
                'insertorderedlist', //有序列表
                'insertunorderedlist', //无序列表
                'simpleupload', //单图上传
                // 'insertimage', //多图上传
            ]
        ],
        initialFrameWidth: "954",
        initialFrameHeight: "218",
        elementPathEnabled: false,
        wordCount: false,
        autoFloatEnabled: false,
        enableAutoSave: false,
        zIndex: 0
    });

    $(".topAnswer").on("click",function () {
        if(!user.id){
            alert("请先去登录！");
            return;
        }

        junpAnswer();
    });

    $("#postCommentList").on("click",".greply",function () {
        if(!user.id){
            alert("请先去登录！");
            return;
        }

        $(".guest-input").addClass("hide");
        $(this).parents(".guest-conten").nextAll(".guest-input").removeClass("hide");
        $(this).parents(".guest-conten").nextAll(".guest-input").children("input").focus();
        parentCommentId = $(this).attr("pcid");
    });
    
    $("#postCommentList").on("click",".ggreply",function () {
        if(!user.id){
            alert("请先去登录！");
            return;
        }

        $(".gginput").addClass("hide");
        $(this).parents(".ggconten").next().removeClass("hide");
        $(this).parents(".ggconten").next().children("input").focus();
    });

    //一级评论
    $(".submitPostAnswer").on("click",function () {
        if(!user.id){
            alert("请先去登录！");
            return;
        }

        var hideAnswer = $(".hideAnswer").prop("checked")?1:0;
        var contentAnswer = ue.getContent();
        parentCommentId = "";

        addComment(postId, contentAnswer, hideAnswer, parentCommentId);
    });

    //二级评论
    $("#postCommentList").on("click","#replyBtn",function () {
        if(!user.id){
            alert("请先去登录！");
            return;
        }

        parentCommentId = $(this).attr("pcid");
        var conten = $(this).parent().children("input").val();
        addComment(postId, conten, 0,parentCommentId);
    });

    //三级评论
    $("#postCommentList").on("click","#rReplyBtn",function () {
        if(!user.id){
            alert("请先去登录！");
            return;
        }

        parentCommentId = $(this).attr("pcid");
        var conten = $(this).parent().children("input").val();
        addComment(postId, conten, 0,parentCommentId);
    });


    // $("#postCommentList").on("blur",".guest-input>input",function () {
    //     var ex = $(this).offset().left;
    //     var ey = $(this).offset().top;
    //
    //     if(mx<ex || mx>(ex+944) || my<ey || my>(ey+30)){
    //         $(this).parent().addClass("hide");
    //     }
    //     // $(document).off("mousedown");
    // });
    //
    // $(document).on("mousedown",function (e) {
    //     mx = e.clientX;
    //     my = e.pageY;
    //
    //     console.log(mx+"|"+my);
    // });
}

function junpAnswer() {
    var h = $(".lreplybox").offset().top;
    $(document).scrollTop(h);
    UE.getEditor('editor').focus();
}

function onSave(el) {
    agrees(function () {
        ++post.agreeNum;
        post.agrees = 1;
        el.addClass("be").html('<i class="iconfont icon-dianzan"></i>已赞');
    });
}

function cancelSave(el) {
    agrees(function () {
        --post.agreeNum;
        post.agrees = 0;
        el.removeClass("be").html('<i class="iconfont icon-dianzan"></i>('+post.agreeNum+')');
    });
}

function agrees(cb) {
    var params = {
        "method": "agrees",
        "userid": user.id,
        "token": user.token,
        "params": {
            "postId": post.id
        }
    };

    postsHttp(params, function (status, re) {
        if(status != "SUCCESS"){
            alert("网络繁忙，请稍候重试");
            return;
        }
        cb();
    });
}

function onCare(el) {
    follows(function () {
        post.follows = 1;
        el.addClass("be").html('已关注');
    });
}

function cancelCare(el) {
    follows(function () {
        post.follows = 0;
        el.removeClass("be").html('关注');
    });
}

function follows(cb) {
    var params = {
        "method": "follows",
        "userid": user.id,
        "token": user.token,
        "params": {
            "postUesrId": post.userInfo.id
        }
    };

    postsHttp(params, function (status, re) {
        if(status != "SUCCESS"){
            alert("网络繁忙，请稍候重试");
            return;
        }
        cb();
    });
}

/**
 * 贴子信息
 * @param pid
 */
function getPostInfo(pid) {
    var params = {
        "method": "postInfo",
        "userid": user.id,
        "token": user.token,
        "params": {
            "postId": pid
        }
    };

    postsHttp(params, function (status, re) {
        if(status != "SUCCESS"){
            alert("网络繁忙，请稍候重试");
            return;
        }

        post = re.result;
        landlordInfoAppendHtml(re.result);
    });
}

function landlordInfoAppendHtml(data) {
    $(".land-mask").children("img").attr("src",data.userInfo.headImage);
    $(".land-name").text(data.anonymous == 0 ? data.userInfo.name:"匿名用户");
    $(".land-title").children("h3").text(data.title);
    $(".land-conten").html(data.content);
    $(".land-operation").children(".date").text(formatData(data.createTime));

    if(data.agrees == 0){
        $(".land-operation").children(".save").html('<i class="iconfont icon-dianzan"></i>('+data.agreeNum+')');
    } else {
        $(".land-operation").children(".save").addClass("be").html('<i class="iconfont icon-dianzan"></i>已赞');
    }
    if(data.follows == 0){
        $(".land-operation").children(".care").html('关注');
    } else {
        $(".land-operation").children(".care").addClass("be").html('已关注');
    }
}

/**
 * 贴子评论列表
 * @param postId
 * @param currPage
 * @param countPerPage
 */
function getPostCommentList(postId, currPage, countPerPage) {
    var params = {
        "method": "commentList",
        "userid": user.id,
        "token": user.token,
        "params": {
            "postId": postId,
            "currentPage": currPage,
            "countPerPage": countPerPage
        }
    };

    commentsHttp(params, function (status, re) {
        if(status != "SUCCESS"){
            alert("网络繁忙，请稍候重试");
            return;
        }

        var commentList = re.result.commentList;
        commentList.forEach(function (item,index) {
            index = index+2;
            postCommentListAppendHtml(item,index);
        })

    });
}

function postCommentListAppendHtml(data, index) {
    var guest = $("<div></div>").addClass("clearfix guest");
    var guestLeft = $("<div></div>").addClass("guest-left");
    var guestRight = $("<div></div>").addClass("guest-right");


    guestLeft.append($("<div></div>").addClass("guest-mask").append($("<img>").attr("src",data.userInfo.headImage)));
    var guestConten = $("<div></div>").addClass("guest-conten");
    guestConten.append($("<div></div>").addClass("guest-no").append($("<span></span>").addClass("name").text(data.userInfo.name),$("<span></span>").addClass("layer").text(index+"楼")));
    guestConten.append($("<div></div>").addClass("guest-text").html(data.content));

    var date = $("<span></span>").addClass("date").text(formatData(data.createTime) );
    var greply = $("<a></a>").addClass("btn greply").text("回复").attr("href","javascript:;");
    guestConten.append($("<div></div>").addClass("guest-operation").append(date,greply));
    guestRight.append(guestConten);

    //回复列表
    if(data.childComments && data.childComments.length != 0){
        var gglist = $("<div></div>").addClass("gglist").append($("<i></i>").addClass("iconfont icon-shangjiantou"));
        data.childComments.forEach(function (item) {
            item.parentUserInfo = data.userInfo;
            commentReplyAppendHtml(gglist, item);
        });
        guestRight.append(gglist);
    }

    //二级回复
    var guestInput = $("<div></div>").addClass("guest-input hide");
    guestInput.append('<input type="text" placeholder="说点什么吧..." />', '<a href="javascript:;" class="btn" id="replyBtn" pcid="'+data.id+'" >发送</a>');
    guestRight.append(guestInput);

    guest.append(guestLeft,guestRight);
    $("#postCommentList").append(guest);
}
function commentReplyAppendHtml(el, data) {
    var ggitem = $("<div></div>").addClass("clearfix ggitem");
    var gguestLeft = $("<div></div>").addClass("ggleft");
    var gguestRight = $("<div></div>").addClass("ggright");

    gguestLeft.append($("<div></div>").addClass("ggmask").append($("<img>").attr("src",data.userInfo.headImage)));

    var ggname = $("<div></div>").addClass("ggname").html(data.userInfo.name+" 回复 "+data.parentUserInfo.name);
    var ggconten = $("<div></div>").addClass("clearfix ggconten");
    ggconten.append($("<div></div>").addClass("ggtext").text(data.content));
    ggconten.append($("<div></div>").addClass("ggdate").append($("<span></span>").text(formatData(data.createTime)), '<a href="javascript:;" class="ggreply">回复</a>'));
    var gginput = $("<div></div>").addClass("gginput hide");
    gginput.append('<input type="text" placeholder="说点什么吧..."/>', '<a href="javascript:;" class="btn" id="rReplyBtn" pcid="'+data.id+'">发送</a>');

    gguestRight.append(ggname, ggconten, gginput);
    ggitem.append(gguestLeft, gguestRight);
    el.append(ggitem);
}

function addComment(postId, comContent, anonymous, pCommentId) {
    var params = {
        "method": "addComment",
        "userid": user.id,
        "token": user.token,
        "params": {
            "postId": postId,
            "content": comContent,
            "anonymous": anonymous
        }
    };

    if(pCommentId){
        params.params.parentCommentId = pCommentId;
    }

    commentsHttp(params, function (status, re) {
        if(status != "SUCCESS"){
            alert("网络繁忙，请稍候重试");
            return;
        }
        openSuccess();
    });
}

//格式化日期
function formatData(date) {
    return date.substring(0,date.lastIndexOf(":")).replace(/-/g,"/");
}


/** api http **/
function postsHttp(data, callback) {
    var url_posts = url + "/posts!request.action";
    httpRequest(url_posts, data, callback);
}

function commentsHttp(data, callback) {
    var url_comments = url + "/comments!request.action";
    httpRequest(url_comments, data, callback);
}


