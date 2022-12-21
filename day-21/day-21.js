"use strict";

function day21(input) {
	const FILE_REGEX = /([a-z]{4}): (?:(\d+)|(?:([a-z]{4}) (\+|-|\*|\/) ([a-z]{4})))/g;
	let monkeys = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		if(entry[2]) {
			monkeys.push(new Monkey(entry[1], +entry[2]));
		} else {
			monkeys.push(new Monkey(entry[1], [entry[3], entry[4], entry[5]]));
		}
	}

	function findMonkey(name) {
		for(let monkey of monkeys) {
			if(monkey.name === name) return monkey;
		}
	}

	for(let monkey of monkeys) {
		monkey.initYell();
	}

	function Monkey(name, yell) {
		this.name = name;
		this.yell = yell;

		this.initYell = function() {
			if(typeof this.yell === "number") {
				this.yellFunc = () => this.yell;
				return;
			}
			this.firstMonkey = findMonkey(this.yell[0]);
			this.secondMonkey = findMonkey(this.yell[2]);
			switch(this.yell[1]) {
			case "+":
				this.yellFunc = function() {
					return this.firstMonkey.yellFunc() + this.secondMonkey.yellFunc();
				}.bind(this);
				break;
			case "-":
				this.yellFunc = function() {
					return this.firstMonkey.yellFunc() - this.secondMonkey.yellFunc();
				}.bind(this);
				break;
			case "*":
				this.yellFunc = function() {
					return this.firstMonkey.yellFunc() * this.secondMonkey.yellFunc();
				}.bind(this);
				break;
			case "/":
				this.yellFunc = function() {
					return this.firstMonkey.yellFunc() / this.secondMonkey.yellFunc();
				}.bind(this);
				break;
			}
		}
	}


	let root = findMonkey("root");
	let result = root.yellFunc();
	displayCaption(`The root monkey yells ${result}.`);
}