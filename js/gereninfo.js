var user;
var genderId = 0;
var provinceId = "";
var cityId = "";
var countyId = "";
var nationId = "";
var isProvinceInit = true, isCityInit = true, isCountyInit=true, isNationInit=true, isGenderInit=true;  //是否第一次加载，默认是

$(function () {
    user = getUserInfo();
    if(!user){
        location.href = "index.html";
        return;
    }

    init();
    loadUserInfo();

    $(".updata").on("click",function () {

        var updataUser = {
            "name": $(".name").val(),
            "sex": genderId,
            "nationId": nationId,
            "provinceId": provinceId,
            "cityId": cityId,
            "countyId": countyId,
            "birthday": $(".birthday").val()
        };

        // 校验
        if(updataUser.name == ""){
            alert("请输入姓名");
            return;
        }
        if(updataUser.provinceId == "" || updataUser.countyId == "" || updataUser.cityId == ""){
            alert("请选择省/市/区");
            return;
        }
        if(updataUser.nationId == ""){
            alert("请选择民族");
            return;
        }
        if(!reg.date.test(updataUser.birthday)){
            alert("出生年月格式不正确");
            return;
        }

        onUpdata(updataUser);
    });

    $(".submitImg").on("click",function () {
        $("#fileupload").click();
    });
    $("#fileupload").on("change",function () {
        singleImageUpload();
    });
});

function init() {

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

function loadUserInfo() {
    $(".userMask").attr("src",user.headImage);
    $(".phone").val(user.phone);
    $(".name").val(user.name);
    $(".birthday").val(user.birthday);

    getProvinceList();
    getCityList(user.provinceId);
    getCountyList(user.cityId);
    getNationList();
    getGenderList();
}

/**
 * 上传图片
 */
function singleImageUpload() {
    var img=$("#fileupload").val();
    if(img==null || img.trim()==""){
        alert("没有图片");
        return;
    }
    $.ajaxFileUpload( {
        url : url+'/imageupload',// servlet请求路径
        secureuri : false,
        fileElementId : "fileupload",// 上传控件的id
        dataType : 'text',
        success : function(data, status) {
            data = data.replace(/<pre[^>]*>/, '');
            data = data.replace("</pre>", '');
            data = JSON.parse(data);
            var imgurl =data.result[0];
            $(".userMask").attr("src",imgurl);
            $("#fileupload").val("");

            //修改头像接口
            updataImageHead(imgurl);
        },
        error : function(data) {
            alert("网络繁忙，请稍候重试");
            return;
        }
    });
}

function updataImageHead(imgurl) {
    var params = {
        "method": "updateHeadImage",
        "userid": user.id,
        "token": user.token,
        "params": {
            "headImage": imgurl
        }
    };

    updateHeadImageHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            return;
        }
        user.headImage = imgurl;
        setUserInfo(user);
    });
}

/**
 * 修改信息
 * @param upuser
 */
function onUpdata(upuser) {
    var params = {
        "method": "updateUser",
        "userid": user.id,
        "token": user.token,
        "params": {
            "name": upuser.name,
            "sex": upuser.sex,
            "nationId": upuser.nationId,
            "provinceId": upuser.provinceId,
            "cityId": upuser.cityId,
            "countyId": upuser.countyId,
            "birthday": upuser.birthday
        }
    };

    updateUserHttp(params,function (status, re) {
        if(status != "SUCCESS"){
            alert("网络错误，请稍候重试");
            return;
        }

        var data = {
            "method": "userInfo",
            "userid": user.id,
            "token": user.token,
            "params": {
                "userId": user.id
            }
        };
        userInfoHttp(data,function (status, re) {
            if(status != "SUCCESS"){
                return;
            }
            re.result.token = user.token;
            setUserInfo(re.result);
            openSuccess();
        });
    });
}

/**
 * 性别
 */
function getGenderList() {
    var genderEl = $("#gender");
    var genderList = [{id: "0", name: "男"}, {id: "1", name: "女"}, {id: "2", name: "保密"}];

    genderList.forEach(function (item) {
        optionAppendHtml(genderEl, item, user.sex, isGenderInit);
    });
    genderEl.selectmenu().selectmenu('refresh');

    if(isGenderInit){
        isGenderInit = false;
        genderId = user.sex;
    }
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
            optionAppendHtml(nationEl, item, user.nationId, isNationInit);
        });
        nationEl.selectmenu().selectmenu('refresh');

        if(isNationInit){
            isNationInit = false;
            nationId = user.nationId;
        }
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
            optionAppendHtml(provinceEl, item, user.provinceId, isProvinceInit);
        });
        provinceEl.selectmenu().selectmenu('refresh');
        if(isProvinceInit){
            isProvinceInit = false;
            provinceId = user.provinceId;
        }
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
            optionAppendHtml(cityEl, item, user.cityId, isCityInit);
        });
        cityEl.selectmenu().selectmenu('refresh');

        if(isCityInit){
            isCityInit = false;
            cityId = user.cityId;
            return;
        }

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
            optionAppendHtml(countyEl, item, user.countyId, isCountyInit);
        });
        countyEl.selectmenu().selectmenu('refresh');

        if(isCountyInit){
            isCountyInit = false;
            countyId = user.countyId;
        }
    });
}
function optionAppendHtml(el,item, elid, init) {
    var option = $("<option></option>").text(item.name).val(item.id);
    if(init && item.id == elid){
        option.attr("selected", true);
    }
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
 * 修改信息
 * @param data
 * @param callback
 */
function updateUserHttp(data, callback) {
    var url_updateUser = url + "/userInfo!request.action";
    httpRequest(url_updateUser, data, callback);
}

/**
 * 查询用户信息
 * @param data
 * @param callback
 */
function userInfoHttp(data, callback) {
    var url_userInfo = url + "/userInfo!request.action";
    httpRequest(url_userInfo, data, callback);
}

/**
 * 修改头像
 * @param data
 * @param callback
 */
function updateHeadImageHttp(data, callback) {
    var url_updateHeadImage = url + "/userInfo!request.action";
    httpRequest(url_updateHeadImage, data, callback);
}