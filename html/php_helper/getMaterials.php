<?php
    require("./checkLogin.php");

    header('Content-type: text/plain');
    $dbhost = "localhost:3306";
    $dbuser = "web_user";
    $dbpass = "web_pass";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    if(! $conn ) {
        http_response_code(500);
    }
    mysqli_select_db($conn, "wsem");
    $result = mysqli_query($conn, "SELECT * FROM `materials`;");
    if(!$result) http_response_code(500);
    $result = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $materials = [
        1 => [],
        2 => []
    ];
    foreach ($result as $row) {
        if(!isset($materials[$row["Type"]][$row["ID"]])) $materials[$row["Type"]][$row["ID"]] = [];
        array_push($materials[$row["Type"]][$row["ID"]], $row["Alias"]);
    }
    $result = mysqli_query($conn, "SELECT max(ID) from materials;");
    if(!$result) http_response_code(500);
    $result = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $materials["maxId"]=$result[0]["max(ID)"];
    echo json_encode($materials);
?>

