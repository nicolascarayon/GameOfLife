var getMatrixZeros = function(nbLin, nbCol){
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

var getMatrixRandom = function(matrix, nbLin, nbCol, nbOnes) {
	for (var k = 1; k <= nbOnes; k++){
			i = Math.floor(Math.random()*nbLin);
			j = Math.floor(Math.random()*nbCol);
			while (matrix[i][j]===1){
				i = Math.floor(Math.random()*nbLin);
				j = Math.floor(Math.random()*nbCol);
			}
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