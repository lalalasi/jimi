var user = getUserInfo();
$(function () {
    if(!user){
        location.href = "index.html";
    }

    $(".updatePwd").on("click", function () {
        var oldpwd = $(".oldpwd").val();
        var newpwd = $(".newpwd").val();
        var newpwds = $(".newpwds").val();

        if(!oldpwd){
            alert("请输入旧密码");
            return;
        }
        if(!newpwd || !newpwds){
            alert("请输入新密码");
            return;
        }
        if(!reg.password.test(oldpwd) || !reg.password.test(newpwd) || !reg.password.test(newpwds)){
            alert("密码不能小于6位");
            return;
        }
        if(newpwd != newpwds){
            alert("两次密码输入不一致");
            return;
        }

        updatePwd(oldpwd, newpwd);
    });

})

function updatePwd(pwd, newpwd) {
    var params = {
        "method": "updatePwd",
        "userid": user.id,
        "token": user.token,
        "params": {
            "password": pwd,
            "newPassword": newpwd
        }
    };

    userInfoHttp(params,function (status,re) {
        if(status != "SUCCESS"){
            alert(re.status.message)
            $("input").val("");
            return;
        }
        onLogout(user);
    })
}


/** 请求 **/
function userInfoHttp(data, callback) {
    var url_userInfo = url + "/userInfo!request.action";
    httpRequest(url_userInfo, data, callback);
}