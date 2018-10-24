<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    if(!isset($_SESSION["username"])){
        session_destroy();
        require("./php_helper/logout.php");
    }
?>
<!DOCTYPE html>
<html>
<head>
    <title>Preview</title>
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <script src="./js/jquery.js"></script>
    <script src="./js/main.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Dosis" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="./css/reset.css">
    <link rel="stylesheet" type="text/css" href="./css/main.css">

</head>

<body onload="init();">
    <div id="bg"></div>
    <div id="loaded_content"></div>
    <link rel="stylesheet" type="text/css" id="loaded_style">
    <div id="footer">
        <div id="username">
            <span>Nutzer: <?php echo $_SESSION["username"]?></span>
            <div title="Abmelden" id="logout" onclick="logout();"></div>
        </div>
        <div id="menu">
            <div class="btn" id="live" <?php if($_SESSION["permission-live"]) { ?>onclick="changeLocation('live');" state="enabled"><?php } else { ?> state="disabled"><?php } ?></div>
            <div class="btn" id="view" <?php if($_SESSION["permission-viewAll"]||$_SESSION["permission-viewOwn"]) { ?>onclick="changeLocation('view');" state="enabled"><?php } else { ?> state="disabled"><?php } ?></div>
            <div class="btn" id="home" onclick="changeLocation('menu');" state="enabled"></div>
            <div class="btn" id="settings" <?php if($_SESSION["permission-settingsTool"]||$_SESSION["permission-settingsUser"]) { ?>onclick="changeLocation('settings');" state="enabled"><?php } else { ?> state="disabled"><?php } ?></div>
            <div class="btn" id="infos" onclick="changeLocation('info');" state="enabled"></div>
        </div>
        <div id="data">
            <img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTQ1NC4yNzIsMGgtNDguOTM5QzM5My41MzYsMCwzODQsOS41NTcsMzg0LDIxLjMzM2MwLDAuMjEzLTAuOTE3LDIxLjMzMy0yMS4zMzMsMjEuMzMzICAgIGMtMTkuNzk3LDAtMjEuMzMzLTE2LjM0MS0yMS4zMzMtMjEuMzMzQzM0MS4zMzMsOS41NTcsMzMxLjc5NywwLDMyMCwwSDU3LjcyOEMyNS44OTksMCwwLDI1Ljg5OSwwLDU3Ljc0OXY0OC45MTcgICAgQzAsMTE4LjQ0Myw5LjUzNiwxMjgsMjEuMzMzLDEyOGgyMS4zMzN2NDIuNjY3SDIxLjMzM0M5LjUzNiwxNzAuNjY3LDAsMTgwLjIyNCwwLDE5MnYyNjIuMjUxQzAsNDg2LjEwMSwyNS44OTksNTEyLDU3LjcyOCw1MTIgICAgSDMyMGMxMS43OTcsMCwyMS4zMzMtOS41NTcsMjEuMzMzLTIxLjMzM2MwLTE0LjE2NSw3LjE4OS0yMS4zMzMsMjEuMzMzLTIxLjMzM2MxNC4xNDQsMCwyMS4zMzQsNy4xNjcsMjEuMzM0LDIxLjMzMyAgICBjMCwxMS43NzYsOS41MzYsMjEuMzMzLDIxLjMzMywyMS4zMzNoNDguOTM5QzQ4Ni4xMDEsNTEyLDUxMiw0ODYuMTAxLDUxMiw0NTQuMjUxVjU3Ljc0OUM1MTIsMjUuODk5LDQ4Ni4xMDEsMCw0NTQuMjcyLDB6ICAgICBNNDA1LjMzMywyNzcuMzMzaC00Mi42NjdWMzIwSDM4NGMxMS43OTcsMCwyMS4zMzMsOS41NTcsMjEuMzMzLDIxLjMzM3MtOS41MzYsMjEuMzMzLTIxLjMzMywyMS4zMzNoLTIxLjMzM1YzODQgICAgYzAsMTEuNzc2LTkuNTM2LDIxLjMzMy0yMS4zMzMsMjEuMzMzQzMyOS41MzYsNDA1LjMzMywzMjAsMzk1Ljc3NiwzMjAsMzg0di0yMS4zMzNoLTQyLjY2N3Y0Mi42NjcgICAgYzAsMTEuNzc2LTkuNTM2LDIxLjMzMy0yMS4zMzMsMjEuMzMzcy0yMS4zMzMtOS41NTctMjEuMzMzLTIxLjMzM3YtNDIuNjY3SDE5MlYzODRjMCwxMS43NzYtOS41MzYsMjEuMzMzLTIxLjMzMywyMS4zMzMgICAgcy0yMS4zMzMtOS41NTctMjEuMzMzLTIxLjMzM3YtMjEuMzMzSDEyOGMtMTEuNzk3LDAtMjEuMzMzLTkuNTU3LTIxLjMzMy0yMS4zMzNzOS41MzYtMjEuMzMzLDIxLjMzMy0yMS4zMzNoMjEuMzMzdi00Mi42NjcgICAgaC00Mi42NjdjLTExLjc5NywwLTIxLjMzMy05LjU1Ny0yMS4zMzMtMjEuMzMzczkuNTM2LTIxLjMzMywyMS4zMzMtMjEuMzMzaDQyLjY2N1YxOTJIMTI4Yy0xMS43OTcsMC0yMS4zMzMtOS41NTctMjEuMzMzLTIxLjMzMyAgICBzOS41MzYtMjEuMzMzLDIxLjMzMy0yMS4zMzNoMjEuMzMzVjEyOGMwLTExLjc3Niw5LjUzNi0yMS4zMzMsMjEuMzMzLTIxLjMzM3MyMS4zMzMsOS41NTcsMjEuMzMzLDIxLjMzM3YyMS4zMzNoNDIuNjY3di00Mi42NjcgICAgYzAtMTEuNzc2LDkuNTM2LTIxLjMzMywyMS4zMzMtMjEuMzMzczIxLjMzMyw5LjU1NywyMS4zMzMsMjEuMzMzdjQyLjY2N0gzMjBWMTI4YzAtMTEuNzc2LDkuNTM2LTIxLjMzMywyMS4zMzMtMjEuMzMzICAgIHMyMS4zMzMsOS41NTcsMjEuMzMzLDIxLjMzM3YyMS4zMzNIMzg0YzExLjc5NywwLDIxLjMzMyw5LjU1NywyMS4zMzMsMjEuMzMzUzM5NS43OTcsMTkyLDM4NCwxOTJoLTIxLjMzM3Y0Mi42NjdoNDIuNjY3ICAgIGMxMS43OTcsMCwyMS4zMzMsOS41NTcsMjEuMzMzLDIxLjMzM1M0MTcuMTMxLDI3Ny4zMzMsNDA1LjMzMywyNzcuMzMzeiIgZmlsbD0iIzAwMDAwMCIvPgoJPC9nPgo8L2c+CjxnPgoJPGc+CgkJPHJlY3QgeD0iMTkyIiB5PSIxOTIiIHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=="
            />
            <span>Serverlast: </span>
            <span id="load"></span>
        </div>
    </div>
</body>

</html>
<?php
    session_write_close();
?>