function Board(width, height, mines) {

	this.firstOpened	= false;
	this.timer 			= 0;

	this.width 			= width;
	this.height 		= height;
	this.mineAmt 		= mines;

	this.minePos 		= [];
	this.numberHints 	= [];
	this.markers		= [];

	this.init = function() {
		$('.minefield').css('width', width*20);
		$('.minefield').css('height', height*20);
		$('.wrapper').css('width', (width*20)+20);
		for(var i = 0; i < this.height; i++) {
			for(var j = 0; j < this.width; j++) {
				$('.minefield').append('<div class="brick brick-closed" data-brick="' + (j+(this.width*i)) + '"></div>');
				this.markers[(j+(this.width*i))] = 0;
			}
		}
		$('.btn-restart').html('<i class="fa fa-smile-o" aria-hidden="true"></i>');
	}

	this.shuffleMines = function(n) {
		var randomNumber;
		var n = parseInt(n);
		for(var i = 0; i < this.mineAmt; i++) {
			randomNumber = Math.floor(Math.random() * (this.width*this.height));
			/*
			No mines or numbers should be under the first opened brick. Therefore there
			can be no mines on any of the nearby 8 bricks.
			X X X
			X O X
			X X X
			*/
			if(jQuery.inArray(randomNumber, this.minePos) != -1 ||
				randomNumber == n || randomNumber == (n-1) || randomNumber == (n+1) ||
				randomNumber == (n - this.width) || randomNumber == (n + this.width) ||
				randomNumber == ((n - this.width) + 1) || randomNumber == ((n - this.width) - 1) ||
				randomNumber == ((n + this.width) + 1) || randomNumber == ((n + this.width) -1)) {
				i--;
			}
			else {
				this.minePos.push(randomNumber);
			}
		}
		this.minePos.sort(function(a, b) {return a-b});
		console.log(this.minePos);
	}

	this.showMines = function() {
		for(var i = 0; i < this.minePos.length; i++) {
			$('.brick[data-brick=' + this.minePos[i] + ']').css('background-color', '#fff');
		}
	}

	this.generateNumbers = function() {
		var color;
		for(var i = 0; i < (this.height*this.width); i++) {
			var mineCount 	= 0;
			if(jQuery.inArray(i, this.minePos) == -1) {

				var rightEdge	= (i%this.width == (this.width-1));
				var leftEdge	= (i%this.width == 0);
				var topEdge		= (i - this.width < 0);
				var bottomEdge	= (i + this.width > (this.width*this.height));

				// Right edge
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

				// Left edge
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

	this.setCounter = function() {
		var tmp = this.mineAmt;
		for(var i = 0; i < this.markers.length; i++) {
			if(this.markers[i] == 1)
				tmp--;
		}
		var output = (tmp < 10) ? '00' + tmp : (tmp < 100) ? '0' + tmp : tmp;
		console.log(output);
		$('#mines').html(output);
	}

	this.placeMarker = function(n) {
		this.markers[n] = (this.markers[n] < 2) ? (this.markers[n] + 1) : 0;
		switch(this.markers[n]) {
			case 0: $('.brick[data-brick=' + n + ']').html(''); break;
			case 1: $('.brick[data-brick=' + n + ']').html('<span class="flag"><i class="fa fa-flag" aria-hidden="true"></i></span>'); break;
			case 2: $('.brick[data-brick=' + n + ']').html('<span class="questionmark">?</span>');
		}
		this.setCounter();
	}

	this.firstOpening = function(n) {
		this.firstOpened = true;
		this.shuffleMines(n);
		//this.showMines();
		this.generateNumbers();
		this.timer = window.setInterval(timer, 1000);
	}

	this.killGame = function(n) {
		for(var i = 0; i < this.minePos.length; i++) {
			var mineNo = this.minePos[i];
			$('.brick[data-brick=' + mineNo + ']')
				.removeClass('brick-closed')
				.addClass('brick-open')
				.css('background-color', '')
				.html('<span class="mine"><i class="fa fa-bomb" aria-hidden="true"></i></span>');
			if(mineNo == n) {
				$('.brick[data-brick=' + mineNo + ']').addClass('brick-boom');
			}
		}
		window.clearInterval(this.timer);
		this.timer = 0;
		$('.btn-restart').html('<i class="fa fa-frown-o" aria-hidden="true"></i>');
		setTimeout(function(){ alert('Boom. You ded.')}, 100);
	}

	this.open = function(n, hincr, vincr, numberRet) {

		// Mines and numbers initialized on the first opened brick.
		if(!this.firstOpened) {
			this.firstOpening(n);
		}
		
		if((jQuery.inArray(parseInt(n), this.minePos) != -1) && hincr == 0 && vincr == 0) {
			this.killGame(n);
		}
		else {
			console.log('n: ' + n + ', hincr: ' + hincr + ', vincr: ' + vincr);
			if(numberRet || n < 0 || n > (this.width*this.height) || (((n%this.width) == 0) && hincr > 0) || (((n%this.width) == (this.width-1) && hincr < 0))) {
				if(numberRet)
					console.log("Number return");
				else
					console.log("Edge return");
				return;
			}

			$('.brick[data-brick=' + n + ']').removeClass('brick-closed').addClass('brick-open');
		
			var numberBrick = (this.numberHints[n] > 0);

			if(numberBrick)
			 	$('.brick[data-brick=' + n + ']').html('<span class="number" data-number="' + this.numberHints[n] + '">' + this.numberHints[n] + '</span>');

			if(hincr <= 0){
				console.log('Going left');
				this.open(n-1, hincr-1, vincr, numberBrick);
			}
			if(vincr >= 0){
				console.log('Going down');
				this.open(parseInt(n)+this.width, hincr, vincr+1, numberBrick);
			}
			if(vincr <= 0){
				console.log('Going up');
				this.open(n-this.width, hincr, vincr-1, numberBrick);
			}
			if(hincr >= 0) {
				console.log('Going right');
				this.open(parseInt(n)+1, hincr+1, vincr, numberBrick);
			}
		}

		
		
		

	}
}