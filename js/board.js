function Board(width, height, mines) {

	this.width 			= width;
	this.height 		= height;
	this.mineAmt 		= mines;

	this.minePos 		= [];
	this.numberHints 	= [];

	this.init = function() {
		$('.minefield').css('width', width*20);
		$('.minefield').css('height', height*20);
		$('.wrapper').css('max-width', (width*20)+20);
		for(var i = 0; i < this.height; i++) {
			for(var j = 0; j < this.width; j++) {
				$('.minefield').append('<div class="brick brick-closed" data-brick="' + (j+(this.width*i)) + '"></div>');
			}
		}
	}


	this.shuffleMines = function() {
		var randomNumber;
		for(var i = 0; i < this.mineAmt; i++) {
			randomNumber = Math.floor(Math.random() * (this.width*this.height));
			if(jQuery.inArray(randomNumber, this.minePos) != -1) {
				i--;
			}
			else {
				this.minePos.push(randomNumber);
			}
		}
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

	this.open = function(n, hincr, vincr) {
		console.log('n: ' + n + ', hincr: ' + hincr + ', vincr: ' + vincr);

		if(n < 0 || n > (this.width*this.height) || (((n%this.width) == 0) && hincr > 0) || (((n%this.width) == (this.width-1) && hincr < 0))) {
			console.log("Edge return");
			return;
		}
		$('.brick[data-brick=' + n + ']').removeClass('brick-closed').addClass('brick-open');
		if(this.numberHints[n] > 0) {
			console.log("Number return");
		 	$('.brick[data-brick=' + n + ']').html('<span class="number" data-number="' + this.numberHints[n] + '">' + this.numberHints[n] + '</span>');
		 	return;
		}
		else if(this.numberHints[n] == 0) {	
			if(hincr <= 0){
				console.log('Going left');
				this.open(n-1, hincr-1, vincr);
			}
			if(hincr >= 0) {
				console.log('Going right');
				this.open(parseInt(n)+1, hincr+1, vincr);
			}
			if(vincr <= 0){
				console.log('Going up');
				this.open(n-this.width, hincr, vincr-1);
			}
			
			if(vincr >= 0){
				console.log('Going down');
				this.open(parseInt(n)+this.width, hincr, vincr+1);
			}
		}
	}
}