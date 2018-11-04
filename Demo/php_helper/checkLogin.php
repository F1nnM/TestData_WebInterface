<?php
//used to check wether a user is logged in
//WARNING/TODO: does not check the permission of a user
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    if(!isset($_SESSION["username"])){
        session_destroy();
        http_response_code(403);
        session_write_close();
        exit();
    }
    session_write_close();
?>