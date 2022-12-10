"use strict";

function day10(input) {
	const FILE_REGEX = /.+/g;
	let instructions = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		let newEntry = entry[0].split(" ");
		if(newEntry.length === 1) {
			instructions.push(newEntry);
		} else {
			instructions.push([newEntry[0], +newEntry[1]]);
		}
	}

	let cycles = 0;
	let regX = 1;
	let sum40By20 = 0;
	for(let i = 0; i < instructions.length; i++) {
		if(instructions[i][0] === "noop") {
			cycles++;
			if(cycles % 40 === 20) {
				sum40By20 += regX * cycles;
			}
		} else {
			cycles++;
			if(cycles % 40 === 20) {
				sum40By20 += regX * cycles;
			}
			cycles++;
			if(cycles % 40 === 20) {
				sum40By20 += regX * cycles;
			}
			regX += instructions[i][1];
		}
	}

	displayCaption(`The sum is ${sum40By20}.`);
}