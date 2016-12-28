var board;
var time = 0;
var currentDifficulty;

function newGame(diff) {
	$('.minefield').html('');
	currentDifficulty = diff;
	switch(diff) {
		case 'easy': board = new Board(8, 8, 10); break;
		case 'medium': board = new Board(16, 16, 40); break;
		case 'hard': board = new Board(24, 24, 90); break;
	}
	board.init();
	board.shuffleMines();
	board.showMines();
	board.generateNumbers();
	time = 0;

}

function timer() {
	time += 1;
	if(time < 1000) {
		var str = (time < 10) ? '00' + time : (time < 100) ? '0' + time : time;
		$('#time').html(str); 
	}
}



$(function() {
	board = new Board(8, 8, 10);
	board.init();
	board.shuffleMines();
	board.showMines();
	board.generateNumbers();
	window.setInterval(timer, 1000);
	currentDifficulty = 'easy';
	
	$('.btn-diff').click(function() { newGame($(this).attr('data-difficulty')); });
	$('.btn-restart').click(function() { newGame(currentDifficulty); });
	$('body').on("click", '.brick-closed', function() { board.open($(this).attr('data-brick'), 0, 0); });

	
})