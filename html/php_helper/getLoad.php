<?php
//the eventsource for the display of the serverload
    require("./checkLogin.php");


    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');

    $ncpu = 1;

    //try to get the number of cpu cores
    if(is_file('/proc/cpuinfo')) {
        $cpuinfo = file_get_contents('/proc/cpuinfo');
        preg_match_all('/^processor/m', $cpuinfo, $matches);
        $ncpu = count($matches[0]);
    }

    while(true){
        //get the number of processes in queue and divide it by the number of cores to get the overall system load
        echo "event: load\ndata: ".sys_getloadavg()[0]/$ncpu."\n\n";

        //make sure nothing is stuck in the output buffer
        while (ob_get_level() > 0) {
            ob_end_flush();
        }
        flush();
        sleep(2);
    }

?>
