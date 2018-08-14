$(function () {
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

        onNextClick(phone, code);
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

function onNextClick(phone, code) {
    var params = {
        "method": "validateCode",
        "userid": "",
        "token": "",
        "params": {
            "phone": phone,
            "type":"2",
            "code": code
        }
    };

    validateCodeHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            erroMsg(re.status.message);
            return;
        }
        location.href = "reset.html?phone="+phone+"&code="+code;
    })
}

function getCode(phone) {
    var params = {
        "method": "getCode",
        "userid": "",
        "token": "",
        "params": {
            "phone": phone,
            "type":"2"
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
 * 错误提示
 * @param msg
 */
function erroMsg(msg) {
    $(".error").css("display","block");
    $(".error").children('.msg').text(msg);
}

/** 请求 **/
function getCodeHttp(data, callback) {
    var url_getcode = url + "/userInfo!request.action";
    httpRequest(url_getcode, data, callback);
}
function validateCodeHttp(data, callback) {
    var url_validateCode = url + "/userInfo!request.action";
    httpRequest(url_validateCode, data, callback);
}