$(document).ready(function() {

	const NB_LINES_INI = 100;
	const NB_COLUMNS_INI = 100;
	const NB_BEINGS_INI = 4000;
	const TIME_LAPSE = 100;

	var initPage = function(){
		$('#nbLines').val(NB_LINES_INI);
		$('#nbColumns').val(NB_COLUMNS_INI);
		$('#nbBeings').val(NB_BEINGS_INI);
		game.constructor($('#nbLines').val(), $('#nbColumns').val(), $('#nbBeings').val());
	};

	var game = {

		constructor(nbLines, nbColumns, nbBeings) {
 			this.nbColumns = nbColumns;
 			this.nbLines = nbLines;
 			this.canvas = document.getElementById('canvasid');
 			this.context = this.canvas.getContext('2d');
 			this.canvas.width = $('#divCanvas').width() * 0.9;
 			this.canvas.height = $('#divCanvas').width() * 0.9;
 			this.cellWidth = this.canvas.width / this.nbColumns;
 			this.cellHeight = this.canvas.height / this.nbLines;
 			this.intervalId = 0;
 			this.timerRunning = false;
 			this.generation = 0;
 			this.nbBeings = nbBeings;
 			this.matrix = getMatrixZeros(this.nbLines, this.nbColumns);
 			this.drawBordersAndGrid();
 			this.drawCanvasUpd();
 			this.updStats();
 			this.matrix = getMatrixRandom(this.matrix, nbLines, nbColumns, nbBeings);
		}, 

		playGame : function(){
			if (!game.timerRunning){
				game.intervalId = window.setInterval(function(){
					game.animate();
				}, TIME_LAPSE);	
				game.timerRunning = true;
			}
		},

		resetGame : function(){
			game.pauseGame();
			game.constructor($('#nbLines').val(), $('#nbColumns').val(), $('#nbBeings').val());	
			game.drawCanvasUpd();
		},

		pauseGame : function(){
			if (game.timerRunning){
				clearInterval(game.intervalId);
				game.timerRunning = false;	
			}
		},

		drawBordersAndGrid : function(){
			this.context.fillStyle = "white";
		    this.context.lineWidth = 4;
		    this.context.strokeStyle="gray";
			this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
 			for (var j = 0; j < this.nbColumns; j++){
 				this.context.lineWidth = 1;
 				this.context.strokeStyle="lightgray";
 				this.context.strokeRect(j * this.cellWidth, 0, j * this.cellWidth, this.canvas.height);
 			}
 			for (var i = 0; i < this.nbLines; i++){
 				this.context.lineWidth = 1;
 				this.context.strokeStyle="lightgray";
 				this.context.strokeRect(0, i * this.cellHeight, this.canvas.width, i * this.cellHeight);
 			} 			
 		},

		drawCell : function(i, j){
 			(this.matrix[i][j] === 1) ? this.context.fillStyle = "black" : this.context.fillStyle = "white";
 			this.context.fillRect(i * this.cellWidth, j * this.cellHeight, this.cellWidth, this.cellHeight);
 		},	

	 	drawCanvasUpd : function(){
	 		this.context.fillStyle = "white";
	 		for (var i = 0; i < this.nbColumns; i++){
 				for (var j = 0; j < this.nbLines; j++){
 					this.drawCell(i, j); 	
 				}
 			}
 			this.drawBordersAndGrid();
 		},

 		updStats : function(){
 			
 			$('#generationTxt').html("Generation : " + this.generation);
 			$('#nbBeingsTxt').html("Number of beings : " + this.getNumberOfBeings());
 		},

 		getNumberOfBeings : function(){
 			var nbBeings = 0;
 			for (var i = 0; i < this.nbLines-1; i++) {
 				for (var j = 0; j < this.nbColumns-1; j++) {
 					if (this.matrix[i][j] === 1) nbBeings += 1;
 				}
 			}
 			return nbBeings;
 		},

 		getMatrixNext : function(){
 			var newMat = getMatrixZeros(this.nbLines, this.nbColumns);
 			for (var i = 0; i < this.nbLines; i++){ 				
 				for (var j = 0; j < this.nbColumns; j++){
  					var neighboors = getNeighboorsNumber(this.matrix, i, j, this.nbLines, this.nbColumns);
 					if ((this.matrix[i][j] === 0) && (neighboors === 3)) newMat[i][j] = 1;
 					if ((this.matrix[i][j] === 1) && ((neighboors === 2) || (neighboors === 3))) newMat[i][j] = 1;
				}
 			}
 			this.matrix = newMat.slice();
 			this.generation++;
 		},

 		animate : function(){
 			this.getMatrixNext();
 			this.drawCanvasUpd();	
 			this.updStats();
 		}
	};

	$("#playGame").on('click', function(){
		game.playGame();
	})

	$("#pauseGame").on('click', function(){
		game.pauseGame();
	})

	$("#resetGame").on('click', function(){
		game.resetGame();
	})

	$(window).resize(function(){
		game.canvas.width = $('#divCanvas').width() * 0.9;
		game.canvas.height = game.canvas.width;
		this.cellWidth = this.canvas.width / this.nbColumns;
 		this.cellHeight = this.canvas.height / this.nbLines;
	})

	$('input').on('keypress', function(e){
		if ((e.which < 48) || (e.which > 57)) e.preventDefault();
	})

	$('#nbLines, #nbColumns').on('blur', function(e){
		if ($(e.target).val() >= 300) $(e.target).val(300);
	})

	$('#nbBeings').on('blur', function(e){
		$(e.target).val(Math.min($('#nbLines').val() * $('#nbColumns').val(), $(e.target).val() ) )  ;
		
	})
	
	initPage();

});