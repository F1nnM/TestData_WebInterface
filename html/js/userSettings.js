users = [];
$.get("./php_helper/getUsers.php", {}, function(data){
    users = JSON.parse(data);
    users.forEach(user => {
        $("#usertable tbody")[0].innerHTML += "<tr><td>" + user["username"] + "</td><td>" + "Ändern" + "</td><td>" + (user["permission-live"] == "1" ? "Ja" : "Nein") + "</td><td>" + (user["permission-viewOwn"] == "1" ? "Ja" : "Nein") + "</td><td>" + (user["permission-viewAll"] == "1" ? "Ja" : "Nein") + "</td><td>" + (user["permission-settingsUser"] == "1" ? "Ja" : "Nein") +"</td></tr>";
    });
    for(i = 0; i<users.length; i++){
        $("#usertable tbody tr:nth-child("+(i+1)+") td")[1].onclick = changePassHandler(users[i]["username"]);
        $("#usertable tbody tr:nth-child(" + (i + 1) + ") td")[2].onclick = changePermissionHandler(users[i]["username"], "permission-live");
        $("#usertable tbody tr:nth-child(" + (i + 1) + ") td")[3].onclick = changePermissionHandler(users[i]["username"], "permission-viewOwn");
        $("#usertable tbody tr:nth-child(" + (i + 1) + ") td")[4].onclick = changePermissionHandler(users[i]["username"], "permission-viewAll");
        $("#usertable tbody tr:nth-child(" + (i + 1) + ") td")[5].onclick = changePermissionHandler(users[i]["username"], "permission-settingsUser");
    }
});

function changePassHandler(user){
    return function(){
        var pass = prompt("Neues Passwort: ");
        if(pass == null) return;
        if(pass == "") {
            alert("Bitte gib ein Passwort ein!");
            return;
        }
        if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.])(?=.{8,})/g).test(pass))
            if(!confirm("Das Passwort sollte folgende Kriterien erfüllen:\n  Ein Kleinbuchtabe\n  Ein Großbuchstabe\n  Eine Zahl\n  Ein Sonderzeichen\n  Mindestens 8 Zeichen\nTrotzdem fortfahren?")) return;
        
        $.post("./php_helper/updateUser.php", {user: user, pass: ""});
        reloadLocation();
    }
}
function changePermissionHandler(user, permission){
    return function(){
        val = (this.innerText == "Ja" ? "0" : "1");
        $.post("./php_helper/updateUser.php", { user: user, perm: permission, val: val });
        reloadLocation();
    }
}

function addUser() {
    $.post("./php_helper/createuser.php", {user: $("#name")[0].value, pass: $("#pass")[0].value}, function(){
        reloadLocation();
    }).fail(function(){
        alert("failed");
    });
}