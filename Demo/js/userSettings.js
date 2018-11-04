//fetch all users from the server
users = [];
$.get("./php_helper/getUsers.php", {}, function(data){
    users = JSON.parse(data);
    //add all users to a table
    users.forEach(user => {
        $("#usertable tbody")[0].innerHTML += "<tr><td>" + user["username"] + "</td><td>" + "Ändern" + "</td><td>" + (user["permission-live"] == "1" ? "Ja" : "Nein") + "</td><td>" + (user["permission-viewOwn"] == "1" ? "Ja" : "Nein") + "</td><td>" + (user["permission-viewAll"] == "1" ? "Ja" : "Nein") + "</td><td>" + (user["permission-settingsUser"] == "1" ? "Ja" : "Nein") +"</td></tr>";
    });
    //add hnadlers for the table cells
    for(i = 0; i<users.length; i++){
        $("#usertable tbody tr:nth-child("+(i+1)+") td")[1].onclick = changePassHandler(users[i]["username"]);
        $("#usertable tbody tr:nth-child(" + (i + 1) + ") td")[2].onclick = changePermissionHandler(users[i]["username"], "permission-live");
        $("#usertable tbody tr:nth-child(" + (i + 1) + ") td")[3].onclick = changePermissionHandler(users[i]["username"], "permission-viewOwn");
        $("#usertable tbody tr:nth-child(" + (i + 1) + ") td")[4].onclick = changePermissionHandler(users[i]["username"], "permission-viewAll");
        $("#usertable tbody tr:nth-child(" + (i + 1) + ") td")[5].onclick = changePermissionHandler(users[i]["username"], "permission-settingsUser");
    }
});

//handler for the password cell
function changePassHandler(user){
    return function(){
        //ask for a new password
        var pass = prompt("Neues Passwort: ");
        if(pass == null) return;
        if(pass == "") {
            alert("Bitte gib ein Passwort ein!");
            return;
        }
        //check if the password meets the following criteria:
        //  At least 12 characters
        //  At least one uppercase letter
        //  At least one lowercase letter
        //  At least one number
        //  At least one of the following characters: _.*-+:#!?%{}|@[];=“&$\/,()
        if (!(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})(?=.*[\_\*\-\+\:\!\?\%\{\}\|\@\[\]\;\=\"\&\$\\\/\,\(\)])/g).test(pass))
            //the user is warned that the password doesn't fullfill all of the criteria, however he is allowed to continue
            if(!confirm("Das Passwort sollte folgende Kriterien erfüllen:\n  Ein Kleinbuchtabe\n  Ein Großbuchstabe\n  Eine Zahl\n  Ein Sonderzeichen\n  Mindestens 8 Zeichen\nTrotzdem fortfahren?")) return;
        //if the user didn't cancel the new password is getting sent to the server
        $.post("./php_helper/updateUser.php", {user: user, pass: ""});
        reloadLocation();
    }
}
//function that returns a function, so the variables in the handler are enclosed and not influenced by any changes to other variables
function changePermissionHandler(user, permission){
    return function(){
        val = (this.innerText == "Ja" ? "0" : "1");
        $.post("./php_helper/updateUser.php", { user: user, perm: permission, val: val });
        reloadLocation();
    }
}

//function to add a new user
function addUser() {
    pass = $("#pass")[0].value
    //check if the password meets the following criteria:
    //  At least 12 characters
    //  At least one uppercase letter
    //  At least one lowercase letter
    //  At least one number
    //  At least one of the following characters: _.*-+:#!?%{}|@[];=“&$\/,()
    if (!(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})(?=.*[\_\*\-\+\:\!\?\%\{\}\|\@\[\]\;\=\"\&\$\\\/\,\(\)])/g).test(pass))
        //the user is warned that the password doesn't fullfill all of the criteria, however he is allowed to continue
        if (!confirm("Das Passwort sollte folgende Kriterien erfüllen:\n  Ein Kleinbuchtabe\n  Ein Großbuchstabe\n  Eine Zahl\n  Ein Sonderzeichen\n  Mindestens 8 Zeichen\nTrotzdem fortfahren?")) return;

    //save user on server
    $.post("./php_helper/createuser.php", {user: $("#name")[0].value, pass: pass}, function(){
        reloadLocation();
    }).fail(function(){
        alert("failed");
    });
}