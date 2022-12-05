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
	let stacks9001 = [];
	for(let i = 0; i < stacks.length; i++) {
		stacks9001.push(stacks[i].slice());
	}
	const MOVE_REGEX = /move (\d+) from (\d) to (\d)/g;
	let stacksStates = [[]];
	let stacks9001States = [[]];
	for(let i = 0; i < stacks.length; i++) {
		stacksStates[0].push(stacks[i].slice());
	}
	for(let i = 0; i < stacks9001.length; i++) {
		stacks9001States[0].push(stacks9001[i].slice());
	}
	let moves = [[]];
	while(entry = MOVE_REGEX.exec(input)) {
		moves.push([+entry[1], +entry[2], +entry[3]]);
		move(+entry[1], +entry[2] - 1, +entry[3] - 1);
		move9001(+entry[1], +entry[2] - 1, +entry[3] - 1);
		stacksStates.push([]);
		for(let i = 0; i < stacks.length; i++) {
			stacksStates[stacksStates.length - 1].push(stacks[i].slice());
		}
		stacks9001States.push([]);
		for(let i = 0; i < stacks9001.length; i++) {
			stacks9001States[stacks9001States.length - 1].push(stacks9001[i].slice());
		}
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
	displayCaption(`A visual of the stacks is displayed.`);
	displayCaption(`Use the previous and next buttons to move crates, and flip to change between part 1 and 2. Or skip to the end or return to the start with the respective buttons.`);

	function buttonClosure() {
		const STACK_PRE = assignBlock("stacks");
		const INFO_PRE = assignBlock("info");
		const privateStacksStates = stacksStates;
		const privateStacks9001States = stacks9001States;
		const privateMoves = moves;
		const TOTAL_MOVES = moves.length;
		let moveNum = 0;
		let is9001 = false;
		function displayStacks(theStacks) {
			STACK_PRE.clearText();
			INFO_PRE.clearText();
			let tallestStack = theStacks.reduce(function(acc, val) {
				return Math.max(acc, val.length);
			}, 0);
			for(let i = tallestStack - 1; i >= 0; i--) {
				let finalString = "";
				for(let j = 0; j < theStacks.length; j++) {
					if(theStacks[j][i]) {
						finalString += `[${theStacks[j][i]}] `;
					} else {
						finalString += `    `;
					}
				}
				STACK_PRE.displayText(finalString);
			}
			STACK_PRE.displayText(` 1   2   3   4   5   6   7   8   9`);
			INFO_PRE.displayText(`CrateMover ${is9001 ? "9001" : "9000"}`);
			if(moveNum !== 0) {
				INFO_PRE.displayText(`Move ${moveNum}: ${moves[moveNum][0]} from ${moves[moveNum][1]} to ${moves[moveNum][2]}.`);
			} else {
				INFO_PRE.displayText(`Initial state.`);
			}
		}
		function decreaseMoveNum() {
			if(moveNum !== 0) {
				moveNum--;
				displayStacks(is9001 ? privateStacks9001States[moveNum] : privateStacksStates[moveNum]);
			}
		}
		function increaseMoveNum() {
			if(moveNum !== TOTAL_MOVES - 1) {
				moveNum++;
				displayStacks(is9001 ? privateStacks9001States[moveNum] : privateStacksStates[moveNum]);
			}
		}
		function flip9001() {
			is9001 = !is9001;
			displayStacks(is9001 ? privateStacks9001States[moveNum] : privateStacksStates[moveNum]);
		}
		function toEnd() {
			if(moveNum !== TOTAL_MOVES - 1) {
				moveNum = TOTAL_MOVES - 1;
				displayStacks(is9001 ? privateStacks9001States[moveNum] : privateStacksStates[moveNum]);
			}
		}
		function toBeginning() {
			if(moveNum !== 0) {
				moveNum = 0;
				displayStacks(is9001 ? privateStacks9001States[moveNum] : privateStacksStates[moveNum]);
			}
		}
		displayStacks(privateStacksStates[moveNum]);
		return [decreaseMoveNum, increaseMoveNum, flip9001, toEnd, toBeginning];
	}

	let [button1F, button2F, button3F, button4F, button5F] = buttonClosure();
	let button1 = assignButton(button1F, "Previous Move");
	let button2 = assignButton(button2F, "Next Move");
	let button3 = assignButton(button3F, "Flip 9000/9001");
	let button4 = assignButton(button4F, "To End");
	let button5 = assignButton(button5F, "To Beginning");
}