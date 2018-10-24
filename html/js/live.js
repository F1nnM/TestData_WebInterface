showPopup("plswait");

var arduino = new EventSource('./php_helper/serialdata.php');

dataCanvas = $("canvas#data");
dataCtx = dataCanvas[0].getContext("2d");
dataCtx.canvas.width = dataCanvas.width();
dataCtx.canvas.height = dataCanvas.height();

axesCanvas = $("canvas#axes");
axesCtx = axesCanvas[0].getContext("2d");
axesCtx.canvas.width = axesCanvas.width();
axesCtx.canvas.height = axesCanvas.height();

$(axesCanvas).width(dataCanvas.outerWidth());
$(axesCanvas).height(dataCanvas.outerHeight());

$("#smoothrate").on("input", function(){
    $("#smoothlabel")[0].innerText = "Datenglättung: " + $("#smoothrate")[0].value;
    repaint(true);
});
$("#area").on("change", function(){
    if (+$("#area")[0].value <= 0 || !/^\d+.?\d*$/g.test($("#area")[0].value)) $("#area")[0].value = 1;
    area = +$("#area")[0].value;
    repaint();
});

rawData = [];
processedData = [];
maxVal = 0;
area = 1;

finished = false;

$.get("./php_helper/getMaxID.php", {}, function (data) { $("#id")[0].value = data; });

