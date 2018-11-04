<?php
//used to log all actions by a user

     if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    require("./checkLogin.php");

    //log in to database
    $dbhost = "localhost:3306";
    $dbuser = "finn";
    $dbpass = "__PASSWORT__";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    if(! $conn ) {
        http_response_code(500);
    }
    mysqli_select_db($conn, "finnswebDB");

    //SQL-query to add the material/alias to the databases
    $sql = "INSERT INTO `materials` (`ID`, `Alias`, `Type`) VALUES ('".$_POST[id]."', '".$_POST[alias]."', '".$_POST[type]."');";
    echo $sql;
    if(!mysqli_query($conn, $sql)){
        http_response_code(500);
    }
?> 
