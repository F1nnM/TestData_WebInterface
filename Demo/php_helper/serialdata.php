<?php
//the script to comunicate with the arduino

ob_start();

    require("./checkLogin.php");

    //define output as event-strem, to be usable for an eventsource
    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');

    write("retry: 999999999\ndata: \n\n");

    $starttime = time();
    while((time()-$starttime)<5){
        usleep(100000);
    }
    write("event: connected\ndata: \n\n");

     $starttime = time();
    while((time()-$starttime)<5){
        usleep(100000);
    }
    write("event: started\ndata: \n\n");

    $x = 0;
    while ($x<1000){
        $y = ((-(cos($x/30)*100)+100)*100-(rand(0,2000)-1000))*10;
        write("event: data\ndata: ".$y."\n\n");
        $x++;
        usleep(10000);
    }
    write("event: stopped\ndata: 1000\n\n");
    customExit();

    //function that ensures, that writing happens instantly and nothing is stuck in buffers
    function write($str){
        echo $str."\n";
        ob_flush();
        flush();
        /*while (ob_get_level() > 0) {
            ob_end_flush();
        }
        flush();*/
    }

    function customExit(){
        write("Exiting..");

        exit();
    }
?>