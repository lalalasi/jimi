$(function () {
    var phone = GetQueryString("phone");
    var code = GetQueryString("code");

    if(phone == null || code== null){
        location.href = "forget.html";
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

        onConfirmClick(phone, password, code);
    });

})

function onConfirmClick(phone, password, code) {
    var params = {
        "method": "findPwd",
        "userid": "",
        "token": "",
        "params": {
            "phone": phone,
            "code": code,
            "password": password
        }
    };

    findePwdHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            erroMsg(re.status.message);
            return;
        }

        openSuccess(1);
        setTimeout(function () {
            location.href = "login.html";
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
function findePwdHttp(data, callback) {
    var url_findPwd = url + "/userInfo!request.action";
    httpRequest(url_findPwd, data, callback);
}