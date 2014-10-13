// block

function BLOCK(name, xOffset, yOffset, widthPercent, heightPercent) {
	this.name = name;
	this.element = null;			// element is the bounding box of a block, set in init
	this.child = null;				// first child within an element
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.widthPercent = widthPercent;
	this.heightPercent = heightPercent; 
	
	this.width;
	this.height;
	
	this.init();	
}


// initialize the block
BLOCK.prototype.init = function() {
	
	switch (this.name) {
		case 'login': 
			this.element = $('#login'); 
			this.set('login');
		break;

        case 'lobby-games': 
			this.element = $('#lobby-games');
			this.set('gamesList');
        break;

        case 'lobby-users': 
			this.element = $('#lobby-users');
			this.child = $('#lobby-users-child');
			this.set('lobby-users');
        break;

        case 'lobby-chat': 
			this.element = $('#lobby-chat');
        break;

        case 'lobby-chat-input': 
			this.element = $('#lobby-chat-input');
        break;
	}
	
}


// resize the layout
BLOCK.prototype.resize = function(width, height) {
		
	this.width = width * this.widthPercent;
	this.height = height * this.heightPercent;
	
	if (this.element.css('visibility') == 'visible') {
		this.element.width(this.width);
		this.element.height(this.height);
	}
	
	if (this.resizeFunction) { this.resizeFunction(); }
	
	this.move(width, height);		
}


BLOCK.prototype.move = function(width, height) {	
	var left = this.xOffset * width;
	var top = this.yOffset * height;
	
	this.element.css('top', top);
	this.element.css('left', left);	
}


// hide the block
BLOCK.prototype.hide = function() {	
	this.element.css('visibility', 'hidden');
	this.element.width(0);
	this.element.height(0);
}


// show the block
BLOCK.prototype.show = function() {
	this.element.css('visibility', 'visible');	 
	this.element.width(this.width);
	this.element.height(this.height);		
}


// BLOCK FUNCTIONS //
BLOCK.prototype.set = function(blockType) {
	
	switch (blockType) {
			
		case 'login':
		
			// login button click
			$('#loginButton').on('click', function() { 
				var username = $('#loginName').val();
				localStorage.EOE_username = username;		// store username in local storage
				SEND('login', username) 
			});
			
			// run by socket if username is already stored in localstorage
			this.login = function() {
				EOE.username = localStorage.EOE_username;
				SEND('login', EOE.username);
			}
			
			// run when login to server is successful 
			this.loginSuccess = function(data) {				
				var name = data.name;				
				EOE.display.changeLayout('lobby');
			}
			
		break;	
			
		case 'gamesList':
		
			this.selectedGame = { };			
			var selectedGame = this.selectedGame;
			
			// add game
			this.addGame = function(name, players) {

				var row = $('#myTable')[0].insertRow(1);
			  
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
			  
				cell1.innerHTML = name;
				cell2.innerHTML = players;
				
				row.onclick = clickGame.bind(this, row);							
			}
			
			// click on game, used in addgame
			var clickGame = function(row)	{				
								
				var cell = row.getElementsByTagName("td")[0];
				var id = cell.innerHTML;
				this.selectedGame = {row: row, id: id};
				
				//if (this.selectedGame.row != undefined) { selectedGame.row.style.backgroundColor = "rgb(120,120,120"; }				
			};
			
			// select game
			this.selectGame = function(row) {				
				row.style.backgroundColor = "white";
			}
			
			// receive gamesList from socket
			// @param: gamesList = [ { (string) name, (int) players } ]    (Array of game objects)	
			this.receiveGamesList = function(gamesList) {
				
				var table = $('#myTable')[0];
				
				// delete all current games
				var tableRows = table.getElementsByTagName('tr');
			
				var rowCount = tableRows.length;
			
				for (var x=rowCount - 1; x>0; x--) {			
					table.deleteRow(x);
				}
				
				// add games from gamesList
				for (var i = 0; i < gamesList.length; i++) {	
								
					var game = gamesList[i];
					var name = game.name;
					var players = game.players;
        
					this.addGame(name, players);

        			if (name == this.selectedGame.id) {
						var row = table.getElementsByTagName('tr');
						this.selectGame(row);
					}
				}	
			}
		
		break;
		
		case 'lobby-users':
		
			this.resizeFunction = function() {
				var fontSize = this.height / 30;
				this.child.css('font-size', fontSize + 'px');	
			}
			
			this.addUser = function(username) {
				this.child
					.append($("<option></option>")
					.attr("value", username)
					.text(username));	
			}
			
			this.child.change( function() {
				//console.log(this.selectedOptions[0].text);
			});
			
			// receive usersList from socket
			// @param usersList = [ (string) name ]
			this.receiveUsersList = function(usersList) {
				
				var selectedUser = $('#lobby-users-child option:selected').text();
				
				// delete all users
				this.child.empty();			
				
				// add all users from usersList
				for (var i = 0; i < usersList.length; i++) {	
				
					var name = usersList[i];        
					
					this.addUser(name);
					
        			if (selectedUser) {
						$('#lobby-users-child option[value="' + selectedUser + '"]').prop('selected', true);
					}
				}				
			}
			
		break;
	}	
}


function getBlock(blockName) {
	
	var targetBlock = null;
	
	EOE.display.layouts.forEach( function(layout) {
		layout.blocks.forEach( function(block) {
			if (blockName == block.name) { targetBlock = block; }
		});		
	});
	
	return targetBlock;	
}

