<?php
//used by the overview of all experiments to delete a certain test

    require("./checkLogin.php");

    if(!isset($_POST["id"])) die();

    //log in to database
    $dbhost = "localhost:3306";
    $dbuser = "finn";
    $dbpass = "f1i1n1n1";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    if(! $conn ) {
        http_response_code(500);
    }
    mysqli_select_db($conn, "finnswebDB");
    $id = $_POST["id"];

    //query to delete the test with the passed id
    if(!mysqli_query($conn, "DELETE FROM `experiments` WHERE `experiments`.`ID` = $id")) http_response_code(500);
?>

