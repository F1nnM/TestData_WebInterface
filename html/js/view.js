//save the initial state of the popup
initial = $("#popup")[0].innerHTML;

experiments = [];
materials = [];
currentData = [];
//fetch all experiments from the server
$.get("./php_helper/getExperiments.php", {}, function (data) {
    experiments = JSON.parse(data);
    fillTable(experiments);
});
$.get("./php_helper/getMaterials.php", {}, function (data) {
    materials = JSON.parse(data);
});

//click handler for the popup background. Hides all popups
$("#overlay").click(function () { detailView(); materialSelect(); });

//click handler for the sort and filter buttons
sortBtns = $("#datatable th .sort");
sortBtns[0].onclick = function () { sort("ID") };
sortBtns[1].onclick = function () { sort("Type") };
sortBtns[2].onclick = function () { sort("Material1") };
sortBtns[3].onclick = function () { sort("Material2") };
sortBtns[4].onclick = function () { sort("Creator") };
sortBtns[5].onclick = function () { sort("Description") };
sortBtns[6].onclick = function () { sort("Time") };
sortBtns[7].onclick = function () { sort("Newton") };

filterBtns = $("#datatable th .filter");
filterBtns[0].onclick = function () { filter("ID", null) };
filterBtns[1].onclick = function () { filter("Type", null) };
filterBtns[2].onclick = function () { materialSelect(1) };
filterBtns[3].onclick = function () { materialSelect(2) };
filterBtns[4].onclick = function () { filter("Creator", null) };
filterBtns[5].onclick = function () { filter("Description", null) };
filterBtns[6].onclick = function () { filter("Time", null) };
filterBtns[7].onclick = function () { filter("Newton", null) };

//handler for the search function in the popup for selecting a material
$("#materialselection input").on("input", function () {
    search = $("#materialselection input")[0].value;
    if(search==""){
        //show all materials
        $("#materialselection li").show();
        //hide the highlight
        $("#materialselection ul")[0].innerHTML = $("#materialselection ul")[0].innerHTML.replace(/<span class="highlight">(.*?)<\/span>/g, "$1");
        return;
    }
    //hide all materials
    $("#materialselection li").hide();
    $("#materialselection li").each(function(index, li){
        if (li.innerText.indexOf(search)>-1){
            //if one of the aliases of a material contains the searchstring, highlight the match and display the 
            $(li)[0].innerHTML = $(li)[0].innerHTML.replace(/<span class="highlight">(.*?)<\/span>/g,"$1").replace(new RegExp(search, "g"),"<span class='highlight'>$&</span>");
            $(li).show();
        }
    });
});

//variables to save the last filter, so it can be applied after sorting/deleting and hence prevents unexpected behaviour.
lastFilterField = "";
lastFilterNeedle = "";

//opens/closes the detailed view of a experiment.
//functions as handler for the table rows
//elem = the table row that was clicked.
function detailView(elem) {
    //if nothing is passed, close the view
    if (typeof elem == "undefined") {
        $("#overlay").hide();
        $("#popup").hide();
        return;
    }
    //reset the popup
    $("#popup")[0].innerHTML = initial;

    $("#overlay").show();
    $("#popup").show();
    id = +$(elem).find("td")[0].innerText;

    //prepare the canvases for drawing
    dataCanvas = $("#popup #datacanvas");
    dataCtx = dataCanvas[0].getContext("2d");
    dataCtx.canvas.width = dataCanvas.width();
    dataCtx.canvas.height = dataCanvas.height();
    axesCanvas = $("#popup #scalecanvas");
    axesCtx = axesCanvas[0].getContext("2d");

    //define drawing functions with origin in the bottom left corner and and using scaleTop to make the highest value on the y-axis a multiple of 10
    //here it's defined as 0, will be changed at a later part of execution
    scaleTop = 0;
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
    axesCtx.yScaleText = function (s, yPercent) {
        x = 60 - axesCtx.measureText(s).width - 10;
        y = 20 + (axesCtx.canvas.height - 80) / 100 * yPercent;
        axesCtx.beginPath();
        axesCtx.moveTo2(60, y);
        axesCtx.lineTo2(55, y);
        axesCtx.stroke();
        y -= 5;
        console.log(axesCtx.measureText(s).height);
        axesCtx.fillText2(s, x, y);
    }
    //fetch the data for the graph
    $.post("./php_helper/getCurve.php", { id: id }, function (data) {
        curve = JSON.parse(data);
        dataCtx.clearRect(0, 0, dataCanvas.width, dataCanvas.height);
        maxVal = 0;
        curve.forEach(val => {
            maxVal = Math.max(maxVal, val);
        });
        scaleTop = Math.ceil(maxVal / 10) * 10;

        //adjust the width of the canvases to fit all the data
        $(dataCanvas).width(Math.max(dataCtx.canvas.width, curve.length));
        dataCtx.canvas.width = Math.max(dataCtx.canvas.width, curve.length);
        dataCtx.canvas.height = Math.max(dataCtx.canvas.height, maxVal);

        $(axesCanvas).width(Math.max(dataCtx.canvas.width, curve.length));
        axesCtx.canvas.width = dataCanvas.outerWidth();
        axesCtx.canvas.height = dataCanvas.outerHeight();

        //draw curve
        dataCtx.beginPath();
        dataCtx.moveTo2(0, curve[0]);
        for (i = 1; i < curve.length; i++) {
            dataCtx.lineTo2(i, curve[i]);
        }
        dataCtx.strokeStyle = "#00ffff";
        dataCtx.stroke();

        //draw axes
        axesCtx.beginPath();
        axesCtx.moveTo2(60, 20);
        axesCtx.lineTo2(60, axesCtx.canvas.height - 30);
        axesCtx.lineTo2(50, axesCtx.canvas.height - 40);
        axesCtx.moveTo2(60, axesCtx.canvas.height - 30);
        axesCtx.lineTo2(70, axesCtx.canvas.height - 40);
        axesCtx.strokeStyle = "#DDDDDD";
        axesCtx.stroke();

        axesCtx.font = "16px Dosis";
        axesCtx.fillStyle = "#DDDDDD";
        axesCtx.yScaleText("0", 0);
        tickCount = 7;
        for (i = 1; i <= tickCount; i++) {
            val = Math.round(scaleTop / tickCount * i);
            axesCtx.yScaleText("" + val, 100 / tickCount * i);
        }

    });

    //display all vlaues for the selected test in the popup
    displays = $("#values input");
    experiment = null;
    experiments.some(exp => {
        if(exp["ID"]==id) {
            experiment = exp;
            return true;
        }
    });
    displays[0].value = id;
    displays[1].value = experiment["Type"];
    displays[2].value = experiment["Material1"];
    displays[3].value = experiment["Material2"];
    displays[4].value = experiment["Creator"];
    displays[5].value = experiment["Description"];
    displays[5].title = experiment["Description"];
    displays[6].value = experiment["Time"];
    displays[7].value = experiment["Newton"];
}

