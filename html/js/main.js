
window.onhashchange = function(){
    which = location.hash.substr(1);
    if(which == "") return;
    console.log(which);
    $("#loaded_content")[0].innerHTML = "";
    $("#loaded_style")[0].href = "./css/" + which + ".css";
    $.get("./php/" + which + ".php", {}, function (data) {
        $("#loaded_content")[0].innerHTML = data;
        $.get("./js/" + which + ".js");
        $("title").innerText = which;
    }).fail(function () {
        history.back();
    });
}
function reloadLocation(){
    window.onhashchange();
}
function changeLocation(which) {
    window.location = "#"+which;
}
function logout(){
    $.get("./php_helper/logout.php");
    window.location.replace("./");
}
function init() {
    if (window.location.hash == "" || window.location.hash== "#"){
        window.location.hash = "#menu";
    }else{
        window.onhashchange();
    }
}
source = new EventSource("./php_helper/getLoad.php");
source.addEventListener("load", function () {
    $("#load").text(event.data);
    if (+event.data > 1) {
        $("#load").attr("style", "color: #ff0000; font-weight: bold;");
    } else if (+event.data > 0.75) {
        $("#load").attr("style", "color: #ff6600; font-weight: bold;");
    } else {
        $("#load").attr("style", "color: #000; font-weight: initial;");
    }
});