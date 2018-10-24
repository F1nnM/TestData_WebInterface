<?php
    require("./checkLogin.php");

    $dbhost = "localhost:3306";
    $dbuser = "web_user";
    $dbpass = "web_pass";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    if(! $conn ) {
        echo "argh";
    }
    mysqli_select_db($conn, "wsem");
    mysqli_set_charset($conn,"utf8");

    $type = "'".mysqli_real_escape_string($conn, $_POST["type"])."'";
    $material1 = "'".mysqli_real_escape_string($conn, $_POST["material1"])."'";
    $material2 = "'".mysqli_real_escape_string($conn, $_POST["material2"])."'";
    $creator = "'".mysqli_real_escape_string($conn, $_SESSION["username"])."'";
    $description = "'".mysqli_real_escape_string($conn, $_POST["description"])."'";
    $newton = "'".mysqli_real_escape_string($conn, $_POST["newton"])."'";
    $curve = "'".mysqli_real_escape_string($conn, $_POST["curve"])."'";

    $sql="INSERT INTO `experiments` (`ID`, `Type`, `Material1`, `Material2`, `Creator`, `Description`, `Time`, `Newton`, `Curve`) VALUES (NULL, $type, $material1, $material2, $creator, $description, CURRENT_TIMESTAMP, $newton, $curve)";

    if(!mysqli_query($conn, $sql)){
        echo mysqli_error($conn);
    }else{
        echo $sql;
    }
?>