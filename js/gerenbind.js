var user;
var genderId = 0;
var provinceId = "";
var cityId = "";
var countyId = "";
var nationId = "";
var sample = {
    userOrderId: "",
    sampleCode: "",
    name: "",
    birthday: "",
    phone: ""
};
var bindResult;  //绑定结果 true 成功  false 失败

$(function () {
    user = getUserInfo();
    sample.userOrderId = GetQueryString("orderId");
    if(!user || !sample.userOrderId){
        location.href = "index.html";
        return;
    }

    init();

    //1 click page btn
    $(".taojian-next").on("click",function () {
        sample.sampleCode = $(".sampleCode").val();
        if(sample.sampleCode == ""){
            alert("请输入套件码");
            return;
        }

        checkCode(sample.sampleCode);
    });
    //2 click page btn
    $(".xieyi-next").on("click",function () {
        onNextStep(3);
    });
    //3 click page btn
    $(".xinxi-next").on("click",function () {
        sample.name = $(".name").val();
        sample.birthday = $(".birthday").val();
        sample.phone = $(".phone").val();

        // 校验
        if(sample.name == ""){
            alert("请输入姓名");
            return;
        }
        if(provinceId == "" || cityId == "" || countyId == ""){
            alert("请选择省/市/区");
            return;
        }
        if(nationId == ""){
            alert("请选择民族");
            return;
        }
        if(!reg.date.test(sample.birthday)){
            alert("出生年月格式不正确");
            return;
        }
        if(!reg.phone.test(sample.phone)){
            alert("请输入正确的手机号");
            return;
        }

        onBindSample(sample, function (re) {
            if(re.status.code != 200){
                $(".btitle").children("h3").text("绑定失败");
                $(".bimg").append($("<i></i>").addClass("iconfont icon-cuowu1 fail"));
                $(".btjno").remove();
                $(".blook").text(re.status.message);
            } else {
                $(".btitle").children("h3").text("绑定成功");
                $(".bimg").append($("<i></i>").addClass("iconfont icon-zhengque success"));
                $(".btjno").children("a").text(re.result.sampleCode);
            }
            onNextStep(4);
        });
    });
    //4 click page btn
    $(".okbtn").on("click",function () {
        if(bindResult){
            location.href = "gerenspeed.html";
        } else {
            location.href = "gerenorder.html";
        }
    });
});

function init() {
    getProvinceList();
    getNationList();
    getGenderList();

    //初始化选择器
    $( "#gender" ).selectmenu({
        change: function() {
            genderId = $(this).val();
        }
    });
    $( "#nation" ).selectmenu({
        change: function() {
            nationId = $(this).val();
        }
    });
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

    $( ".birthday" ).datepicker({
        changeMonth: true,
        changeYear: true,
        monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
    });
}

/**
 * change page
 * @param p
 */
function onNextStep(p) {
    $(".stepbox").css("display","none");
    $(".step"+p).css("display","block");
}

/**
 * 验证套件码
 */
function checkCode(code) {
    var params = {
        "method": "getSuiteCod",
        "userid": user.id,
        "token": user.token,
        "params": {
            "sampleCode": code
        }
    }

    addUserSampleHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            // alert("网络繁忙，请稍后重试");
            if(re.status.code == 666){
                alert(re.status.message);
            }

            return;
        }

        onNextStep(2);
    });
}

/**
 * 绑定样本
 */
function onBindSample(data, cb) {
    var params = {
        "method": "addUserSample",
        "userid": user.id,
        "token": user.token,
        "params": {
            "sampleCode": data.sampleCode,
            "name": data.name,
            "phone": data.phone,
            "userOrderId": data.userOrderId,
            "nationId": nationId,
            "provinceId": provinceId,
            "cityId": cityId,
            "countyId": countyId,
            "sex": genderId,
            "birthday": data.birthday
        }
    };

    addUserSampleHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            // alert("网络繁忙，请稍后重试");
            bindResult = false;
            cb(re);
            return;
        }
        bindResult = true;
        cb(re);
    });
}

/**
 * 性别
 */
function getGenderList() {
    var genderEl = $("#gender");
    var genderList = [{id: "0", name: "男"}, {id: "1", name: "女"}, {id: "2", name: "保密"}];

    genderList.forEach(function (item) {
        optionAppendHtml(genderEl, item);
    });
    genderEl.selectmenu().selectmenu('refresh');
}

/**
 * 民族
 */
function getNationList() {
    var params = {
        "method": "nationList",
        "userid": "",
        "token": "",
        "params": {}
    };

    nationListHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            return;
        }

        var nationEl = $("#nation");
        var nationList = re.result;

        nationList.forEach(function (item) {
            optionAppendHtml(nationEl, item);
        });
        nationEl.selectmenu().selectmenu('refresh');
    });
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

    provinceListHttp(params,function (status, re) {
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

    cityListHttp(params,function (status, re) {
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

    countyListHttp(params,function (status, re) {
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


/** api http **/

/**
 * 省
 * @param data
 * @param callback
 */
function provinceListHttp(data, callback) {
    var url_provinceList = url + "/area!request.action";
    httpRequest(url_provinceList, data, callback);
}

/**
 * 市
 * @param data
 * @param callback
 */
function cityListHttp(data, callback) {
    var url_cityList = url + "/area!request.action";
    httpRequest(url_cityList, data, callback);
}

/**
 * 县/区
 * @param data
 * @param callback
 */
function countyListHttp(data, callback) {
    var url_countyList = url + "/area!request.action";
    httpRequest(url_countyList, data, callback);
}

/**
 * 民族
 * @param data
 * @param callback
 */
function nationListHttp(data, callback) {
    var url_nationList = url + "/area!request.action";
    httpRequest(url_nationList, data, callback);
}

/**
 * 样本绑定
 * @param data
 * @param callback
 */
function addUserSampleHttp(data, callback) {
    var url_addUserSample = url + "/userSample!request.action";
    httpRequest(url_addUserSample, data, callback);
}