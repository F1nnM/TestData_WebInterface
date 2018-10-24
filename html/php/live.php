<?php
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }
    require("../php_helper/checkLogin.php");
?>
<div id="content">
    <div id="options">
        <label for="id">ID: </label>
        <input id="id" disabled>
        <hr>
        <label for="creator">Ersteller: </label>
        <input id="creator" disabled value="<?php echo $_SESSION["username"]?>">
        <hr>
        <label for="desc">Beschreibung: </label>
        <textarea id="desc"></textarea>
        <hr>
        <label for="mat1">Material Fügeteil: </label>
        <button id="mat1" onclick="selectMaterial(1);">Klicken zum Auswählen</button>
        <hr>
        <label for="mat2">Klebstoff: </label>
        <button id="mat2" onclick="selectMaterial(2);">Klicken zum Auswählen</button>
        <hr>
        <label for="type">Belastungsart: </label>
        <select id="type">
            <option>Zug</option>
            <option>Scher</option>
            <option>Benutzerdefiniert</option>
        </select>
        <hr>
        <label for="area">Klebefläche in cm²: </label>
        <input id="area" value="1">
        <hr>
        <label for="newton">Maximale Newton/cm²: </label>
        <input id="newton" disabled value="0">
        <hr>
        <button id="savebtn" onclick="save();" disabled>Speichern</button>
    </div>
    <div id="canvas-wrapper">
        <canvas id="data"></canvas>
        <canvas id="axes"></canvas>
        <div id="smoothing">
            <label id="smoothlabel" for="smoothrate">Datenglättung: 1</label><br>
            <input id="smoothrate" type="range" min="1" max="10" value="1">
            <script>$("#smoothrate").on('input', function() {$('#smoothlabel').text('Datenglättung: '+this.value); repaint(true);});</script>
        </div>
    </div>
    </div>
    <div id="popup">
    <div id="popupbg"></div>
    <div id="popupbox">
        <div id="popupContent">
            <div id="plswait">
                <span>Warte auf Verbindung...</span>
                <div id="loadingBarContainer">
                    <div id="loadingBar"></div>
                </div>
            </div>
            <div id="startFromArduino" >
                Bitte starte nun den Belastungstest am Arduino
            </div>
            <div id="connectionerror">
                <span id="errordesc">Fehler: </span><br>
                <button onclick="retry();">Erneut veruschen</button>
            </div>
            <div id="testerror">
                <span>Der Test wurde aufgrund eines Problems vorzeitig beendet!</span><br>
                <span id="errordesc">Fehler: </span><br>
                <button onclick="changeLocation('menu');">Zurück ins Hauptmenü</button>
                <button onclick="reloadLocation();">Daten verwerfen und Test neustarten</button>
                <button onclick="hidePopup();">Daten behalten</button>
            </div>
            <div id="save_success">
                <span>Daten erfolgreich gespeichert</span><br>
                <button onclick="changeLocation('menu');">Zurück ins Hauptmenü</button>
                <button onclick="reloadLocation();">Weiteren Test durchführen</button>
            </div>
            <div id="save_fail">
                <span>Beim Speichern der Daten ist ein Fehler aufgetreten!</span><br>
                <span>Bitte überprüfen sie Ihre Eingaben und probieren sie es erneut</span><br>
                <button onclick="hidePopup();">Ok</button>
            </div>
            <div id="select_material">
                <div id="tablewrapper">
                    <table id="materialtable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Namen</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<?php
    session_write_close();
?>