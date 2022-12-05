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
	let stacks9001 = [];
	for(let i = 0; i < stacks.length; i++) {
		stacks9001.push(stacks[i].slice());
	}
	const MOVE_REGEX = /move (\d+) from (\d) to (\d)/g;
	while(entry = MOVE_REGEX.exec(input)) {
		move(+entry[1], +entry[2] - 1, +entry[3] - 1);
		move9001(+entry[1], +entry[2] - 1, +entry[3] - 1);
	}

	function move(number, source, destination) {
		for(let i = 0; i < number; i++) {
			let crate = stacks[source].pop();
			stacks[destination].push(crate);
		}
	}

	function move9001(number, source, destination) {
		let crates = stacks9001[source].splice(-number);
		for(let i = 0; i < crates.length; i++) {
			stacks9001[destination].push(crates[i]);
		}
	}

	let part1Answer = "";
	for(let i = 0; i < stacks.length; i++) {
		part1Answer += stacks[i][stacks[i].length - 1];
	}
	let part2Answer = "";
	for(let i = 0; i < stacks9001.length; i++) {
		part2Answer += stacks9001[i][stacks9001[i].length - 1];
	}
	displayCaption(`The crates at the top are ${part1Answer}.`);
	displayCaption(`The (9001) crates at the top are ${part2Answer}.`);
}