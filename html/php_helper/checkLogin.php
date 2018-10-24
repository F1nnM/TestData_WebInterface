<?php
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