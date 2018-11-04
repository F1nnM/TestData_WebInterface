<?php
//the script to comunicate with the arduino

    require("./checkLogin.php");

    //define output as event-strem, to be usable for an eventsource
    header('Content-Type: text/event-stream');
    header('Cache-Control: no-cache');

    include './phpserial.php';

    write("retry: 999999999\ndata: \n\n");

    $serial = new PhpSerial;

    //find the serial device and connect to it
    $serial->deviceSet(glob("/dev/ttyACM*")[0]);

    //configure the device
    $serial->confBaudRate(19200);
    $serial->confParity("none");
    $serial->confCharacterLength(8);
    $serial->confStopBits(1);

    $success = $serial->deviceOpen();

    if($success==false){
        die("event: connectionerror\ndata: Failed to open device!\n\n");
    }

    //wait at most 10 seconds for an answer of the arduion.
    //if nothing arrives, send an error
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

    //wait until the user starts the test and notifies the server
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
        //read from the serial port
        $read .= $serial->readPort();
        if(trim($read)===""){
            sleep(1);
            continue;
        }
        //use the regex-replace function to iterate over all matches, send them to the client and remove them from the input string, but keep everything that could be an event
        $read = preg_replace_callback("/-?\d+;\s*/m", function($match){
            $GLOBALS['count']++;
            write("event: data\ndata: ".$match[0]."\n\n");
            return "";
        }, $read);
        //stop the recording if the the test finishes or a error occurs
        if(strpos($read,"stopTest")!==false) break;
        if(strpos($read,"errorTest")!==false){
            //extract the errormessage
            preg_match_all("/errorTest: \K[^;]*/m", $read, $matches, PREG_SET_ORDER, 0);
            write("event: testerror\ndata: ".$matches[0][0]."\n\n");
            break;
        }
    }
    write("event: stopped\ndata: $count\n\n");
    customExit();

    //function that ensures, that writing happens instantly and nothing is stuck in buffers
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