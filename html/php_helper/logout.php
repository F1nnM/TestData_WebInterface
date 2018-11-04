<?php
//destroy the session to log the user out
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    session_destroy();
    header("Location: ./");
?>