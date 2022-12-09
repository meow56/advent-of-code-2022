"use strict";

function day9(input) {
	const FILE_REGEX = /[URLD] \d+/g;
	let instructions = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		entry = entry[0].split(" ");
		instructions.push([entry[0], +entry[1]]);
	}
	let headPos = [0, 0];
	let tailPos = [0, 0];
	let visited = new Set(["0,0"]);

	function calcManDist() {
		return Math.abs(headPos[0] - tailPos[0]) + Math.abs(headPos[1] - tailPos[1]);
	}

	function isFarAway() {
		let manDist = calcManDist();
		if(manDist === 3) return true;
		if(manDist === 2 && (headPos[0] === tailPos[0] || headPos[1] === tailPos[1])) return true;
		return false; 
	}

	function moveTail() {
		if(isFarAway()) {
			if(calcManDist() === 2) {
				// Just move toward head!
				if(headPos[0] === tailPos[0]) {
					tailPos[1] += Math.sign(headPos[1] - tailPos[1]);
				} else {
					tailPos[0] += Math.sign(headPos[0] - tailPos[0]);
				}
			} else {
				tailPos[0] += Math.sign(headPos[0] - tailPos[0]);
				tailPos[1] += Math.sign(headPos[1] - tailPos[1]);
			}
			visited.add(tailPos.toString());
		}
	}

	function moveHead(instruction) {
		let toChange, direction;
		switch(instruction[0]) {
		case "U":
			toChange = 1;
			direction = 1;
			break;
		case "D":
			toChange = 1;
			direction = -1;
			break;
		case "L":
			toChange = 0;
			direction = -1;
			break;
		case "R":
			toChange = 0;
			direction = 1;
			break;
		}
		for(let i = 0; i < instruction[1]; i++) {
			headPos[toChange] += direction;
			moveTail();
		}
	}

	for(let i = 0; i < instructions.length; i++) {
		moveHead(instructions[i]);
	}

	displayCaption(`Visited ${visited.size} coords with the tail.`);
}