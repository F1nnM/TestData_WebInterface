<?php
    require("./checkLogin.php");

    if(!isset($_POST["id"])) die();
    $dbhost = "localhost:3306";
    $dbuser = "web_user";
    $dbpass = "web_pass";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    if(! $conn ) {
        http_response_code(500);
    }
    mysqli_select_db($conn, "wsem");
    $id = $_POST["id"];
    if(!mysqli_query($conn, "DELETE FROM `experiments` WHERE `experiments`.`ID` = $id")) http_response_code(500);
?>

