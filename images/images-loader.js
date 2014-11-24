function IMAGES_LOADER() { }

// loads image file names into single array
IMAGES_LOADER.prototype.startLoad = function (fileNames) {

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
	this.queue.loadManifest(objectsToLoad);
	
}

// loads all images based on filenames
IMAGES_LOADER.prototype.loadAssets = function () {

	this.queue = new createjs.LoadQueue(false);
	var queue = this.queue;

	queue.installPlugin(createjs.Sound);
	
	var callBack = function() { EOE.images = this.queue; if (EOE.socket.readyState == 1) { EOE.game = new GAME(); } console.log('images loaded'); }
	queue.addEventListener("complete", callBack.bind(this));
	
	queue.addEventListener("progress", handleProgress);

	//you need to tell php
	$.ajax({
		type: 'POST',
		url: 'images/images-loader.php',
		data: 'json',
		success: function(data) {
			EOE.images_loader.startLoad(JSON.parse(data));
		}
	});
}


function handleProgress(event) {
	
	//console.log('handleProgress running');
	// not working
	/*
	elem('load_display').css({
		width: ((event.loaded / event.total) * 100).toString() + "%",
		maxWidth: elem('wrapper').width()
	});

	if (event.loaded / event.total == 1) {
		elem('load_display').css({
			visibility: "hidden"
		});
	}
	*/
}