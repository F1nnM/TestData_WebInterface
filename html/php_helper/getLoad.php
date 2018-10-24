<?php
require("./checkLogin.php");


header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$ncpu = 1;

if(is_file('/proc/cpuinfo')) {
    $cpuinfo = file_get_contents('/proc/cpuinfo');
    preg_match_all('/^processor/m', $cpuinfo, $matches);
    $ncpu = count($matches[0]);
}

while(true){
    echo "event: load\ndata: ".sys_getloadavg()[0]/$ncpu."\n\n";
    while (ob_get_level() > 0) {
        ob_end_flush();
    }
    flush();
    sleep(2);
}

?>
