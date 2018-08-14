window.openSuccess = function(msg){
    msg = (msg == 1 ? false : true);
    $("#mbg").show();
    $("#success").fadeIn(200);
    setTimeout(function(){
        $("#mbg").hide();
        $("#success").hide();
        if(msg){
            window.location.reload();
        }
    },2000);
}
window.openLoader = function(msg){
    $("#mbg").show();
    $("#loader").fadeIn(200);
}
window.closeLoader = function(msg){
    $("#mbg").hide();
    $("#loader").fadeOut(200);
}
window.alert = function(msg){
    $("#mbg").show();
    $("#popmsg").fadeIn(200).find(".tis").html(msg);
}
window.closePmsg = function(){
    $("#mbg").hide();
    $("#popmsg").fadeOut(100);
}
window.wxpopup = function(s){
    $("#mbg").show();
    $("#wxmsg").find(".tis").children().remove();
    $("#wxmsg").fadeIn(200).find(".tis").append($("<img>").attr({"src":s,"widht":"200px","height":"200px"}));
}
window.closeWxMsg = function(){
    $("#mbg").hide();
    $("#wxmsg").fadeOut(100);
}
window.closeWxMsgFail = function(){
    $("#mbg").hide();
    $("#wxmsg").fadeOut(100);
    window.location.href = "goumai.html";
}