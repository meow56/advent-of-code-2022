"use strict";

function day2(input) {
	const FILE_REGEX = /[ABC] [XYZ]/g;
	let rounds = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		rounds.push([entry[0][0], entry[0][2]]);
	}
	const outcomes = new Map();
	outcomes.set("AX", 4); // Rock     v Rock
	outcomes.set("AY", 8); // Rock     v Paper
	outcomes.set("AZ", 3); // Rock     v Scissors
	outcomes.set("BX", 1); // Paper    v Rock
	outcomes.set("BY", 5); // Paper    v Paper
	outcomes.set("BZ", 9); // Paper    v Scissors
	outcomes.set("CX", 7); // Scissors v Rock
	outcomes.set("CY", 2); // Scissors v Paper
	outcomes.set("CZ", 6); // Scissors v Scissors
	let scores = [];
	for(let i = 0; i < rounds.length; i++) {
		scores[i] = outcomes.get(rounds[i][0] + rounds[i][1]);
	}
	let totalScore = scores.reduce((acc, val) => acc + val, 0);
	updateCaption(`The total score is ${totalScore}.`);
}