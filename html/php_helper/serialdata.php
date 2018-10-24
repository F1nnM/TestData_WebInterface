<?php

require("./checkLogin.php");

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

include './phpserial.php';

write("retry: 999999999\ndata: \n\n");

$serial = new PhpSerial;

write(glob("/dev/ttyACM*")[0]);
$serial->deviceSet(glob("/dev/ttyACM*")[0])."\n";

$serial->confBaudRate(19200);
$serial->confParity("none");
$serial->confCharacterLength(8);
$serial->confStopBits(1);

$success = $serial->deviceOpen();

if($success==false){
    die("event: connectionerror\ndata: Failed to open device!\n\n");
}

$starttime = time();
$read = "";
while(true&&!connection_aborted()){
    $read .= $serial->readPort();
    if(!trim($read)==="") write($read);
    if(strpos($read,"connected")!==false) break;
    if((time()-$starttime)>10){
        write("event: connectionerror\ndata: Failed to establish a connection: Timeout!\n\n");
        $serial->deviceClose();
        customExit();
    }
    sleep(1);
}

write("event: connected\ndata: \n\n");

$read = "";
while(true&&!connection_aborted()){
    $read .= $serial->readPort();
    if(strpos($read,"startTest")!==false) break;
    sleep(1);
}
write("event: started\ndata: \n\n");

$read = "";
$count = 0;
while(true&&!connection_aborted()){
    $read .= $serial->readPort();
    if(trim($read)===""){
        sleep(1);
        continue;
    }
    $read = preg_replace_callback("/-?\d+;\s*/m", function($match){
        $GLOBALS['count']++;
        write("event: data\ndata: ".$match[0]."\n\n");
        return "";
    }, $read);
    if(strpos($read,"stopTest")!==false) break;
    if(strpos($read,"errorTest")!==false){
        preg_match_all("/errorTest: \K[^;]*/m", $read, $matches, PREG_SET_ORDER, 0);
        write("event: testerror\ndata: ".$matches[0][0]."\n\n");
        break;
    }
}
write("event: stopped\ndata: $count\n\n");
customExit();

function write($str){
    echo $str."\n";
    while (ob_get_level() > 0) {
        ob_end_flush();
    }
    flush();
}

function customExit(){
    write("Exiting..");
    $serial->deviceClose();

    exit();
}
?>