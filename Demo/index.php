<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

//if user already logged in redirect to menu
if(isset($_SESSION["username"])) header('Location: ./main.php');

//if user clicked login
if(isset($_POST["user"])&&isset($_POST["pass"])){

    $pass = $_POST["pass"];

    $dbhost = "localhost:3306";
    $dbuser = "finn";
    $dbpass = "__PASSWORT__";
    $conn = mysqli_connect($dbhost, $dbuser, $dbpass);
    if(! $conn ) {
        http_response_code(500);
    }
    mysqli_select_db($conn, "finnswebDB");

    $user = mysqli_real_escape_string($conn,$_POST["user"]);
    $res = mysqli_fetch_assoc(mysqli_query($conn, "SELECT * FROM `users` WHERE `username` = '$user';"));

    //check if password matches with database
    if(password_verify($pass, $res["password"])){
        //save permissions
        $_SESSION["username"] = $user;
        $_SESSION["permission-live"] = ($res["permission-live"]==true);
        $_SESSION["permission-viewAll"] = ($res["permission-viewAll"]==true);
        $_SESSION["permission-viewOwn"] = ($res["permission-viewOwn"]==true);
        $_SESSION["permission-settingsTool"] = ($res["permission-settingsTool"]==true);
        $_SESSION["permission-settingsUser"] = ($res["permission-settingsUser"]==true);
        header("Location: ./main.php");
    }

}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script src="./js/jquery.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Dosis" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="./css/reset.css">
    <title>LogIn</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            overflow: hidden;
        }

        bg {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: -2000;
            background-image: url("bg.jpg");
            background-position: center;
            background-size: contain;
            animation: blur 1.5s ease 0.5s 1 normal both;
        }

        @keyframes blur {
            from {
                filter: unset;
            }
            to {
                filter: blur(5px);
            }
        }

        login {
            top: 50%;
            left: 50%;
            padding: 20px;
            display: block;
            position: absolute;
            background: linear-gradient(#757575, #dfdfdf);
            width: 17vw;
            animation: fadeIn 1.5s ease 0.5s 1 normal both;
        }

        @keyframes fadeIn {
            from {
                transform: translate(-50%,-20%);
                opacity: 0;
            }
            to {
                transform: translate(-50%, -50%);
                opacity: 1;
            }
        }

        login * {
            display: block;
        }

        label {
            margin: 5px;
            font-size: x-large;
        }

        input {
            padding: 5px;
            border-radius: 5px;
            border: 1px solid #5f5f5f;
            outline: none;
            width: 100%;
        }

        input:focus {
            border-color: #1b1b1b;
        }

        button {
            padding: 5px;
            margin-top: 10px;
            margin-right: 10px;
            float: right;
        }
    </style>
</head>

<body>
    <bg></bg>
    <login>
        <form action="./index.php" method="post">
            <label for="username">Username: </label>
            <input id="username" name="user">
            <label for="password">Password: </label>
            <input type="password" name="pass" id="password">
            <button type="submit">Login</button>
        </form>
    </login>
</body>

</html>
<?php
    session_write_close();
?>