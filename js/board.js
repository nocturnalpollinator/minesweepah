function Board(width, height, mines) {

	this.firstOpened	= false;
	this.boardActive	= true;
	this.timer 			= 0;
	this.openBricks		= 0;

	this.width 			= width;
	this.height 		= height;
	this.mineAmt 		= mines;

	// - minePos[] has the size of the amount of mines and contains
	// every position where there's a mine
	// - numberHints[] has the size of the amount of bricks and contains
	// values from 0 to 8 depending on the amount of nearby mines
	// - markers[] has the size of the amount of bricks and contains
	// values from 0 to 2 depending on marker state 
	// (0 = no marker, 1 = flag marker, 2 = question mark marker)
	// - boardState[] has the size of the amount of bricks and contains
	// values 0 for closed brick and 1 for opened brick
	this.minePos 		= [];
	this.numberHints 	= [];
	this.markers		= [];
	this.boardState		= []

	this.init = function() {

		// Set widths and heights of board 
		// (20 = width and height of bricks)
		$('.minefield').css('width', width*20);
		$('.minefield').css('height', height*20);
		$('.wrapper').css('width', (width*20)+20);


		for(var i = 0; i < this.height; i++) {
			for(var j = 0; j < this.width; j++) {
				// Populate grid with closed bricks
				$('.minefield').append('<div class="brick brick-closed" data-brick="' + (j+(this.width*i)) + '"></div>');

				// Populate markers[] and boardState[] with inital values (0)
				this.markers[(j+(this.width*i))] = 0;
				this.boardState[(j+(this.width*i))] = 0;
			}
		}

		// Set restart button to smiley face
		$('.btn-restart').html('<i class="fa fa-smile-o" aria-hidden="true"></i>');

		// Activate board
		this.boardActive = true;
	}

	this.shuffleMines = function(n) {
		var randomNumber;
		// Need parseInt to prevent string concat when using +
		var n = parseInt(n);
		for(var i = 0; i < this.mineAmt; i++) {
			randomNumber = Math.floor(Math.random() * (this.width*this.height));

			// 1. A grid can only hold one mine
			// 2. No mines or numbers should be under the first opened brick. Therefore there
			// can be no mines on any of the nearby 8 bricks:
			// X X X
			// X O X
			// X X X
			if(jQuery.inArray(randomNumber, this.minePos) != -1 ||
				randomNumber == n || randomNumber == (n-1) || randomNumber == (n+1) ||
				randomNumber == (n - this.width) || randomNumber == (n + this.width) ||
				randomNumber == ((n - this.width) + 1) || randomNumber == ((n - this.width) - 1) ||
				randomNumber == ((n + this.width) + 1) || randomNumber == ((n + this.width) -1)) {
				// Redo this iteration
				i--;
			}
			else {
				this.minePos.push(randomNumber);
			}
		}

		// Sort mine position array by integer value 
		this.minePos.sort(function(a, b) {return a-b});
	}

	// Debug helper function
	this.showMines = function() {
		for(var i = 0; i < this.minePos.length; i++) {
			$('.brick[data-brick=' + this.minePos[i] + ']').css('background-color', '#fff');
		}
	}

	// Generate the helper numbers indicating how many mines are nearby
	this.generateNumbers = function() {
		for(var i = 0; i < (this.height*this.width); i++) {
			var mineCount = 0;

			if(jQuery.inArray(i, this.minePos) == -1) {

				var rightEdge	= (i%this.width == (this.width-1));
				var leftEdge	= (i%this.width == 0);
				var topEdge		= (i - this.width < 0);
				var bottomEdge	= (i + this.width > (this.width*this.height));

				if(rightEdge || (!rightEdge && !leftEdge)) {

					// Left of
					if(jQuery.inArray(i-1, this.minePos) != -1) mineCount++;

					if(topEdge || (!topEdge && !bottomEdge)) {
						// Beneath 
						if(jQuery.inArray(i+this.width, this.minePos) != -1) mineCount++;
						// Beneath left
						if(jQuery.inArray(i+this.width-1, this.minePos) != -1) mineCount++;
					}

					if(bottomEdge || (!topEdge && !bottomEdge)) {
						// Over
						if(jQuery.inArray(i-this.width, this.minePos) != -1) mineCount++;
						// Over left
						if(jQuery.inArray(i-this.width-1, this.minePos) != -1) mineCount++;
					}
				}

				if(leftEdge || (!rightEdge && !leftEdge)) {
					
					// Right of
					if(jQuery.inArray(i+1, this.minePos) != -1) mineCount++;

					if(topEdge || (!topEdge && !bottomEdge)) {
						// Beneath (leftEdge to prevent duplicate for non-edge bricks)
						if((jQuery.inArray(i+this.width, this.minePos) != -1) && leftEdge) mineCount++;
						// Beneath right
						if(jQuery.inArray(i+this.width+1, this.minePos) != -1) mineCount++;
					}

					if(bottomEdge || (!topEdge && !bottomEdge)) {
						// Over (leftEdge to prevent duplicate for non-edge bricks)
						if((jQuery.inArray(i-this.width, this.minePos) != -1) && leftEdge) mineCount++;
						// Over right
						if(jQuery.inArray(i-this.width+1, this.minePos) != -1) mineCount++;
					}
				}
			}
			this.numberHints.push(mineCount);
		}
	}

	this.setTimer = function() {
		time += 1;
		if(time < 1000) {
			// Format string to display the right amount of 0's before time:
			// 003, 034, 200 etc.
			var str = (time < 10) ? '00' + time : (time < 100) ? '0' + time : time;
			$('#time').html(str); 
		}
	}

	this.resetTimer = function() {
		window.clearInterval(this.timer);
		this.timer = 0;
		$('#time').html('000');
		time = 0;
	}

	this.setMineCounter = function() {
		var tmp = this.mineAmt;
		for(var i = 0; i < this.markers.length; i++) {
			if(this.markers[i] == 1 && tmp > 0) {
				// Decrease amount for every flag marker (1) in 
				// markers array if counter is not set to 0
				tmp--;
			}
		}
		// Format string to display the right amount of 0's before mine count:
		// 003, 034, 200 etc.
		var output = (tmp < 10) ? '00' + tmp : (tmp < 100) ? '0' + tmp : tmp;
		$('#mines').html(output);
	}

	this.placeMarker = function(n) {
		// Increase marker to maximum 2 then back to 0
		this.markers[n] = (this.markers[n] + 1) % 3;
		switch(this.markers[n]) {
			case 0: $('.brick[data-brick=' + n + ']').html(''); break;
			case 1: $('.brick[data-brick=' + n + ']').html('<span class="flag"><i class="fa fa-flag" aria-hidden="true"></i></span>'); break;
			case 2: $('.brick[data-brick=' + n + ']').html('<span class="questionmark">?</span>');
		}
		this.setMineCounter();
	}

	this.firstOpening = function(n) {
		this.firstOpened = true;
		this.shuffleMines(n);
		this.generateNumbers();
		// Start timer
		this.timer = window.setInterval(timer, 1000);
	}

	this.killGame = function(n) {

		// Show all mines
		for(var i = 0; i < this.minePos.length; i++) {
			var mineNo = this.minePos[i];
			$('.brick[data-brick=' + mineNo + ']')
				.removeClass('brick-closed')
				.addClass('brick-open')
				.css('background-color', '')
				.html('<span class="mine"><i class="fa fa-bomb" aria-hidden="true"></i></span>');
			
			// Display triggered mine in red
			if(mineNo == n) {
				$('.brick[data-brick=' + mineNo + ']').addClass('brick-boom');
			}
		}

		// Stop timer
		window.clearInterval(this.timer);
		this.timer = 0;

		// Set restart button to frowning smiley
		$('.btn-restart').html('<i class="fa fa-frown-o" aria-hidden="true"></i>');

		// Disable board
		this.boardActive = false;

		// Send alert with 0.1s delay to make sure everything has been drawn
		setTimeout(function() { alert('Boom. You ded.')}, 100);
	}

	this.didIWin = function() {
		if(this.openBricks == ((this.width * this.height) - this.mineAmt)) {
			setTimeout(function() { alert('You are win')}, 100);
			// Freeze game
			window.clearInterval(this.timer);
			this.timer = 0;
			this.boardActive = false;
		}
	}

	this.checkBrick = function(n) {
		n = parseInt(n);
		console.log(n);
		if(this.boardState[n] == 1) {
			console.log('Board state');
			return;
		}

		if(n < 0 || n > (this.width * this.height)) {
			console.log('Out of bounds');
			return;
		}

		console.log('Hello');
		$('.brick[data-brick=' + n + ']').removeClass('brick-closed').addClass('brick-open');
		this.openBricks++;
		this.boardState[n] = 1;

		if(this.numberHints[n] > 0) {
		 	$('.brick[data-brick=' + n + ']').html('<span class="number" data-number="' + this.numberHints[n] + '">' + this.numberHints[n] + '</span>');
		 	return;
		}
		if(n%this.width == 0 || n%this.width == (this.width-1)) {
			console.log('Out of bounds 2');
			return;
		}

		this.checkBrick(n+1);
		this.checkBrick(n-1);
		this.checkBrick(n+this.width);
		this.checkBrick(n+this.width+1);
		this.checkBrick(n+this.width-1);
		this.checkBrick(n-this.width);
		this.checkBrick(n-this.width+1);
		this.checkBrick(n-this.width-1);
		
	}

	this.open = function(n, hincr, vincr, numberRet) {
		// No brick openings after board is killed
		if(this.boardActive) {
			// Mines and numbers initialized on the first opened brick.
			if(!this.firstOpened) {
				this.firstOpening(n);
			}
			// If mine is behind brick - kill game
			if((jQuery.inArray(parseInt(n), this.minePos) != -1) && hincr == 0 && vincr == 0) {
				this.killGame(n);
			}
			else {
				this.checkBrick(n);
			}
			this.didIWin();
		}
	}
}