"use strict";

function day11(input) {
	const FILE_REGEX = /Monkey \d:\n(?:.+\n)+/g;
	let monke = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		let ITEM_REGEX = /Starting items: (?:\d+,? ?)+/g;
		let itemEntry = entry[0].match(ITEM_REGEX);
		itemEntry = itemEntry[0].slice(16).split(", ");
		let OP_REGEX = /Operation: new = old (\*|\+) (\d+|old)/g;
		let opEntry = [...entry[0].matchAll(OP_REGEX)][0];
		opEntry = [opEntry[1], opEntry[2]];
		let TEST_REGEX = /Test: divisible by (\d+)/g;
		let testEntry = [...entry[0].matchAll(TEST_REGEX)][0];
		testEntry = +testEntry[1];
		let TRUE_REGEX = /ue.+(\d)/g;
		let trueEntry = [...entry[0].matchAll(TRUE_REGEX)][0];
		trueEntry = +trueEntry[1];
		let FALSE_REGEX = /se.+(\d)/g;
		let falseEntry = [...entry[0].matchAll(FALSE_REGEX)][0];
		falseEntry = +falseEntry[1];
		let newMonke = new Monke(itemEntry, opEntry, testEntry, trueEntry, falseEntry);
		monke.push(newMonke);
	}

	console.log("done!");

	function Monke(items, operation, test, throwTrue, throwFalse) {
		this.items = items;
		if(operation[1] === "old") {
			this.operation = old => old * old;
		} else if(operation[0] === "*") {
			this.operation = old => old * +operation[1];
		} else {
			this.operation = old => +old + +operation[1];
		}
		this.test = test;
		this.throwTrue = throwTrue;
		this.throwFalse = throwFalse;
		this.inspectCount = 0;

		this.takeTurn = function() {
			while(this.items.length !== 0) {
				this.inspect();
			}
		}

		this.inspect = function() {
			this.inspectCount++;
			let inspected = items.shift();
			console.groupCollapsed(`Monke inspect ${inspected}, ook!`);
			inspected = this.operation(inspected);
			console.log(`Ook, you are now worried by ${inspected}!`);
			inspected = Math.floor(inspected / 3);
			console.log(`It's not broken, ook! Worry at ${inspected}!`);
			if(inspected % this.test === 0) {
				console.log(`I threw it to monke ${this.throwTrue}, okiki!!`);
				monke[this.throwTrue].items.push(inspected);
			} else {
				console.log(`I threw it to monke ${this.throwFalse}, okiki!!`);
				monke[this.throwFalse].items.push(inspected);
			}
			console.groupEnd();
		}
	}

	function round(currRound) {
		for(let i = 0; i < monke.length; i++) {
			console.groupCollapsed(`Round ${currRound}, monke ${i}'s turn.`);
			monke[i].takeTurn();
			console.groupEnd();
		}
	}
	for(let i = 0; i < 20; i++) {
		round(i);
	}

	let monkeInspection = [];
	for(let monk of monke) {
		monkeInspection.push(monk.inspectCount);
	}
	monkeInspection.sort((a, b) => b - a);
	displayText(`The monkey business is ${monkeInspection[0] * monkeInspection[1]}.`);
}