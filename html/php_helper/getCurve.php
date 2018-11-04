<?php
//used by the detail view of experiments
    require("./checkLogin.php");

    header('Content-type: text/plain');
    //log in to database
    $dbhost = "localhost:3306";
    $dbuser = "web_user";
    $dbpass = "9C8rVueFDDBDAG6EKYrN";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    if(! $conn ) {
        http_response_code(500);
    }
    mysqli_select_db($conn, "Belastungstests");
    if(isset($_POST["id"])){
        $id = $_POST["id"];
    } else {
        exit();
    }
    
    //SQL-query to fetch the curve
    $result = mysqli_query($conn, "SELECT `Curve` FROM `experiments` WHERE `ID` = '$id' ;");
    if(!$result) http_response_code(500);
    $result = mysqli_fetch_all($result, MYSQLI_ASSOC);
    
    //print the data to the html output
    echo $result[0]["Curve"];
?>

