/**
 * 应用主程序配置必须引用
*/

/**
 * 初始化加载必要CSS和JS
 * 注意脚本加载顺序
 */
loadCss("css/jquery-ui.min.css");
loadCss("assets/fonts/iconfont.css");
loadCss("css/common.css");
loadCss("css/pageCode.css");

loadScript("js/jquery-1.10.1.min.js");
loadScript("js/jquery.cookie.js");
loadScript("js/jquery-ui.min.js");
// loadScript("js/jquery.nicescroll.min.js");
loadScript("js/jquery.page.js");
loadScript("js/aes.js");
loadScript("js/commonEncrypDecryp.js");
loadScript("js/mode-ecb.js");
loadScript("js/const.js");
loadScript("js/service.js");
loadScript("js/common.js");
loadScript("components/popup/popup.js");
loadScript("js/match.js");

/**
 * 写入css
 */
function loadCss(path){
    document.write("<link href='"+path+"' rel='stylesheet'>");
}

/**
 * 写入javascript
 */
function loadScript(path){
    document.write("<script src='"+path+"'></script>");
}