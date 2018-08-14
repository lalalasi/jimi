var questionlist = getQuestionList();
var id = GetQueryString("id");

$(function () {
    if(!id){
        loadQlist();
    } else {
        loadQitem(id);
    }
});

var loadQlist = function () {
    for (var questionItem of questionlist){
        qlistAppendHtml(questionItem);
    }
}
function qlistAppendHtml(data) {
    $("#qlist").append('<li><a href="guanyujianceitem.html?id='+data.id+'">'+data.title+'</a></li>');
}

var loadQitem = function (id) {
    for (var questionItem of questionlist){
        if(questionItem.id == id){
            qitemAppendHtml(questionItem);
        }
    }
}
function qitemAppendHtml(data) {
    $("#qwen").text("Q："+data.title);
    $("#qda").html("A:"+data.conten);
}