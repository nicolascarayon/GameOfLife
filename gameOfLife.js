$(document).ready(function() {
	
	var initPage = function(){
		$nbRows = 200;
		$nbColumns = 200;
		$nbBeings = 15000;
		$('#nbLines').val($nbRows);
		$('#nbColumns').val($nbColumns);
		$('#nbBeings').val($nbBeings);
		game.constructor($nbRows, $nbColumns, $nbBeings);	
	}

	var iniMatrixWithZeros = function(nbLin, nbCol){
		// init matrix with zeros
		var matrix = [];
		for(var i = 0; i < nbLin; i++) {
		    matrix[i] = [];
		    for(var j = 0; j < nbCol; j++) {
		        matrix[i][j] = 0;
		    }
		};
		return matrix;
	}

	var randomMatrix = function(matrix, nbLin, nbCol, nbOnes) {
		for (var k = 1; k <= nbOnes; k++){
 			i = Math.floor(Math.random()*nbLin);
 			j = Math.floor(Math.random()*nbCol);
 			matrix[i][j] = 1;
 		}
 		return matrix;
	}

	var getNeighboorsNumber = function(matrix, i, j, nbRows, nbCols){
		// number of neighboors
		nb = 0;
		(i === 0) ? i_before = nbRows-1 : i_before = i-1;
		(i === nbRows-1) ? i_after = 0 : i_after = i+1;
		(j === 0) ? j_before = nbCols-1 : j_before = j-1;
		(j === nbCols-1) ? j_after = 0 : j_after = j+1;
		
		if (matrix[i_before][j_before] === 1) nb++;
		if (matrix[i_before][j] === 1) nb++;
		if (matrix[i_before][j_after] === 1) nb++;

		if (matrix[i][j_before] === 1) nb++;
		if (matrix[i][j_after] === 1) nb++;

		if (matrix[i_after][j-1] === 1) nb++;
		if (matrix[i_after][j] === 1) nb++; 
		if (matrix[i_after][j_after] === 1) nb++;
		
		return nb;
	}

	var game = {

		constructor(nbLines, nbColumns, nbBeings) {
 			this.nbColumns = nbColumns;
 			this.nbLines = nbLines;
 			this.matrix = iniMatrixWithZeros(this.nbLines, this.nbColumns);
 			this.canvas = document.getElementById('canvasid');
 			this.context = this.canvas.getContext('2d');
 			this.canvas.width = $('#divCanvas').width() * 0.9;
 			this.canvas.height = $('#divCanvas').width() * 0.9;
 			this.cellWidth = this.canvas.width / this.nbColumns;
 			this.cellHeight = this.canvas.height / this.nbLines;
 			this.intervalId =0;
 			this.initMatrix();
 			this.intervalId = 0;
 			this.generation = 0;
 			this.nbBeings = nbBeings;
 			this.drawBordersAndGrid();
 			this.drawCanvasUpd();
 			this.updStats();
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

 		initMatrix : function(){
			this.matrix = iniMatrixWithZeros(this.nbLines, this.nbColumns);
			this.matrix = randomMatrix(this.matrix, this.nbLines, this.nbColumns, this.nbBeings);
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
 			var newMat = iniMatrixWithZeros(this.nbLines, this.nbColumns);
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


	var playGame = function(){
		game.animate();
	}

	$("#playGame").on('click', function(){
		$nbLines = $('#nbLines').val();
		$nbColumns = $('#nbColumns').val();
		$nbBeings = $('#nbBeings').val();
		game.constructor($nbLines, $nbColumns, $nbBeings);
		game.animate();
		game.intervalId = window.setInterval(playGame, 100);
	})

	$("#stopGame").on('click', function(){
		clearInterval(game.intervalId);
	})

	$("#resetGame").on('click', function(){
		clearInterval(game.intervalId);
		initPage();
	})

	$(window).resize(function(){
		game.canvas.width = $('#divCanvas').width() * 0.9;
		game.canvas.height = game.canvas.width;
		this.cellWidth = this.canvas.width / this.nbColumns;
 		this.cellHeight = this.canvas.height / this.nbLines;
	})
	
	initPage();
	
	
	

});