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
		// acc is always sorted in ascending order, so the first element is the smallest.
		if(val > acc[0]) {
			return [...acc.slice(1), val].sort((a, b) => a - b);
		}
		return acc;
	}, [0, 0, 0]);
	let maxSum = maxVals.reduce(function(acc, val) {
		return acc + val;
	}, 0);
	updateCaption(`The max calorie amount is ${maxVals[maxVals.length - 1]}.`);
	updateCaption(`The sum of the max calorie amounts is ${maxSum}.`);
}