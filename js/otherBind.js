var openid = GetQueryString("openid");
var type = GetQueryString("type");
var existStatus; //是否注册

$(function () {
    if(!openid || !type){
        location.href = "login.html";
        return;
    }

    $(".nextbtn").on("click", function () {

        var phone = $(".username").val();
        var code = $(".code").val();

        if(!reg.phone.test(phone)){
            erroMsg("请输入正确的手机号");
            return;
        }
        if(!reg.code.test(code)){
            erroMsg("验证码必须是6位整数");
            return;
        }
        if(existStatus == null){
            erroMsg("请获取验证码");
            return;
        }

        if(existStatus == 0){
            location.href = "otherReset.html?openid="+openid+"&type="+type+"&phone="+phone+"&code="+code;
        } else {
            onBind(phone, code);
        }
    });

    $('.sendcode').click(function() {
        if($(this).hasClass("disabled")){
            return;
        }
        codeCountDown(10);
        var phone = $(".username").val();
        getCode(phone);
    });
})

function onBind(phone, code) {
    var params = {
        "method": "thirdBindPhone",
        "userid": "",
        "token": "",
        "params": {
            "uniqueId": openid,
            "type": type,
            "phone": phone,
            // "password":"",
            "code": code
        }
    };

    userInfoHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            erroMsg(re.status.message);
            return;
        }

        //绑定成功跳转首页
        setUserInfo(re.result);
        location.href = "index.html";
    });
}

function getCode(phone) {
    var params = {
        "method": "getCode",
        "userid": "",
        "token": "",
        "params": {
            "phone": phone,
            "type": "3",
            "bindType": type
        }
    };

    userInfoHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            erroMsg(re.status.message);
            return;
        }

        existStatus = re.result.existStatus;
    })
}

function codeCountDown(time) {
    var ss = time;

    var clearTimeout = setInterval(function () {
        --ss;
        if(ss<1){
            clearInterval(clearTimeout);
            $(".sendcode").text("发送验证码");
            $(".sendcode").removeClass("disabled");
            return;
        }
        $(".sendcode").text(ss);
        $(".sendcode").addClass("disabled");
    },1000)
}

/**
 * 错误提示
 * @param msg
 */
function erroMsg(msg) {
    $(".error").css("display","block");
    $(".error").children('.msg').text(msg);
}

/** 请求 **/
function userInfoHttp(data, callback) {
    var url_userInfo = url + "/userInfo!request.action";
    httpRequest(url_userInfo, data, callback);
}