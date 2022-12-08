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
	}, 0)
	displayCaption(`Number of visible trees: ${visibleCount}.`);
}