function initArduino(){
    arduino.onerror = function () {
        arduino.close();
        $("#connectionerror")[0].innerText = "EventSource error";
        showPopup("connectionerror");
    };
    arduino.addEventListener("connected", function (e) {
        showPopup("startFromArduino");
    });
    arduino.addEventListener("connectionerror", function (e) {
        arduino.close();
        $("#connectionerror #errordesc")[0].innerText = "Fehler: " + e.data;
        showPopup("connectionerror");
        console.log(e);
    });
    arduino.addEventListener("testerror", function (e) {
        arduino.close();
        $("#testerror #errordesc")[0].innerText = "Fehler: " + e.data;
        showPopup("testerror");
        $("#savebtn").removeAttr("disabled");
    });
    arduino.addEventListener("started", function (e) {
        hidePopup();
    });
    arduino.addEventListener("stopped", function (e) {
        arduino.close();
        finished = true;
        repaint(true);
        $("#savebtn").removeAttr("disabled");
        console.log(e.data);
    });
    arduino.addEventListener("data", function (e) {
        val = +(e.data.split(";")[0]) / 1000 * 9.81;
        rawData.push(val);
        repaint(false);
    });
}
initArduino();
var blockRepaint = false;
function repaint(force) {
    if (!force) {
        if (blockRepaint) return;
        setTimeout(() => {
            blockRepaint = false;
        }, 100);
        blockRepaint = true;
    }
    processData();
    $("#newton")[0].value = maxVal;
    dataCtx.clearRect(0, 0, dataCanvas.width(), dataCanvas.height());
    $(dataCanvas).width(Math.max(dataCtx.canvas.width, processedData.length));
    dataCtx.canvas.width = Math.max(dataCtx.canvas.width, processedData.length);
    dataCtx.canvas.height = Math.max(dataCtx.canvas.height, maxVal);
    $(axesCanvas).width(dataCanvas.outerWidth());
    axesCtx.canvas.height = dataCanvas.outerHeight();
    axesCtx.canvas.width = dataCanvas.outerWidth();

    scaleTop = Math.ceil(maxVal / 10) * 10;
    dataCtx.lineTo2 = function (x, y) {
        dataCtx.lineTo(x, dataCtx.canvas.height - ((y / scaleTop) * dataCtx.canvas.height));
    }
    dataCtx.moveTo2 = function (x, y) {
        dataCtx.moveTo(x, dataCtx.canvas.height - ((y / scaleTop) * dataCtx.canvas.height));
    }
    axesCtx.lineTo2 = function (x, y) {
        axesCtx.lineTo(x, axesCtx.canvas.height - y);
    }
    axesCtx.moveTo2 = function (x, y) {
        axesCtx.moveTo(x, axesCtx.canvas.height - y);
    }
    axesCtx.fillText2 = function (s, x, y) {
        axesCtx.fillText(s, x, axesCtx.canvas.height - y);
    }
    axesCtx.yScaleText = function (s, yPercent){
        x = 60 - axesCtx.measureText(s).width - 10;
        y = 60 + (axesCtx.canvas.height-120)/100*yPercent;
        axesCtx.beginPath();
        axesCtx.moveTo2(60, y);
        axesCtx.lineTo2(55, y);
        axesCtx.stroke();
        y -= 10;
        console.log(axesCtx.measureText(s).height);
        axesCtx.fillText2(s,x,y);
    }

    //draw data
    dataCtx.beginPath();
    dataCtx.moveTo2(0, processedData[0]);
    for (i = 0; i < processedData.length; i++) {
        dataCtx.lineTo2(i, processedData[i]);
    }
    dataCtx.strokeStyle = "#00ffff";
    dataCtx.stroke();

    //draw max
    dataCtx.beginPath();
    dataCtx.moveTo2(0, maxVal);
    dataCtx.lineTo2(processedData.length, maxVal);
    dataCtx.strokeStyle = "#ff0000";
    dataCtx.stroke();

    axesCtx.beginPath();
    axesCtx.moveTo2(60,60);
    axesCtx.lineTo2(axesCtx.canvas.width - 30, 60);
    axesCtx.lineTo2(axesCtx.canvas.width - 40, 50);
    axesCtx.moveTo2(axesCtx.canvas.width - 30, 60);
    axesCtx.lineTo2(axesCtx.canvas.width - 40, 70);
    axesCtx.moveTo2(60, 60);
    axesCtx.lineTo2(60, axesCtx.canvas.height - 30);
    axesCtx.lineTo2(50, axesCtx.canvas.height - 40);
    axesCtx.moveTo2(60, axesCtx.canvas.height - 30);
    axesCtx.lineTo2(70, axesCtx.canvas.height - 40);
    axesCtx.strokeStyle = "#DDDDDD";
    axesCtx.stroke();

    axesCtx.font = "20px Dosis";
    axesCtx.fillStyle = "#DDDDDD";
    axesCtx.yScaleText("0", 0);
    tickCount = 10;
    for(i=1; i<=tickCount; i++){
        val = Math.round(scaleTop/tickCount*i);
        axesCtx.yScaleText("" + val, 100/tickCount*i);
    }
}
function processData() {
    processedData = [];
    max = 0;
    rate = +$("#smoothrate")[0].value;
    if (rate == 1) {
        rawData.forEach(data =>{
            processedData.push(data / area);
        });
        max = 0;
        processedData.forEach(data => {
            if (data > max) max = data;
        });
        maxVal = max;
        return;
    }
    tmpData = [];
    for (i = 0; i < rate; i++) {
        tmpData.push(rawData[i]);
    }
    for (i = 0; i < rawData.length + rate; i++) {
        tmpData.push((rawData[i] || 0));
        tmpData.shift();
        tmp = 0;
        tmpData.forEach(date => {
            tmp += +date;
        });
        tmp /= tmpData.length;
        tmp /= area;
        processedData[i] = tmp;
        if (tmp > max) max = tmp;
    }
    maxVal = max;
}
function showPopup(id) {
    hidePopup();
    $("#popup").show();
    $("#popup *").show();
    $("#popupContent *").hide();
    $("#" + id).show();
    $("#" + id + " *").show();
}
function hidePopup() {
    $("#popup").hide();
    $("#popup *").hide();
}
function save() {
    type = $("#type")[0].value;
    material1 = $("#mat1")[0].innerText;
    material2 = $("#mat2")[0].innerText;
    description = $("#desc")[0].value;
    newton = $("#newton")[0].value;
    curve = JSON.stringify(processedData);
    $.post("./php_helper/savedata.php", {
        type: type,
        material1: material1,
        material2: material2,
        description: description,
        newton: newton,
        curve: curve
    }, function (data) {
        showPopup("save_success");
        alert(data);
    }).fail(function () {
        showPopup("save_fail")
    });
}
function selectMaterial(which) {
    materials = [];
    $.get("./php_helper/getMaterials.php", function (data) {
        materials = JSON.parse(data);
        selectedMaterials = materials[which];
        $("#materialtable tbody")[0].innerHTML = "";
        $("#materialtable tbody")[0].innerHTML += "<tr><td>" + (+materials["maxId"] + 1) + "</td><td>Neues Material</td></tr>";
        for (const ID in selectedMaterials) {
            material = selectedMaterials[ID];
            names = "";
            for (const alias of material) {
                names += alias + " | ";
            }
            names = names.substring(0, names.length - 3);
            $("#materialtable tbody")[0].innerHTML += "<tr><td>" + ID + "</td><td>" + names + "</td></tr>";
        }

        $("#materialtable tbody tr:not(:first-child) td:first-child").click(function () {
            $("#mat" + which)[0].innerText = this.innerText;
            hidePopup();
            $("#popupbg").off("click");
        });
        $("#popupbg").click(function () { hidePopup(); $("#popupbg").off("click");});
        function editAliases() {
            $("#materialtable tbody td:last-child").click(editAliases);
            $(this).off("click");
            $(".edit").remove();
            this.innerHTML += "<span class='edit'> | <input><button>Speichern</button></span>";
            console.log($(".edit")[0]);
            $(".edit input")[0].focus();
            $(".edit button").click(function (event) {
                alias = $(".edit input")[0].value;
                id = $($(".edit")[0].parentNode.parentNode).find("td:first-child")[0].innerText;
                $.post("./php_helper/addMaterial.php", { id: id, alias: alias, type: which });
                if ($(this.parentNode.parentNode.parentNode).is($("#materialtable tbody tr:first-child"))) {
                    this.parentNode.parentNode.innerHTML = alias;
                    $("#materialtable tbody tr:first-child").click(function () {
                        $("#mat" + which)[0].innerText = this.innerText;
                        hidePopup();
                    });
                }else this.parentNode.parentNode.innerHTML += " | " + alias;
                $(".edit").remove();
                $("#materialtable tbody td:last-child").click(editAliases);
                event.stopPropagation();
                return false;
            });
        }
        $("#materialtable tbody td:last-child").click(editAliases);

        $("#materialtable th:first-child").outerWidth($("#materialtable td:first-child").outerWidth());
        $("#materialtable th:last-child").outerWidth($("#materialtable thead").outerWidth() - $("#materialtable td:first-child").outerWidth() - 1);
    });
    showPopup("select_material");
}
function retry(){
    arduino = new EventSource('./php_helper/serialdata.php');
    initArduino();
    hidePopup();
}