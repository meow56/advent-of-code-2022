"use strict";

function day1(input) {
	let splitLines = input.split("\n");
	let elves = [[]];
	let totals = [0];
	for(let i = 0; i < splitLines.length; i++) {
		if(splitLines[i] === "") {
			elves.push([0]);
			totals.push(0);
		} else {
			elves[elves.length - 1].push(splitLines[i]);
			totals[elves.length - 1] += parseInt(splitLines[i], 10);
		}
	}
	let maxVal = Math.max(...totals);
	updateCaption(`The max calorie amount is ${maxVal}.`);
}