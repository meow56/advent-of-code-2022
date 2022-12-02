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
	const realOutcomes = new Map();
	realOutcomes.set("AY", 4); // Rock     v Rock
	realOutcomes.set("AZ", 8); // Rock     v Paper
	realOutcomes.set("AX", 3); // Rock     v Scissors
	realOutcomes.set("BX", 1); // Paper    v Rock
	realOutcomes.set("BY", 5); // Paper    v Paper
	realOutcomes.set("BZ", 9); // Paper    v Scissors
	realOutcomes.set("CZ", 7); // Scissors v Rock
	realOutcomes.set("CX", 2); // Scissors v Paper
	realOutcomes.set("CY", 6); // Scissors v Scissors
	let scores = [];
	let realScores = [];
	for(let i = 0; i < rounds.length; i++) {
		scores[i] = outcomes.get(rounds[i][0] + rounds[i][1]);
		realScores[i] = realOutcomes.get(rounds[i][0] + rounds[i][1]);
	}
	let totalScore = scores.reduce((acc, val) => acc + val, 0);
	let trueScore = realScores.reduce((acc, val) => acc + val, 0);
	updateCaption(`The total score is ${totalScore}.`);
	updateCaption(`The REAL total score is ${trueScore}.`);
}