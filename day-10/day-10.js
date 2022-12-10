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

	function duringCycle() {
		if(cycles % 40 === 20) {
			sum40By20 += regX * cycles;
		}
		let rowX = cycles % 40;
		if(rowX === regX || rowX === regX + 1 || rowX === regX - 1) {
			screen[cycles] = "█";
		}
	}

	let cycles = 0;
	let regX = 1;
	let sum40By20 = 0;
	let screen = new Array(240).fill(" ");
	for(let i = 0; i < instructions.length; i++) {
		if(instructions[i][0] === "noop") {
			duringCycle();
			cycles++;
		} else {
			duringCycle();
			cycles++;
			duringCycle();
			cycles++;
			regX += instructions[i][1];
		}
	}

	displayCaption(`The sum is ${sum40By20}.`);
	displayCaption(`Unfortunately, I cannot tell you what the screen says.`);
	for(let i = 0; i < 6; i++) {
		displayText(screen.slice(i * 40, (i + 1) * 40).join(""));
	}
}