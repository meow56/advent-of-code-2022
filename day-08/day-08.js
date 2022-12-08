"use strict";

function day8(input) {
	let trees = [];
	let splitInput = input.split("\n");
	let visibility = [];
	for(let i = 0; i < splitInput.length; i++) {
		trees.push(splitInput[i].split(""));
		visibility.push(new Array(splitInput[i].length).fill(false));
	}

	function detVisibilityRow(row) {
		let currHighest = -1;
		for(let i = 0; i < trees[row].length; i++) {
			if(+trees[row][i] > currHighest) {
				visibility[row][i] = true;
				currHighest = +trees[row][i];
				if(currHighest === 9) break;
			}
		}
		currHighest = -1;
		for(let i = trees[row].length - 1; i >= 0; i--) {
			if(+trees[row][i] > currHighest) {
				visibility[row][i] = true;
				currHighest = +trees[row][i];
				if(currHighest === 9) break;
			}
		}
	}

	function detVisibilityColumn(column) {
		let currHighest = -1;
		for(let i = 0; i < trees.length; i++) {
			if(+trees[i][column] > currHighest) {
				visibility[i][column] = true;
				currHighest = +trees[i][column];
				if(currHighest === 9) break;
			}
		}
		currHighest = -1;
		for(let i = trees.length - 1; i >= 0; i--) {
			if(+trees[i][column] > currHighest) {
				visibility[i][column] = true;
				currHighest = +trees[i][column];
				if(currHighest === 9) break;
			}
		}
	}

	for(let i = 0; i < trees.length; i++) {
		detVisibilityRow(i);
	}
	for(let i = 0; i < trees[0].length; i++) {
		detVisibilityColumn(i);
	}
	let visibleCount = visibility.reduce(function(acc, row) {
		let rowVisible = row.reduce(function(accu, tree) {
			return accu + tree;
		}, 0);
		return acc + rowVisible;
	}, 0);

	const MAX_ROW = trees.length;
	const MAX_COLUMN = trees[0].length;

	function moveRight(row, column, threshold) {
		if(+trees[row][column] >= threshold) return 1;
		if(column === MAX_COLUMN - 1) return 1;
		return moveRight(row, column + 1, threshold) + 1;
	}

	function moveLeft(row, column, threshold) {
		if(+trees[row][column] >= threshold) return 1;
		if(column === 0) return 1;
		return moveLeft(row, column - 1, threshold) + 1;
	}

	function moveUp(row, column, threshold) {
		if(+trees[row][column] >= threshold) return 1;
		if(row === 0) return 1;
		return moveUp(row - 1, column, threshold) + 1;
	}

	function moveDown(row, column, threshold) {
		if(+trees[row][column] >= threshold) return 1;
		if(row === MAX_ROW - 1) return 1;
		return moveDown(row + 1, column, threshold) + 1;
	}

	function calcScenicScore(row, column) {
		if(row === 0 || column === 0 || row === MAX_ROW - 1 || column === MAX_COLUMN - 1) return 0;
		const heightThreshold = +trees[row][column];
		let leftValue = moveLeft(row, column - 1, heightThreshold);
		let rightValue = moveRight(row, column + 1, heightThreshold);
		let upValue = moveUp(row - 1, column, heightThreshold);
		let downValue = moveDown(row + 1, column, heightThreshold);
		return upValue * downValue * leftValue * rightValue;
	}
	let currMaxScore = 0;
	for(let i = 0; i < MAX_ROW; i++) {
		for(let j = 0; j < MAX_COLUMN; j++) {
			currMaxScore = Math.max(currMaxScore, calcScenicScore(i, j));
		}
	}

	displayCaption(`Number of visible trees: ${visibleCount}.`);
	displayCaption(`Best score: ${currMaxScore}.`);
}