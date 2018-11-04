<?php
    //used to add a new user with no permissions to the database
    require("./checkLogin.php");

    if(isset($_POST["user"])&&isset($_POST["pass"])){
        $user = $_POST["user"];
        $pass = password_hash($_POST["pass"],PASSWORD_DEFAULT);
        echo $pass;
        $dbhost = "localhost:3306";
        $dbuser = "finn";
        $dbpass = "__PASSWORT__";
        $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
        if(! $conn ) {
            http_response_code(500);
        }
        mysqli_select_db($conn, "finnswebDB");

        if(!mysqli_query($conn, "INSERT INTO `users` (`username`, `password`) VALUES ('$user', '$pass');")){
            http_response_code(500);
        }

    } else {
        http_response_code(500);
    }
?>
