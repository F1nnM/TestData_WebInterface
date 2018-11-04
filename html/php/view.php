<?php 
    //check if a user is logged in
    require("../php_helper/checkLogin.php");
?>
<div id="content">
    <div id="tablewrapper">
        <table id="datatable">
            <thead>
                <tr>
                    <th>ID<div class="sort"></div><div class="filter"></div></th>
                    <th>Type<div class="sort"></div><div class="filter"></div></th>
                    <th>Fügeteil<div class="sort"></div><div class="filter"></div></th>
                    <th>Klebstoff<div class="sort"></div><div class="filter"></div></th>
                    <th>Ersteller<div class="sort"></div><div class="filter"></div></th>
                    <th>Beschreibung<div class="sort"></div><div class="filter"></div></th>
                    <th>Zeit<div class="sort"></div><div class="filter"></div></th>
                    <th>Newton/cm²<div class="sort"></div><div class="filter"></div></th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
    </div>
    <div id="buttondiv">
        <button id="resetbtn" onclick="fillTable(experiments);">Filter zurücksetzen</button>
    </div>
</div>
<div id="overlay" style="display: none" ></div>
<div id="popup"  style="display: none">
        <div id="values">
            <div>ID:<input disabled>Typ<input disabled></div>
            <div>Fügeteil:<input disabled>Klebstoff<input disabled></div>
            <div>Ersteller<input disabled>Beschreibung<input disabled></div>
            <div>Zeit<input disabled>Newton<input disabled></div>
            
        </div>
        <div id="canvaswrapper">
            <canvas id="datacanvas"></canvas>
            <canvas id="scalecanvas"></canvas>
        </div>
    </div>
</div>
<div id="materialselection" style="display: none">
    <input id="materialsearch">
    <ul></ul>
</div>