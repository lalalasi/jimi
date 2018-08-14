var user;
var ue;
var postTypeId = "";

$(function () {
   user = getUserInfo();
   if(!user){
       location.href = "index.html";
       return;
   }

    init();
    
   $(".postSubmit").on("click",function () {
        var title = $(".postTitle").val();
        var content = ue.getContent();
        var anonymous = $(".anonymous").prop("checked")?1:0;

       if(!title){
           alert("请输入标题");
           return;
       }
       if(!content){
           alert("请输入内容");
           return;
       }
       if(!postTypeId){
           alert("请选择讨论区");
           return;
       }

       onPostSubmit(title, content, postTypeId, anonymous);
   });
});

function init() {
    getCommunitysList();

    $( "#postType" ).selectmenu({
        change: function() {
            postTypeId = $(this).val();
        }
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
        initialFrameWidth: "514",
        initialFrameHeight: "165",
        elementPathEnabled: false,
        wordCount: false,
        autoFloatEnabled: false,
        enableAutoSave: false,
        zIndex: 0
    });
}

/**
 * 发起讨论
 */
function onPostSubmit(title,content,type,anonymous) {
    var params = {
        "method": "addPost",
        "userid": user.id,
        "token": user.token,
        "params": {
            "communityId": type,
            "title":title,
            "content": content,
            "anonymous": anonymous
        }
    };

    addPostHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            alert("网络繁忙，请稍候重试");
            return;
        }
        openSuccess(1);
        setTimeout(function(){
            location.href = "shequ.html"
        },2000);
    })
}

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

        var postTypeEl = $("#postType");
        var list = re.result;

        list.forEach(function (item) {
            optionAppendHtml(postTypeEl, item);
        });
        postTypeEl.selectmenu().selectmenu('refresh');
    })
}

function optionAppendHtml(el,item) {
    var option = $("<option></option>").text(item.name).val(item.id);
    el.append(option);
}


/** api http **/
function addPostHttp(data, callback) {
    var url_addPost = url + "/posts!request.action";
    httpRequest(url_addPost, data, callback);
}

function communityListHttp(data, callback) {
    var url_communityList = url + "/communitys!request.action";
    httpRequest(url_communityList, data, callback);
}


















$( "#postType" ).selectmenu();