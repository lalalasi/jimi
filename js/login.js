$(function () {
    $(".login-btn").on("click", function () {

        var acc = $(".username").val();
        var pwd = $(".password").val();

        if(!reg.phone.test(acc)){
            accErroMsg("请输入正确的手机号");
            return;
        }
        if(!reg.password.test(pwd)){
            pwdErroMsg("密码不能小于6位");
            return;
        }
        var keep = $(".keep").prop("checked");
        login(acc,pwd,keep);
    });

    $(".password").on("input oninput",function () {
        if($(".password").val().length>0){
            $(".clear").css("display","block");
        } else {
            $(".clear").css("display","none");
        }
    })
    $(".clear").on("click",function () {
        $(".password").val("");
        $(".clear").css("display","none");
    })
})

function login(username,password,keep) {
    loginBtnDisabled();
    setTimeout(loginBtnDisabled,2000);

    var params = {
        "userid": "",
        "method": "login",
        "token": "",
        "params": {
            "phone": username,
            "password": password
        }
    };

    loginHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            if(re.status.code == 305 || re.status.code == 303){
                accErroMsg(re.status.message);
                return;
            }
            if(re.status.code == 315){
                pwdErroMsg(re.status.message);
                return;
            }
            return;
        }
        currentUser = re.result;

        if(!keep){
            setUserInfo(re.result);
        } else {
            $.cookie('userInfo',JSON.stringify(currentUser), { expires: 7, path: '/' });
        }

        location.href = "index.html";
    })
}

/**
 * loader long btn
 */
function loginBtnDisabled() {
    if($(".login-btn").prop("disabled")){
        $(".login-btn").attr("disabled",false);
    } else {
        $(".login-btn").attr("disabled",true);
    }
}

/**
 * 登录错误提示
 * @param msg
 */
function accErroMsg(msg) {
    $(".alert").css("display","none");
    $(".acc-erro").css("display","block");
    $(".acc-erro").children('.msg').text(msg);
}
function pwdErroMsg(msg) {
    $(".alert").css("display","none")
    $(".pwd-erro").css("display","block");
    $(".pwd-erro").children('.msg').text(msg);
}


function loginHttp(data, callback) {
    var url_login = url + "/userInfo!request.action";
    httpRequest(url_login, data, callback);
}

