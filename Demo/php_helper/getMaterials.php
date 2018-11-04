<?php
//used to fetch all saved materials
    require("./checkLogin.php");

    header('Content-type: text/plain');

    //log in to database
    $dbhost = "localhost:3306";
    $dbuser = "finn";
    $dbpass = "__PASSWORT__";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    if(! $conn ) {
        http_response_code(500);
    }
    mysqli_select_db($conn, "finnswebDB");

    //fetch all materials from the database
    $result = mysqli_query($conn, "SELECT * FROM `materials`;");
    if(!$result) http_response_code(500);
    $result = mysqli_fetch_all($result, MYSQLI_ASSOC);

    //structure data for further processing
    $materials = [
        1 => [],
        2 => []
    ];
    foreach ($result as $row) {
        if(!isset($materials[$row["Type"]][$row["ID"]])) $materials[$row["Type"]][$row["ID"]] = [];
        array_push($materials[$row["Type"]][$row["ID"]], $row["Alias"]);
    }

    //fetch the highest ID and append it to the data
    $result = mysqli_query($conn, "SELECT max(ID) from materials;");
    if(!$result) http_response_code(500);
    $result = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $materials["maxId"]=$result[0]["max(ID)"];

    //encode and echo the data
    echo json_encode($materials);
?>

