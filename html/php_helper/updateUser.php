<?php
    require("./checkLogin.php");

    if(isset($_GET["user"])&&(isset($_GET["pass"]))){
        $user = $_GET["user"];
        $pass = password_hash($_GET["pass"],PASSWORD_DEFAULT);
        $dbhost = "localhost:3306";
        $dbuser = "web_user";
        $dbpass = "web_pass";
        $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
        if(! $conn ) {
            http_response_code(500);
        }
        mysqli_select_db($conn, "wsem");

        if(!mysqli_query($conn, "UPDATE `users` SET `password` = '$pass' WHERE `users`.`username` = '$user';")){
            http_response_code(500);
        }

    } else if(isset($_POST["user"])&&isset($_POST["perm"])&&isset($_POST["val"])){
        $user = $_POST["user"];
        $perm = $_POST["perm"];
        $val = $_POST["val"];
        $dbhost = "localhost:3306";
        $dbuser = "web_user";
        $dbpass = "web_pass";
        $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
        if(! $conn ) {
            http_response_code(500);
        }
        mysqli_select_db($conn, "wsem");

        if(!mysqli_query($conn, "UPDATE `users` SET `$perm` = '$val' WHERE `users`.`username` = '$user';")){
            http_response_code(500);
        }

    } else {
        http_response_code(500);
    }
?>
