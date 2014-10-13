function initEventListeners() {
	
}

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
