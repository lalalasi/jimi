$(function () {
    var openid = GetQueryString("openid");
    var type = GetQueryString("type");
    var phone = GetQueryString("phone");
    var code = GetQueryString("code");

    if(!openid || !type ||!phone || !code){
        location.href = "login.html";
        return;
    }

    $(".reset-btn").on("click", function () {
        var password = $(".password").val();
        var twopassword = $(".twopassword").val();

        if(!reg.password.test(password) || !reg.password.test(twopassword)){
            erroMsg("密码不能小于6位");
            return;
        }
        if(password != twopassword){
            erroMsg("两次密码输入不一致");
            return;
        }

        onConfirmClick(openid, type, phone, password, code);
    });

})

function onConfirmClick(openid, type, phone, password, code) {
    var params = {
        "method": "thirdBindPhone",
        "userid": "",
        "token": "",
        "params": {
            "uniqueId": openid,
            "type": type,
            "phone": phone,
            "password": password,
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
        openSuccess(1);

        setTimeout(function () {
            location.href = "index.html";
        },1000);
    })
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