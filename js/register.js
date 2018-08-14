$(function () {
    $(".register-btn").on("click", function () {

        var phone = $(".username").val();
        var code = $(".code").val();
        var password = $(".password").val();
        var twopassword = $(".twopassword").val();
        var imgcodeinput = $(".imgcodeinput").val();
        var agree = $(".agree").prop("checked");

        if(!reg.phone.test(phone)){
            erroMsg("请输入正确的手机号");
            return;
        }
        if(!reg.code.test(code)){
            erroMsg("验证码必须是6位整数");
            return;
        }
        if(!reg.password.test(password) || !reg.password.test(twopassword)){
            erroMsg("密码不能小于6位");
            return;
        }
        if(password != twopassword){
            erroMsg("两次密码输入不一致");
            return;
        }
        if(imgcodeinput == ""){
            erroMsg("图片验证码不能为空");
            return;
        }
        if(!agree){
            erroMsg("请同意用户协议");
            return;
        }

        register(phone, password, code, imgcodeinput);
    });

    $('.imgcode').attr("src",url+"/imageCode.jsp?"+Math.random());
    $('.imgcode').click(function() {
        $(this).attr("src", $(this).attr("src") +'?'+Math.random());
    });
    $('.sendcode').click(function() {
        if($(this).hasClass("disabled")){
            return;
        }
        codeCountDown(10);
        var username = $(".username").val();
        getCode(username);
    });
})

function register(phone, password, code, pageCode) {
    registerBtnDisabled();

    var params = {
        "method": "register",
        "userid": "",
        "token": "",
        "params": {
            "phone": phone,
            "password": password,
            "code": code,
            "pageCode": pageCode
        }
    };

    registerHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            erroMsg(re.status.message);
            return;
        }
        currentUser = re.result;
        setUserInfo(re.result);
        location.href = "index.html";
    })
}

function getCode(phone) {
    var params = {
        "method": "getCode",
        "userid": "",
        "token": "",
        "params": {
            "phone": phone,
            "type":"1"
        }
    };

    getCodeHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            erroMsg(re.status.message);
            return;
        }
    })
}

function codeCountDown(time) {
    var ss = time;

    $(".sendcode").text(ss);
    $(".sendcode").addClass("disabled");
    var clearTimeout = setInterval(function () {
        --ss;
        if(ss<1){
            clearInterval(clearTimeout);
            $(".sendcode").text("发送验证码")
            $(".sendcode").removeClass("disabled");
            return;
        }
        $(".sendcode").text(ss);
        $(".sendcode").addClass("disabled");
    },1000)
}

/**
 * loader long btn
 */
function registerBtnDisabled() {
    $(".register-btn").attr("disabled",true);
    setTimeout(function () {
        $(".register-btn").attr("disabled",false);
    },2000);
}

/**
 * 注册错误提示
 * @param msg
 */
function erroMsg(msg) {
    $(".error").css("display","block");
    $(".error").children('.msg').text(msg);
}


/** 请求 **/
function registerHttp(data, callback) {
    var url_register = url + "/userInfo!request.action";
    httpRequest(url_register, data, callback);
}
function getCodeHttp(data, callback) {
    var url_getcode = url + "/userInfo!request.action";
    httpRequest(url_getcode, data, callback);
}
