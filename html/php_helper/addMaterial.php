<?php
    require("./checkLogin.php");

    $dbhost = "localhost:3306";
    $dbuser = "web_user";
    $dbpass = "web_pass";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    if(! $conn ) {
        http_response_code(500);
    }
    mysqli_select_db($conn, "wsem");

    /*for ($i=1; $i < 51; $i++) {
        $first = md5("1abc$i");
        $second = md5("1def$i");
        $third = md5("1ghi$i");
        $forth =  md5("1jkl$i");
        $sql = "INSERT INTO `materials` (`ID`, `Alias`, `Type`) VALUES ($i, '$first', '1'), ($i, '$second', '1'), ($i, '$third', '1'), ($i, '$forth', '1');";
        mysqli_query($conn, $sql);
        
    }
    for ($i=51; $i < 101; $i++) {
        $first = md5("2abc$i");
        $second = md5("2def$i");
        $third = md5("2ghi$i");
        $forth =  md5("2jkl$i");
        $sql = "INSERT INTO `materials` (`ID`, `Alias`, `Type`) VALUES ($i, '$first', '2'), ($i, '$second', '2'), ($i, '$third', '2'), ($i, '$forth', '2');";
        mysqli_query($conn, $sql);
    }*/

    $sql = "INSERT INTO `materials` (`ID`, `Alias`, `Type`) VALUES ('".$_POST[id]."', '".$_POST[alias]."', '".$_POST[type]."');";
    echo $sql;
    if(!mysqli_query($conn, $sql)){
        echo mysqli_error($conn);
    }
?>