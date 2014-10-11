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

/*PHP FILE
 <?php
 $directory = 'images';

 if ( ! is_dir($directory)) {
 exit('Invalid directory path');
 }

 $files = array();

 foreach (scandir($directory) as $file) {
 if ('.' === $file) continue;
 if ('..' === $file) continue;

 $files[] = $file;
 }

 echo json_encode($files);
 ?>



 */

/*JS FILE

 load_init.prototype.startLoad = function (fileNames) {

 var objectsToLoad = [];
 for (var i = 0; i < fileNames.length; i++) {
 var s = fileNames[i];
 s = s.substring(0, s.indexOf('.'));

 //loadmanifest takes an array of objects like this
 var curObj = { id: s, src: 'images/' + fileNames[i] };

 //images[s] = queue.getResult(s);

 objectsToLoad.push(curObj);
 }

 //load all images and Sounds here
 queue.loadManifest(objectsToLoad);
 };

 load_init.prototype.loadAssets = function (callBack) {

 queue = new createjs.LoadQueue(false);

 queue.installPlugin(createjs.Sound);

 queue.addEventListener("complete", callBack);

 queue.addEventListener("progress", handleProgress);

 //you need to tell php
 $.ajax({
 type: 'POST',
 url: 'get_imgs.php',
 data: 'json',
 success: function(data) {

 game.loader.startLoad(JSON.parse(data));
 }
 });
 };

 function handleProgress(event) {

 elem('load_display').css({
 width: ((event.loaded / event.total) * 100).toString() + "%",
 maxWidth: elem('wrapper').width()
 });

 if (event.loaded / event.total == 1) {

 elem('load_display').css({

 visibility: "hidden"
 });
 }

 }
 */
