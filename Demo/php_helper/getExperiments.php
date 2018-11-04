<?php
//used to fetch all data (except the curve) of all experiments
    require("./checkLogin.php");
    
    //log in to database
    $dbhost = "localhost:3306";
    $dbuser = "finn";
    $dbpass = "f1i1n1n1";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    mysqli_select_db($conn, "finnswebDB");

    if(! $conn )  http_response_code(500);

    //depending on the permission query all experiments or only the ones by the logged in user
    if($_SESSION["permission-viewAll"]) $result = mysqli_query($conn, "SELECT `ID`, `Type`, `Material1`, `Material2`, `Creator`, `Description`, `Time`, `Newton` FROM `experiments`;");
    else if($_SESSION["permission-viewOwn"]) $result = mysqli_query($conn, "SELECT `ID`, `Type`, `Material1`, `Material2`, `Creator`, `Description`, `Time`, `Newton` FROM `experiments` WHERE `Creator` = '".$_SESSION["username"]."' ;");
    if(!$result) http_response_code(500);
    $result = mysqli_fetch_all($result, MYSQLI_ASSOC);

    echo json_encode($result);
?>

