showPopup("plswait");

fakeData();

//get canvases for drawing and resize them
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

//add handlers to elements that need immediate action as soon as their value is changed
$("#smoothrate").on("input", function(){
    $("#smoothlabel")[0].innerText = "Datenglättung: " + $("#smoothrate")[0].value;
    repaint(true);
});
$("#area").on("change", function(){
    //check for invalid values 
    if (+$("#area")[0].value <= 0 || !/^\d+.?\d*$/g.test($("#area")[0].value)) $("#area")[0].value = 1;
    area = +$("#area")[0].value;
    repaint();
});

//init variables to make sure they are global
rawData = [];
processedData = [];
maxVal = 0;
area = 1;

finished = false;

//display the id the test would get if saved
$.get("./php_helper/getMaxID.php", {}, function (data) { $("#id")[0].value = parseInt(data) + 1; });

function initArduino(){
    //add handlers for all EvetnSourve events
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
        val = +(e.data.split(";")[0]) / 1000;
        rawData.push(val);
        repaint(false);
    });
}
//initArduino();
var blockRepaint = false;
function repaint(force) {
    //prevent the method from being executed more than 10 a second, as that would cause unnecessary load on the client
    if (!force) {
        if (blockRepaint) return;
        setTimeout(() => {
            blockRepaint = false;
        }, 100);
        blockRepaint = true;
    }
    processData();
    $("#newton")[0].value = maxVal.toFixed(2);
    
    //prepare canvases for drawing and resize them to fit all data
    dataCtx.clearRect(0, 0, dataCanvas.width(), dataCanvas.height());
    $(dataCanvas).width(Math.max(dataCtx.canvas.width, processedData.length));
    dataCtx.canvas.width = Math.max(dataCtx.canvas.width, processedData.length);
    dataCtx.canvas.height = Math.max(dataCtx.canvas.height, maxVal);
    $(axesCanvas).width(dataCanvas.outerWidth());
    axesCtx.canvas.height = dataCanvas.outerHeight();
    axesCtx.canvas.width = dataCanvas.outerWidth();

    scaleTop = Math.ceil(maxVal / 10) * 10;

    //add some functions for easier drawing:
    //  coordinates are measured with origin in the bottom left corner
    //  using scaleTop to make the highest value on the scale a multiple of 10
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
    //function to draw text at a certain percentage of the y-axis
    axesCtx.yScaleText = function (s, yPercent){
        x = 60 - axesCtx.measureText(s).width - 10;
        y = 60 + (axesCtx.canvas.height-120)/100*yPercent;
        axesCtx.beginPath();
        axesCtx.moveTo2(60, y);
        axesCtx.lineTo2(55, y);
        axesCtx.stroke();
        y -= 10;
        axesCtx.fillText2(s,x,y);
    }

    //draw curve
    dataCtx.beginPath();
    dataCtx.moveTo2(0, processedData[0]);
    for (i = 0; i < processedData.length; i++) {
        dataCtx.lineTo2(i, processedData[i]);
    }
    dataCtx.strokeStyle = "#00ffff";
    dataCtx.stroke();

    //draw a horizontal line marking the highest measured value
    dataCtx.beginPath();
    dataCtx.moveTo2(0, maxVal);
    dataCtx.lineTo2(processedData.length, maxVal);
    dataCtx.strokeStyle = "#ff0000";
    dataCtx.stroke();

    //draw the axes
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
//function to process the raw recorded data in following ways:
//  calculate the newton/cm² from the entered area
//  extract the highest value
//  if smoothing is wanted smooth the data using a wandering average algorithm
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
    //tmpData will contain n elements to calculate the average from
    tmpData = [];
    //pad the data with 0s to also smooth the data at the beginning
    for (i = 0; i < rate; i++) {
        tmpData.push(0);
    }
    for (i = 0; i < rawData.length + rate; i++) {
        //add 0s in the end to also smooth the data at the end
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
//function to show an popup defined in the HTML code based on it's id
function showPopup(id) {
    hidePopup();
    $("#popup").show();
    $("#popup *").show();
    $("#popupContent *").hide();
    $("#" + id).show();
    $("#" + id + " *").show();
}
//function hide current/all popups
function hidePopup() {
    $("#popup").hide();
    $("#popup *").hide();
}
//function to save the recorded data with its attributes
function save() {
    //get all metadata entered by the user
    type = $("#type")[0].value;
    material1 = $("#mat1")[0].innerText;
    material2 = $("#mat2")[0].innerText;
    description = $("#desc")[0].value;
    newton = $("#newton")[0].value;
    curve = JSON.stringify(processedData);
    //use jQuerys ajax request to post all data to a php script
    $.post("./php_helper/savedata.php", {
        type: type,
        material1: material1,
        material2: material2,
        description: description,
        newton: newton,
        curve: curve
    }, function (data) {
        showPopup("save_success");
    }).fail(function () {
        showPopup("save_fail")
    });
}
//function to open a special popup for selecting a material
function selectMaterial(which) {
    materials = [];
    //fetch all materials from the database using a php script
    $.get("./php_helper/getMaterials.php", function (data) {
        materials = JSON.parse(data);
        //only select the ones of the correct type (1=adherend  2=adhesive)
        selectedMaterials = materials[which];
        //insert all materials in a table
        $("#materialtable tbody")[0].innerHTML = "";
        $("#materialtable tbody")[0].innerHTML += "<tr><td>" + (+materials["maxId"] + 1) + "</td><td>Neues Material</td></tr>";
        //join all aliases for a material to one string
        for (const ID in selectedMaterials) {
            material = selectedMaterials[ID];
            names = "";
            for (const alias of material) {
                names += alias + " | ";
            }
            names = names.substring(0, names.length - 3);
            $("#materialtable tbody")[0].innerHTML += "<tr><td>" + ID + "</td><td>" + names + "</td></tr>";
        }
        //add click handlers

        //if the table cell containing the ID is clicked, select that material
        $("#materialtable tbody tr:not(:first-child) td:first-child").click(function () {
            $("#mat" + which)[0].innerText = this.innerText;
            hidePopup();
            $("#popupbg").off("click");
        });
        //if the background is clicked, close the popup
        $("#popupbg").click(function () { hidePopup(); $("#popupbg").off("click");});

        //if the cell containing the aliases is clicked open show the form for adding a new alias
        $("#materialtable tbody td:last-child").click(editAliases);

        //handler wrapped in a funtion to be able to refer it from inside this handler
        function editAliases() {
            //add this handler to all other cells in case another cell was previuosly selected for editing and remove the edit form if it exists and
            //disable the click handler for this cell and add the edit form to it
            $("#materialtable tbody td:last-child").click(editAliases);
            $(this).off("click");
            $(".edit").remove();
            this.innerHTML += "<span class='edit'> | <input><button>Speichern</button></span>";
            $(".edit input")[0].focus();

            //handler for the save button
            $(".edit button").click(function (event) {
                alias = $(".edit input")[0].value;
                id = $($(".edit")[0].parentNode.parentNode).find("td:first-child")[0].innerText;
                //save the alias in the database
                $.post("./php_helper/addMaterial.php", { id: id, alias: alias, type: which });
                //in case the cell is in the first row (it is a new element then) add the handler for the cell containing the ID and put the alias "as-is" in the corresponding cell
                //else append the new alias to the already existing aliases
                if ($(this.parentNode.parentNode.parentNode).is($("#materialtable tbody tr:first-child"))) {
                    this.parentNode.parentNode.innerHTML = alias;
                    $("#materialtable tbody tr:first-child td:first-child").click(function () {
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

        $("#materialtable th:first-child").outerWidth($("#materialtable td:first-child").outerWidth());
        $("#materialtable th:last-child").outerWidth($("#materialtable thead").outerWidth() - $("#materialtable td:first-child").outerWidth() - 1);
    });
    showPopup("select_material");
}
//function to reset and initialise the current connection to the EventSource thus reseting the connection to the arduino
function retry(){
    //arduino = new EventSource('./php_helper/serialdata.php');
    //initArduino();
    fakeData();
    hidePopup();
}
tmp = 0;
function fakeData(){
    setTimeout(function(){
        showPopup("startFromArduino");
        setTimeout(function () {
            hidePopup();
            counterX = 0;
            y = 0;
            tmp = setInterval(function(){
                if (counterX>1131) {
                    clearInterval(tmp);
                    finished = true;
                    repaint(true);
                    $("#savebtn").removeAttr("disabled");
                    return;
                }

                y = (-Math.cos(counterX/30)*100 + 100)-(Math.random()*40-20);
                console.log(counterX+"  "+y);
                rawData.push(y);
                repaint(false);
                counterX++;
            },5);
            
        }, 1000);
    },1000);
}