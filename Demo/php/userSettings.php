<?php
    //check if a user is logged in
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    require("../php_helper/checkLogin.php");
?>
<div id="content">
    <div id="tablewrapper">
        <table id="usertable">
            <thead>
                <tr>
                    <th rowspan="2">Nutzername</th>
                    <th rowspan="2">Passwort</th>
                    <th colspan="4">Berechtigungen</th>
                </tr>
                <tr>
                    <th>Aufnehmen</th>
                    <th>Eigene Tests sehen</th>
                    <th>Alle Tests sehen</th>
                    <th>Nutzer verwalten</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div id="buttonwrapper">
        <input id="name" placeholder="Nutzername">
        <input id="pass" placeholder="Passwort">
        <button onclick="addUser()">Nutzer hinzufügen</button>
    </div>
</div>
<?php
    session_write_close();
?>