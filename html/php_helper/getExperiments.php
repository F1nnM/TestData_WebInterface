<?php
    require("./checkLogin.php");
    
    $dbhost = "localhost:3306";
    $dbuser = "web_user";
    $dbpass = "web_pass";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    mysqli_select_db($conn, "wsem");

    if(! $conn )  http_response_code(500);

    if($_SESSION["permission-viewAll"]) $result = mysqli_query($conn, "SELECT `ID`, `Type`, `Material1`, `Material2`, `Creator`, `Description`, `Time`, `Newton` FROM `experiments`;");
    else if($_SESSION["permission-viewOwn"]) $result = mysqli_query($conn, "SELECT `ID`, `Type`, `Material1`, `Material2`, `Creator`, `Description`, `Time`, `Newton` FROM `experiments` WHERE `Creator` = '".$_SESSION["username"]."' ;");
    if(!$result) http_response_code(500);
    $result = mysqli_fetch_all($result, MYSQLI_ASSOC);
    //$experiments = [];
    //foreach ($result as $i => $experiment) {
    //    $experiments[$experiment["ID"]] = $experiment;
    //}
    echo json_encode($result);
?>

