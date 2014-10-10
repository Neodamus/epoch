function initEventListeners() {
	
}


var selectedGame = { };

function tableSelect(id, row) {

    if (selectedGame.row != undefined) {

        selectedGame.row.style.backgroundColor = "rgb(120,120,120";
    }



    selectedGame = {row: row, id: id};
    row.style.backgroundColor = "white";
    console.log('selected: ' + selectedGame.id);
}

function addTable(a, b){

    var row = $('#myTable')[0].insertRow(1);

    var createClickHandler =
        function(row)
        {
            return function() {
                var cell = row.getElementsByTagName("td")[0];
                console.log(cell);
                var id = cell.innerHTML;
                tableSelect(id, row);
            };
        };

    row.onclick = createClickHandler(row);

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);

    cell1.innerHTML = a;
    cell2.innerHTML = b;

}


//older + not using jquery below

/*function callForRefresh() { // ask server for game list********

    sendPacket({ id: "getGameList" });

    if ($('#lobby')[0].style.visibility == "visible") {

        setTimeout(callForRefresh, 1500);
    }
}*/



//rather that subtract and add games all the time
//I just delete the whole table and make a new one for each refresh

//but doing this removes your current selected table,
// so I find the same room and select it. if it exists.

/* //get game list from server*******
function refreshGameList(val) {

    //console.warn(val); //val is the new list of games
    var tableRows = table.getElementsByTagName('tr');

    var rowCount = tableRows.length;

    for (var x=rowCount - 1; x>0; x--) {

        table.deleteRow(x);
    }

    for (var i = 0; i < val.length; i++) {

        addTable(val[i].name, val[i].host);
        if (selectedGame != null && val[i].name == selectedGame.id) {

            var row = table.getElementsByTagName('tr');
            tableSelect(val[i].name, row[row.length - 1]);
        } else { selectedGame = null; }
    }

}*/
