var user;
var reportId;
// var reportItemId;
var currReportId;  //当前报告
var reportItemList;

$(function () {
    user = getUserInfo();
    reportId = GetQueryString("reportId");
    if(!user || !reportId){
        location.href = "index.html";
    }

    init();
    getReportItem();
});

function init() {
    $("#reportItem").on("click","li",function () {
        currReportId = $(this).attr("reportid");
        $("#reportItem li").removeClass("active");
        $(this).addClass("active");

        openLoader();
        getReportResult();
        setNextItemBtn(currReportId);
    });

    $(".nextpage a").on("click",function () {
        currReportId = $(this).attr("reportid");
        if(!currReportId){
            return;
        }

        openLoader();
        getReportResult();
        setNextItemBtn(currReportId);
        $(window).scrollTop(0);
    });
}

//获取当前项目
function getCurrItem(id){
    // for (var i = 0;i<reportItemList.length;i++){
    //     if(id == item.id){
    //         return item;
    //     }
    // }
    var data;
    reportItemList.forEach(function (item,index) {
        if(id == item.id){
            data = item;
        }
    });
    return data;
}

function getReportItem() {
    var params = {
        "method": "getDetectItemList",
        "userid": user.id,
        "token": user.token,
        "params": {
            userSampleId: reportId
        }
    };

    userSampleHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            return;
        }

        reportItemList = re.result;
        reportItemList.forEach(function (item, index) {
            getReportItemAppendHtml(item, index);
        });
    })
}

function getReportItemAppendHtml(data, index){
    var li = $("<li></li>").text(data.name).attr("reportid",data.id);
    if(index == 0){
        currReportId = data.id;
        li.addClass("active");

        // openLoader();
        getReportResult();
        setNextItemBtn(currReportId);
    }
    $("#reportItem").append(li);
}

function setNextItemBtn(currId){
    reportItemList.forEach(function (item, index) {
        if(item.id == currId){
            if(index > reportItemList.length-2){
                $(".nextpage a").text("没有下一项了").addClass("disabled").removeAttr("reportid");
                // return;
            } else {
                $(".nextpage a").text("进入下一项 " + reportItemList[index+1].name).attr("reportid",reportItemList[index+1].id);
            }

            $("#reportItem li").removeClass("active");
            $("#reportItem li").each(function (i,el) {
                var liRId = $(el).attr("reportid");
                if(liRId == currId){
                    $(el).addClass("active");
                }
            });
        }
    });
}

function getReportResult() {
    var params = {
        "method": "getDetectPointList",
        "userid": user.id,
        "token": user.token,
        "params": {
            userSampleId: reportId,
            detectItemId: currReportId
        }
    };

    userSampleHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            return;
        }
        //获取成功填充数据
        getReportResultAppendHtml(re.result);
        closeLoader();
    })
}

function getReportResultAppendHtml(data){
    //填充项目数据
    var item = getCurrItem(currReportId);
    $(".reportInfo").html(item.reportInfo);
    $(".reportName").text(item.name+" -【基因检测结果】");
    $(".state-desc").text(item.itemInfo);
    $(".panel .itemDesc").html(item.describe);


    //填充检测结果数据
    $(".result .state").text(data.itemResult);
    if(data.itemResult == "高"){
        $(".result .state").addClass("gao");
    } else if(data.itemResult == "中"){
        $(".result .state").addClass("zhong");
    }

    //填充患病风险概率
    if(item.allPeoplePersent != 0){
        $(".all-user").removeClass("hide");
        $(".current-user").removeClass("hide");
        $(".all-user span").text(data.allPeoplePersent);
        $(".current-user span").text(data.currentUserPersent);
    }

    $(".tips p").text(data.itemResultDesc);

    var th = $(".testlist").children("th");
    $(".testlist").children().remove();
    $(".testlist").append(th);
    data.pointResultList.forEach(function (item) {
        testlistAppendHtml(item);
    });
}

function testlistAppendHtml(data) {
    var tr = $("<tr></tr>");
    tr.append($("<td></td>").text(data.geneName),$("<td></td>").text(data.name),$("<td></td>").text(data.functionInfo),$("<td></td>").text(data.detectionResult));

    $(".testlist").append(tr);
}

/** api http **/
function userSampleHttp(data, callback) {
    var url_userSample = url + "/userSample!request.action";
    httpRequest(url_userSample, data, callback);
}