//open/close the popup to select a material for filtering
function materialSelect(type) {
    if (type == null) {
        $("#overlay").hide();
        $("#materialselection").hide();
        return;
    }
    $("#materialselection ul")[0].innerHTML = "";
    //for each element add a list node with an event handler to the list
    for (const id in materials[type]) {
        tmp = "<li onclick='materialSelect(); filter(\"Material"+type+"\", "+id+");'>" + id + ": ";
        materials[type][id].forEach(alias => {
            tmp += alias + " | ";
        });
        $("#materialselection ul")[0].innerHTML += tmp.substr(0, tmp.length - 3) + "</li>";
    }

    $("#overlay").show();
    $("#materialselection").show();
}

//function to sort the entire table using a simple bubblesort algorithm
function sort(field) {
    switched = true;
    ascending = true;
    first = true;
    //iterate until no changes have been made
    while (switched) {
        switched = false;
        for (i = 0; i < (currentData.length - 1); i++) {
            if (ascending) {
                if (isGreater(currentData[i][field], currentData[i + 1][field])) {
                    tmp = currentData[i];
                    currentData[i] = currentData[i + 1];
                    currentData[i + 1] = tmp;
                    switched = true;
                }
            } else {
                if (isLess(currentData[i][field], currentData[i + 1][field])) {
                    tmp = currentData[i];
                    currentData[i] = currentData[i + 1];
                    currentData[i + 1] = tmp;
                    switched = true;
                }
            }

        }
        //nothing changed in the first iteration
        //  => it's already sorted ascending
        //  => change to descending and try again
        if (first && !switched) {
            ascending = false;
            switched = true;
        }
        first = false;
    }
    //insert the sorted dataset into the table
    fillTable(currentData);
}
//used to compare either to strings alphabetically or two numbers based on their value.
function isGreater(a, b) {
    if (isNaN(a) || isNaN(b)) {  //is String
        a = a.toLowerCase();
        b = b.toLowerCase();
    } else { //is Numner
        a = +a;
        b = +b;
    }
    return a > b;
}
function isLess(a, b) {
    if (isNaN(a) || isNaN(b)) {  //is String
        a = a.toLowerCase();
        b = b.toLowerCase();
    } else { //is Numner
        a = +a;
        b = +b;
    }
    return a < b;
}
//function to filter the dispalyed tests
function filter(field = lastFilterField, needle = lastFilterNeedle) {
    data = [];
    //depending on the selected field ask for a differnet input and then iterate over all experiments and select the matching ones
    if (field == "ID" || field == "Newton") {
        needle = needle || prompt('Suchmaske:\n "Wert" oder "Wert-Wert"', "100-150");
        lastFilterField = field;
        lastFilterNeedle = needle;
        if (needle == null || needle == "") {
            fillTable(experiments);
            return;
        }
        if (!(/^\d+(-\d+)?/g).test(needle)) {
            alert("Eingabe keine gültige Maske");
            fillTable(experiments);
            return;
        }
        needle = needle.split('-');
        if (needle.length == 1) {
            needle = +needle[0];
            experiments.forEach(exp => {
                if (exp[field] == needle) data.push(exp);
            });
        } else {
            min = +needle[0];
            max = +needle[1];
            experiments.forEach(exp => {
                if (exp[field] >= min && exp[field] <= max) data.push(exp);
            });
        }
    }
    if (field == "Type") {
        needle = needle || prompt('Suchmaske:\n "Zug", "Scher", "Benutzerdefiniert" oder Zeichenfolge', "Benutzerd");
        lastFilterField = field;
        lastFilterNeedle = needle;
        if (needle == null || needle == "") {
            fillTable(experiments);
            return;
        }
        experiments.forEach(exp => {
            if (exp["Type"].indexOf(needle) > -1) data.push(exp);
        });
    }
    if (field == "Creator") {
        needle = needle || prompt('Suchmaske:\n "Name" oder Zeichenfolge');
        lastFilterField = field;
        lastFilterNeedle = needle;
        if (needle == null || needle == "") {
            fillTable(experiments);
            return;
        }
        experiments.forEach(exp => {
            if (exp["Creator"].indexOf(needle) > -1) data.push(exp);
        });
    }
    if (field == "Description") {
        needle = needle || prompt('Suchmaske:\n Zeichenfolge');
        lastFilterField = field;
        lastFilterNeedle = needle;
        if (needle == null || needle == "") {
            fillTable(experiments);
            return;
        }
        experiments.forEach(exp => {
            if (exp["Description"].indexOf(needle) > -1) data.push(exp);
        });
    }
    if (field == "Time") {
        needle = needle || prompt('Suchmaske:\n "yyyy-mm-dd" oder "yyyy-mm-dd - yyyy-mm-dd');
        lastFilterField = field;
        lastFilterNeedle = needle;
        if (!/^\d\d\d\d-\d\d-\d\d( - \d\d\d\d-\d\d-\d\d)?$/g.test(needle)) {
            alert("Eingabe keine gültige Maske");
            fillTable(experiments);
            return;
        }
        needle = needle.split(' - ');
        if (needle.length == 1) {
            needle = needle[0];
            experiments.forEach(exp => {
                if (exp["Time"].indexOf(needle) > -1) data.push(exp);
            });
        } else {
            min = needle[0];
            max = needle[1];
            experiments.forEach(exp => {
                if (exp["Time"] >= min && exp["Time"] <= max) data.push(exp);
            });
        }
    }
    if (field == "Material1"||field=="Material2") {
        if (needle == null || needle == "") {
            fillTable(experiments);
            return;
        }
        experiments.forEach(exp => {
            if (exp[field] == needle) data.push(exp);
        }); 
    }
    //insert the filtered dataset into the table
    fillTable(data);
}
//function to display experiments in the table
function fillTable(data) {
    currentData = data;
    tbody = $("#datatable tbody")[0];
    tbody.innerHTML = "";
    //iterate over all entries in the passed array and add them with handlers
    data.forEach(exp => {
        tbody.innerHTML += "<tr onclick='detailView(this);'><td>" + exp["ID"] + "<div id='delete' onclick='deleteHandler(event," + exp["ID"] + ");' ></div></td><td>" + exp["Type"] + "</td><td><div>" + exp["Material1"] + "</div></td><td><div>" + exp["Material2"] + "</div></td><td>" + exp["Creator"] + "</td><td><div>" + exp["Description"] + "</div></td><td>" + exp["Time"] + "</td><td>" + exp["Newton"] + "</td></tr>";
    });
    //add a last hidden row to make the description column take up as much space as possible. This can't be accomplished with css, so this workaround has to be used
    tbody.innerHTML += "<tr id='widthhack'><td></td><td></td><td></td><td></td><td></td><td><div>asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd</div></td><td></td><td></td></tr>";
    $("#widthhack div").outerWidth($("#datatable").innerWidth() - $("#widthhack td")[0].offsetWidth - $("#widthhack td")[1].offsetWidth - $("#widthhack td")[2].offsetWidth - $("#widthhack td")[3].offsetWidth - $("#widthhack td")[4].offsetWidth - $("#widthhack td")[6].offsetWidth - $("#widthhack td")[7].offsetWidth - ($("#datatable")[0].scrollHeight > $("#datatable")[0].clientHeight ? 17 : 2));
}
//handler for the delete buttons
function deleteHandler(e, id) {
    //stopPropagation prevents the handlers on the entire row from firing
    e.stopPropagation();

    if (!confirm("Wollen sie den Datensatz mit ID " + id + " wirklich löschen?")) return;

    $.post("./php_helper/deleteExperiment.php", { id: id }, function () {
        index = -1;
        //find the element with the matching id and delete it
        experiments.forEach(exp => {
            index++;
            if (exp["ID"] == id) {
                experiments.splice(index, 1);
            }
        });
        //apply filters if some existed
        if (lastFilterField=="")
            filter("ID", "0-99999999");
        else
            filter();
    });
}