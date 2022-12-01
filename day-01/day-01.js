"use strict";

function day1(input) {
	let splitLines = input.split("\n");
	let totals = [0];
	for(let i = 0; i < splitLines.length; i++) {
		if(splitLines[i] === "") {
			totals.push(0);
		} else {
			totals[totals.length - 1] += parseInt(splitLines[i], 10);
		}
	}
	let maxVals = totals.reduce(function(acc, val) {
		if(val > acc[0]) {
			return [val, acc[0], acc[1]];
		} else if(val > acc[1]) {
			return [acc[0], val, acc[1]];
		} else if(val > acc[2]) {
			return [acc[0], acc[1], val];
		}
		return acc;
	}, [0, 0, 0]);
	let maxSum = maxVals.reduce(function(acc, val) {
		return acc + val;
	}, 0);
	updateCaption(`The max calorie amount is ${maxVals[0]}.`);
	updateCaption(`The sum of the max calorie amounts is ${maxSum}.`);
}