<?php
    require("./checkLogin.php");

    header('Content-type: text/plain');
    $dbhost = "localhost:3306";
    $dbuser = "finn";
    $dbpass = "f1i1n1n1";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    if(! $conn ) {
        http_response_code(500);
    }
    mysqli_select_db($conn, "finnswebDB");
    $result = mysqli_query($conn, "SELECT max(`ID`) as ID from `experiments`");
    if(!$result) http_response_code(500);
    $result = mysqli_fetch_all($result, MYSQLI_ASSOC);
    echo $result[0]["ID"];
?>

