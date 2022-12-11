"use strict";

function day11(input) {
	const FILE_REGEX = /Monkey \d:\n(?:.+\n)+/g;
	let monke = [];
	let anxiousMonke = [];
	let entry;
	let finalMod = 1;
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
		finalMod *= testEntry;
		let TRUE_REGEX = /ue.+(\d)/g;
		let trueEntry = [...entry[0].matchAll(TRUE_REGEX)][0];
		trueEntry = +trueEntry[1];
		let FALSE_REGEX = /se.+(\d)/g;
		let falseEntry = [...entry[0].matchAll(FALSE_REGEX)][0];
		falseEntry = +falseEntry[1];
		let newMonke = new Monke(itemEntry, opEntry, testEntry, trueEntry, falseEntry);
		let otherMonke = new AnxietyMonke(itemEntry, opEntry, testEntry, trueEntry, falseEntry);
		monke.push(newMonke);
		anxiousMonke.push(otherMonke);
	}

	function Monke(items, operation, test, throwTrue, throwFalse) {
		this.items = items;
		for(let i = 0; i < this.items.length; i++) {
			this.items[i] = +this.items[i];
		}
		if(operation[1] === "old") {
			this.operation = old => old * old;
		} else if(operation[0] === "*") {
			this.operation = old => old * +operation[1];
		} else {
			this.operation = old => old + +operation[1];
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
			let inspected = this.items.shift();
			inspected = this.operation(inspected);
			inspected = Math.floor(inspected / 3);
			if(inspected % this.test === 0) {
				monke[this.throwTrue].items.push(inspected);
			} else {
				monke[this.throwFalse].items.push(inspected);
			}
		}
	}

	function AnxietyMonke(items, operation, test, throwTrue, throwFalse) {
		this.items = items.slice();
		for(let i = 0; i < this.items.length; i++) {
			this.items[i] = +this.items[i];
		}
		if(operation[1] === "old") {
			this.operation = old => old * old;
		} else if(operation[0] === "*") {
			this.operation = old => old * +operation[1];
		} else {
			this.operation = old => old + +operation[1];
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
			let inspected = this.items.shift();
			inspected = this.operation(inspected) % finalMod;
			if(inspected % this.test === 0) {
				anxiousMonke[this.throwTrue].items.push(inspected);
			} else {
				anxiousMonke[this.throwFalse].items.push(inspected);
			}
		}
	}

	function round() {
		for(let i = 0; i < monke.length; i++) {
			monke[i].takeTurn();
		}
	}

	function anxiousRound() {
		for(let i = 0; i < anxiousMonke.length; i++) {
			anxiousMonke[i].takeTurn();
		}
	}
	for(let i = 0; i < 20; i++) {
		round();
	}
	for(let i = 0; i < 10000; i++) {
		anxiousRound();
	}

	let monkeInspection = [];
	let anxietyMonkeInspection = [];
	for(let monk of monke) {
		monkeInspection.push(monk.inspectCount);
	}
	for(let aaaa of anxiousMonke) {
		anxietyMonkeInspection.push(aaaa.inspectCount);
	}
	monkeInspection.sort((a, b) => b - a);
	anxietyMonkeInspection.sort((a, b) => b - a);
	displayText(`The monkey business is ${monkeInspection[0] * monkeInspection[1]}.`);
	displayText(`AAAAA!!! THE MONKEY BUSINESS IS ${anxietyMonkeInspection[0] * anxietyMonkeInspection[1]}!!!`);
}