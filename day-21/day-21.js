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

	for(let monkey of monkeys) {
		monkey.initYell();
	}

	function findMonkey(name) {
		for(let monkey of monkeys) {
			if(monkey.name === name) return monkey;
		}
	}

	function Monkey(name, yell) {
		this.name = name;
		this.yell = yell;
		this.yellsNum = typeof this.yell === "number";
		this.firstMonkey;
		this.secondMonkey;
		this.yellFunc;
		this.humanInFirst;
		this.depth;

		this.initYell = function() {
			if(this.yellsNum) {
				this.yellFunc = () => this.yell;
				return;
			}
			this.firstMonkey = findMonkey(this.yell[0]);
			this.secondMonkey = findMonkey(this.yell[2]);
			switch(this.yell[1]) {
			case "+":
				this.yellFunc = function() {
					return this.firstMonkey.yellFunc() + this.secondMonkey.yellFunc();
				}
				break;
			case "-":
				this.yellFunc = function() {
					return this.firstMonkey.yellFunc() - this.secondMonkey.yellFunc();
				}
				break;
			case "*":
				this.yellFunc = function() {
					return this.firstMonkey.yellFunc() * this.secondMonkey.yellFunc();
				}
				break;
			case "/":
				this.yellFunc = function() {
					return this.firstMonkey.yellFunc() / this.secondMonkey.yellFunc();
				}
				break;
			}
		}

		this.includesHuman = function() {
			if(this.name === "humn") return true;
			if(this.yellsNum) return false;
			let firstIncludesHuman = this.firstMonkey.includesHuman();
			let secondIncludesHuman = this.secondMonkey.includesHuman();
			if(firstIncludesHuman) this.humanInFirst = true;
			if(secondIncludesHuman) this.humanInFirst = false;
			return firstIncludesHuman || secondIncludesHuman;
		}

		this.invertFunc = function() {
			switch(this.yell[1]) {
			case "+":
				if(this.humanInFirst) {
					return (val) => val - this.secondMonkey.yellFunc();
				} else {
					return (val) => val - this.firstMonkey.yellFunc();
				}
				break;
			case "-":
				if(this.humanInFirst) {
					return (val) => val + this.secondMonkey.yellFunc();
				} else {
					return (val) => this.firstMonkey.yellFunc() - val;
				}
				break;
			case "*":
				if(this.humanInFirst) {
					return (val) => val / this.secondMonkey.yellFunc();
				} else {
					return (val) => val / this.firstMonkey.yellFunc();
				}
				break;
			case "/":
				if(this.humanInFirst) {
					return (val) => val * this.secondMonkey.yellFunc();
				} else {
					return (val) => this.firstMonkey.yellFunc() / val;
				}
				break;
			}
		}

		this.findDepth = function(depth) {
			this.depth = depth;
			if(this.yellsNum) return;
			this.firstMonkey.findDepth(depth + 1);
			this.secondMonkey.findDepth(depth + 1);
		}

		this.display = function(depth) {
			if(this.yellsNum) return this.yell;
			if(this.depth > depth) return this.yellFunc();
			return `(${this.firstMonkey.display(depth)} ${this.yell[1]} ${this.secondMonkey.display(depth)})`;
		}

		this.invertDisplay = function(depth, currVal) {
			if(this.name === "humn") return ["()", currVal];
			let result;
			if(this.name === "root") {
				if(this.humanInFirst) {
					[result, currVal] = this.firstMonkey.invertDisplay(depth - 1, this.secondMonkey.yellFunc());
					result = result.replace("()", currVal);
				} else {
					[result, currVal] = this.secondMonkey.invertDisplay(depth - 1, this.firstMonkey.yellFunc());
					result = result.replace("()", currVal);
				}
				return "humn = " + result;
			}
			if(this.humanInFirst) {
				[result, currVal] = this.firstMonkey.invertDisplay(depth - 1, depth > 0 ? this.invertFunc()(currVal) : currVal);
			} else {
				[result, currVal] = this.secondMonkey.invertDisplay(depth - 1, depth > 0 ? this.invertFunc()(currVal) : currVal);
			}
			if(depth > 0) {
				return [result, currVal];
			}
			switch(this.yell[1]) {
			case "+":
				if(this.humanInFirst) {
					result = result.replace("()", `(() - ${this.secondMonkey.yellFunc()})`);
				} else {
					result = result.replace("()", `(() - ${this.firstMonkey.yellFunc()})`);
				}
				break;
			case "-":
				if(this.humanInFirst) {
					result = result.replace("()", `(() + ${this.secondMonkey.yellFunc()})`);
				} else {
					result = result.replace("()", `(${this.firstMonkey.yellFunc()} - ())`);
				}
				break;
			case "*":
				if(this.humanInFirst) {
					result = result.replace("()", `(() / ${this.secondMonkey.yellFunc()})`);
				} else {
					result = result.replace("()", `(() / ${this.firstMonkey.yellFunc()})`);
				}
				break;
			case "/":
				if(this.humanInFirst) {
					result = result.replace("()", `(() * ${this.secondMonkey.yellFunc()})`);
				} else {
					result = result.replace("()", `(${this.firstMonkey.yellFunc()} / ())`);
				}
				break;
			}
			return [result, currVal];
		}
	}

	let root = findMonkey("root");
	let result = root.yellFunc();
	displayCaption(`The root monkey yells ${result}.`);
	root.findDepth(0);
	let maxOpDepth = monkeys.reduce((acc, val) => Math.max(acc, val.depth), 0) - 1;
	// The last layer always consists of monkeys who shout numbers.
	for(let i = maxOpDepth; i >= -1; i--)
		displayText("root = " + root.display(i));

	displayText();

	root.includesHuman();
	let humanDepth = findMonkey("humn").depth;
	for(let i = 1; i <= humanDepth; i++)
		displayText(root.invertDisplay(i));

	let currMonkey = root;
	let toYell;
	while(currMonkey.name !== "humn") {
		if(currMonkey.name === "root") {
			if(currMonkey.humanInFirst) {
				toYell = currMonkey.secondMonkey.yellFunc();
			} else {
				toYell = currMonkey.firstMonkey.yellFunc();
			}
		} else {
			toYell = currMonkey.invertFunc()(toYell);
		}

		if(currMonkey.humanInFirst) {
			currMonkey = currMonkey.firstMonkey;
		} else {
			currMonkey = currMonkey.secondMonkey;
		}
	}
	displayCaption(`You should yell ${toYell}.`);

	displayCaption(`The equations for root and humn are displayed.`);
	displayCaption(`First, the equation to determine the value of root is displayed.`);
	displayCaption(`Then, it is slowly evaluated on successive lines until the answer is reached.`);
	displayCaption(`Then, the equation to determine the value of humn is displayed.`);
	displayCaption(`Like above, it is then slowly evaluated until a single number is reached.`);
}