<?php
//used to save recorded data in the database

    require("./checkLogin.php");

    $dbhost = "localhost:3306";
    $dbuser = "web_user";
    $dbpass = "9C8rVueFDDBDAG6EKYrN";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    if(! $conn ) {
        http_response_code(500);
    }
    mysqli_select_db($conn, "Belastungstests");
    mysqli_set_charset($conn,"utf8");

    //escape all fields to prevent from sql-injections or errors in the sql-statements
    $type = "'".mysqli_real_escape_string($conn, $_POST["type"])."'";
    $material1 = "'".mysqli_real_escape_string($conn, $_POST["material1"])."'";
    $material2 = "'".mysqli_real_escape_string($conn, $_POST["material2"])."'";
    $creator = "'".mysqli_real_escape_string($conn, $_SESSION["username"])."'";
    $description = "'".mysqli_real_escape_string($conn, $_POST["description"])."'";
    $newton = "'".mysqli_real_escape_string($conn, $_POST["newton"])."'";
    $curve = "'".mysqli_real_escape_string($conn, $_POST["curve"])."'";

    $sql="INSERT INTO `experiments` (`ID`, `Type`, `Material1`, `Material2`, `Creator`, `Description`, `Time`, `Newton`, `Curve`) VALUES (NULL, $type, $material1, $material2, $creator, $description, CURRENT_TIMESTAMP, $newton, $curve)";

    if(!mysqli_query($conn, $sql)){
        http_response_code(500);
    }else{
        echo $sql;
    }
?>