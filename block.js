// block

function BLOCK(name, xOffset, yOffset, widthPercent, heightPercent) {
	
	this.name = name;
	this.element = null;			// element is the bounding box of a block, set in init
	this.xOffset = xOffset;
	this.yOffset = yOffset;
	this.widthPercent = widthPercent;
	this.heightPercent = heightPercent; 
	
	this.width;
	this.height;
	
	this.hidden = false;
	
	this.init();	
}


// initialize the block
BLOCK.prototype.init = function() {
	
	switch (this.name) {
		
		case 'login': 
		
			this.element = $('#login'); 
		
			$('#loginName').keypress( function (e) {
 				var key = e.which;
				if (key == 13)  { 	// enter
					var username = $('#loginName').val();
					localStorage.EOE_username = username;		// store username in local storage
					SEND('login', username);
				}	
			});
			
			// login button click
			$('#loginButton').on('click', function() { 
				var username = $('#loginName').val();
				localStorage.EOE_username = username;		// store username in local storage
				SEND('login', username);
			});
			
			// run when socket opens
			this.login = function() {
				EOE.username = localStorage.EOE_username;
				if (EOE.username) { $('#loginName').val(EOE.username); SEND('login', EOE.username);}
			}
			
			// run when login to server is successful 
			this.loginSuccess = function(data) {				
				var name = data.name;				
				EOE.display.changeLayout('lobby');
			}
			
		break;

        case 'lobby-games': 
		
			// jquery selections
			this.element = $('#lobby-games');
			this.gamesList = $('#lobby-games table tbody');
			this.quickButton = $('#lobby-games #quick');
			this.createButton = $('#lobby-games #create');
			this.joinButton = $('#lobby-games #join');
			this.observeButton = $('#lobby-games #observe');		
		
			// keeps track of the game that's currently being selected so that if game list refreshes, active game stays selected
			this.activeGame = '';
			
			// receive gamesList from socket
			// @param: gamesList = [ { name, host, users } ]    (Array of game objects)	
			this.receiveGamesList = function(gamesList) {
				
				// clear current games list
				this.gamesList.empty();				
				
				// add games list				
				for (var i = 0; i < gamesList.length; i++) {
					
					var game = gamesList[i];
					
					var name = game.name;
					var host = game.host;
					var users = game.users;
					
					// add game row element
					this.gamesList.append(
						$('<tr>').append(
							$('<td>').html(name),
							$('<td>').html(host),
							$('<td>').html(users)
						).click( function(event) {
							
							// remove any other active game
							$('#lobby-games table tbody').children().attr('class', '');
							
							// add active class to selected game
							var element = $(event.currentTarget);
							element.attr('class', 'active');
							
							// set active game name
							getBlock('lobby-games').activeGame = element.children()[0].innerText;
						})					
					);
					
					// set active game if there was already one	
					if (name == this.activeGame) {
						this.gamesList.children().eq(i).attr('class', 'active');
					}
				}
			}
			
			// click on quick button
			var clickQuick = function(event)	{				
										
			};
			this.quickButton.click(clickQuick);
			
			// click on create button
			var clickCreate = function(event)	{
				SEND('createRoom');									
			};
			this.createButton.click(clickCreate);
			
			// click on join button
			var clickJoin = function(event)	{			
				SEND('joinRoom', this.activeGame);					
			};
			this.joinButton.click(clickJoin.bind(this));
			
			// click on observe button
			var clickObserve = function(event)	{				
									
			};
			this.observeButton.click(clickObserve);
			
        break;

        case 'lobby-users': 
		
			this.element = $('#lobby-users');
			this.child = $('#lobby-users-child');		
		
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

        case 'lobby-chat': 
		
			this.element = $('#lobby-chat');
			this.box = $('#lobby-chat-box')
			
			this.receiveChat = function(data) {		
			
				console.log(data);		
			
				var name = data.name;	// name of person who sent chat
				var message = data.message;		// message sent
				
				// html for a chat message
				$('#lobby-chat-box').append( 
					$('<div/>')
					.attr('class', 'lobby-chat-box-row')
					.append( 
						$('<div/>')
						.attr('class', 'lobby-chat-box-row-name left')
						.append(
							$('<p/>').append(name)
						)
					)
					.append(
						$('<div/>')
						.attr('class', 'lobby-chat-box-row-message left')
						.append(
							$('<p/>').append(message)
						)
					)								
				);
				
			    if (this.element.length > 0){
					var height = this.box[0].scrollHeight;
        			this.box.scrollTop(height);
    			}
				
			}
			
        break;

        case 'lobby-chat-input': 
		
			this.element = $('#lobby-chat-input');
			this.text = $('#lobby-chat-input-text');
			this.button = $('#lobby-chat-input-button');
			
			var sendchat = function() {
				SEND('chat', $('#lobby-chat-input-text').val());
				$('#lobby-chat-input-text').val('')
			}
			
			this.button.on('click', function() {
				sendchat();
			});
			
			this.text.keypress( function (e) {
 				var key = e.which;
				if (key == 13)  { sendchat(); }	//enter
			});
			
        break;
		
		case 'epoch-game':
		
			this.element = $('#epoch-game');
			this.game; // equal to EOE.game but is undefined at initialization of block
			
			var resize = function() { 
				if (this.game) { 
					var width = this.element.width();
					var height = this.element.height();
					this.game.resize(width, height); 
				}
			}
			this.resizeFunction = resize.bind(this);
			
			var show = function() { 
				var width = this.element.width();
				var height = this.element.height();
				this.game.resize(width, height); 
			}
			this.showFunction = show.bind(this);
					
		break;
		
		case 'epoch-ui':
		
			this.element = $('#epoch-ui');
			this.ui; // equal to EOE.game.ui but is undefined at initialization of block
			
			var resize = function() {
				
			if (EOE.game) { this.ui = EOE.game.ui; }
				var width = this.element.width();
				var height = this.element.height();
				if (this.ui) { this.ui.resize(width, height); }
			}
			this.resizeFunction = resize.bind(this);
		
		break;
		
		case 'epoch-editor':
			
			this.element = $('#epoch-editor');	
			
			this.selectedUnit = '';		
			
			// minimizes editor window
			$( ".minbutton" ).on('click', function() {

				var b = $(this).html() == '+' ? '-' : '+';
				$(this).html(b);
                if (b == '-') {  $('#epoch-editor').css({width: '75%', height: '20%'}); } //get width&height%
				$('#epoch-editor-window').slideToggle('slow', function() {

                    var minbut = $('.minbutton');
                    if (minbut.html() == '+') {

                        $('#epoch-editor').css({width: minbut.width(), height: minbut.height()});
                    }

                });

			});
			
			// opens/closes unit editor
			var unit_editor = function() {
				var block = getBlock('epoch-unit-editor');
				block.hidden ? block.show() : block.hide();
			}
			$('#unit-editor-button').click( unit_editor );
			
			// menu buttons
			var editor_menu_button_click = function() {			
				$('.epoch-editor-content-toolbar-button').attr('class', 'epoch-editor-content-toolbar-button');
				$(this).attr( 'class', $(this).attr('class') + ' active' );
				if (EOE.game) { 
					var id = $(this).attr( 'id' );
					var mode = id.replace('epoch-editor-content-toolbar-button-', '');
					EOE.game.mousemode = mode;
				}
			}			
			$('.epoch-editor-content-toolbar-button').click( editor_menu_button_click );
			
			
			// team buttons
			var editor_menu_team_button_click = function() {			
				$('.epoch-editor-content-toolbar-team-button').attr('class', 'epoch-editor-content-toolbar-team-button');
				$(this).attr( 'class', $(this).attr('class') + ' active' );
				if (EOE.game) { 					
					var id = $(this).attr( 'id' );
					var team = id.replace('epoch-editor-content-toolbar-button-team', '');
					EOE.game.activeArmy = team;		// should be 1 or 2
				}
			}
			$('.epoch-editor-content-toolbar-team-button').click( editor_menu_team_button_click );
			
			
			// sets all images for units
			this.setUnitImages = function() {
				
				var height = this.element.height() * 0.2;
				
				$.each(EOE.game.unitdata, function(index, value) {
					
					if (index != 'set') { 
						$('#epoch-editor-unitlist').append(
							$( '<div/>' )
								.attr('class', 'epoch-editor-unitlist-image-wrapper')
								.prepend(
								$(EOE.images.getResult(value.type))
									.css( {
										"width": "100%",
										"height": "29%"					
									})
									.attr('class', 'epoch-editor-unitlist-image')
									.attr('id', 'epoch-editor-' + value.type)
									.click( function(event) {
										getBlock('epoch-editor').selectedUnit = value.type;	
										$('.epoch-editor-unitlist-image-wrapper').attr('class', 'epoch-editor-unitlist-image-wrapper');									
										$(this).parent().attr('class', $(this).parent().attr('class') + ' active-unit');
								})
							)
						);					
					}						
				});				
			}
			
			
			// end turn
			var editor_end_turn_click = function() {			
				EOE.game.endTurn();
			}
			$('#epoch-editor-content-toolbar-button-end').click( editor_end_turn_click );
			
			
			// save state
			var editor_save_state_click = function() {		
				EOE.game.saveGamestateRequest();
			}
			$('#epoch-editor-content-toolbar-button-save').click( editor_save_state_click );
			
			
			// load state
			var editor_load_state_click = function() {			
				EOE.game.loadGamestateRequest();
			}
			$('#epoch-editor-content-toolbar-button-load').click( editor_load_state_click );
						
			
			// resize
			var resize = function() {
					
			}
			this.resizeFunction = resize.bind(this);
		
		break;
		
		case 'epoch-unit-editor':
		
			this.element = $('#epoch-unit-editor');
			
			var addUnit = function() { 
				
				var data = { 
					type: $('#unit-editor-add-type').val(),
					name: $('#unit-editor-add-name').val(),
					attributes: $('#unit-editor-add-attributes').val(),
					abilities: $('#unit-editor-add-abilities').val()
				}
				
				SEND('addUNITDATA', data); 
			}
			$('#unit-editor-add-button').click( addUnit );
		
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
	
	if (this.resizeFunction) { this.resizeFunction(); }	// can give a resize function to any block
	
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
	this.hidden = true;
}


// show the block
BLOCK.prototype.show = function() {
	this.element.css('visibility', 'visible');	 
	this.element.width(this.width);
	this.element.height(this.height);	
	this.hidden = false;
	
	if (this.showFunction) { this.showFunction(); }	// can give a show function to any block	
}

// returns a BLOCK object given by blockName to allow for easy block manipulation anywhere in the code
function getBlock(blockName) {
	
	var targetBlock = null;
	
	EOE.display.layouts.forEach( function(layout) {
		layout.blocks.forEach( function(block) {
			if (blockName == block.name) { targetBlock = block; }
		});		
	});
	
	return targetBlock;	
}

