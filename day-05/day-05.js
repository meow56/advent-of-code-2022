"use strict";

function day5(input) {
	const FILE_REGEX = /(?: {0,}\[[A-Z]\])+/g;
	let stacks = [[], [], [], [], [], [], [], [], []];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		let row = entry[0];
		for(let i = 0; i < 9; i++) {
			let index = (i * 4) + 1;
			if(row[index] !== " ") {
				stacks[i].unshift(row[index]);
			}
		}
	}
	console.log(stacks);
	const MOVE_REGEX = /move (\d+) from (\d) to (\d)/g;
	while(entry = MOVE_REGEX.exec(input)) {
		move(+entry[1], +entry[2] - 1, +entry[3] - 1);
	}

	function move(number, source, destination) {
		console.log(`Moving ${number} from ${source} to ${destination}`);
		if(source === 3 && destination === 0) {
			console.log("hee");
		}
		for(let i = 0; i < number; i++) {
			let crate = stacks[source].pop();
			if(typeof crate === "undefined") {
				console.log("undefined");
			}
			stacks[destination].push(crate);
		}
	}

	let part1Answer = "";
	for(let i = 0; i < stacks.length; i++) {
		part1Answer += stacks[i][stacks[i].length - 1];
	}
	displayCaption(`The crates at the top are ${part1Answer}.`);
}