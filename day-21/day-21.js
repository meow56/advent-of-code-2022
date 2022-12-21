"use strict";

function day21(input) {
	const FILE_REGEX = /([a-z]{4}): (?:(\d+)|(?:([a-z]{4}) (\+|-|\*|\/) ([a-z]{4})))/g;
	let monkeys = [];
	let monkeys2 = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		if(entry[2]) {
			monkeys.push(new Monkey(entry[1], +entry[2]));
			monkeys2.push(new Monkey2(entry[1], +entry[2]));
		} else {
			monkeys.push(new Monkey(entry[1], [entry[3], entry[4], entry[5]]));
			monkeys2.push(new Monkey2(entry[1], [entry[3], entry[4], entry[5]]));
		}
	}

	function findMonkey(name, monkeyGroup = monkeys) {
		for(let monkey of monkeyGroup) {
			if(monkey.name === name) return monkey;
		}
	}

	for(let monkey of monkeys) {
		monkey.initYell();
	}
	for(let monkey of monkeys2) {
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

	function Monkey2(name, yell) {
		this.name = name;
		this.yell = yell;

		this.initYell = function() {
			if(typeof this.yell === "number") {
				this.yellFunc = () => this.yell;
				return;
			}
			this.firstMonkey = findMonkey(this.yell[0], monkeys2);
			this.secondMonkey = findMonkey(this.yell[2], monkeys2);
			if(this.name === "root") {
				this.yellFunc = function() {
					return this.firstMonkey.yellFunc() === this.secondMonkey.yellFunc();
				}
				return;
			}
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
		this.includesHuman = function() {
			if(this.name === "humn") return true;
			if(typeof this.yell === "number") return false;
			return this.firstMonkey.includesHuman() || this.secondMonkey.includesHuman();
		}

		this.invertFunc = function() {
			switch(this.yell[1]) {
			case "+":
				if(this.firstMonkey.includesHuman()) {
					return (val) => val - this.secondMonkey.yellFunc();
				} else {
					return (val) => val - this.firstMonkey.yellFunc();
				}
				break;
			case "-":
				if(this.firstMonkey.includesHuman()) {
					return (val) => val + this.secondMonkey.yellFunc();
				} else {
					return (val) => this.firstMonkey.yellFunc() - val;
				}
				break;
			case "*":
				if(this.firstMonkey.includesHuman()) {
					return (val) => val / this.secondMonkey.yellFunc();
				} else {
					return (val) => val / this.firstMonkey.yellFunc();
				}
				break;
			case "/":
				if(this.firstMonkey.includesHuman()) {
					return (val) => val * this.secondMonkey.yellFunc();
				} else {
					return (val) => this.firstMonkey.yellFunc() / val;
				}
				break;
			}
		}
	}


	let root = findMonkey("root");
	let result = root.yellFunc();
	displayCaption(`The root monkey yells ${result}.`);

	let currMonkey = findMonkey("root", monkeys2);
	let toYell;
	while(currMonkey.name !== "humn") {
		if(currMonkey.name === "root") {
			if(currMonkey.firstMonkey.includesHuman()) {
				toYell = currMonkey.secondMonkey.yellFunc();
			} else {
				toYell = currMonkey.firstMonkey.yellFunc();
			}
		} else {
			toYell = currMonkey.invertFunc()(toYell);
		}

		if(currMonkey.firstMonkey.includesHuman()) {
			currMonkey = currMonkey.firstMonkey;
		} else {
			currMonkey = currMonkey.secondMonkey;
		}
	}
	displayCaption(`You should yell ${toYell}.`);
}