"use strict";

function day23(input) {
	let grid = input.split("\n");
	let trueGrid = new Grid();
	for(let i = 0; i < grid.length; i++) {
		grid[i] = grid[i].split("");
		for(let j = 0; j < grid[i].length; j++) {
			if(grid[i][j] === "#") {
				trueGrid.elves.push(new Elf([j, i]));
			}
		}
	}

	for(let elf of trueGrid.elves) {
		elf.grid = trueGrid;
	}

	trueGrid.initBST();

	function firstLess(first, second) {
		if(first[0] < second[0]) return true;
		if(first[0] > second[0]) return false;
		if(first[1] < second[1]) return true;
		return false;
	}

	function isEqual(first, second) {
		return first[0] === second[0] && first[1] === second[1];
	}

	function BSTNode(data, parent) {
		this.data = data;
		this.left;
		this.right;
		this.parent = parent;
	}

	function BST() {
		this.nodes = [];
		this.head;

		this.insert = function(data) {
			if(this.nodes.length === 0) {
				this.nodes.push(new BSTNode(data, undefined));
				this.head = this.nodes[this.nodes.length - 1];
			} else {
				let currHead = this.head;
				while((currHead.left && firstLess(data, currHead.data)) || (currHead.right && !firstLess(data, currHead.data))) {
					currHead = firstLess(data, currHead.data) ? currHead.left : currHead.right;
				}
				if(firstLess(data, currHead.data)) {
					currHead.left = new BSTNode(data, currHead);
				} else {
					currHead.right = new BSTNode(data, currHead);
				}
			}
		}

		this.search = function(data) {
			if(this.nodes.length === 0) return false;
			let currHead = this.head;
			while(!isEqual(data, currHead.data) && ((currHead.left && firstLess(data, currHead.data)) || (currHead.right && !firstLess(data, currHead.data)))) {
				currHead = firstLess(data, currHead.data) ? currHead.left : currHead.right;
			}
			if(isEqual(data, currHead.data)) return currHead;
			return false;
		}

		this.delete = function(data) {
			let currHead = this.search(data);
			if(!currHead) throw `Could not delete (${data.join(", ")}) as it does not exist.`;
			if(currHead.left && currHead.right) {
				// two children
				let nextNode = this.successor(currHead);
				let nextNodeChild;
				if(nextNode.left) {
					nextNodeChild = nextNode.left;
				} else {
					nextNodeChild = nextNode.right;
				}
				if(nextNodeChild) {
					nextNodeChild.parent = nextNode.parent;
					if(!nextNode.parent) {
						this.head = nextNodeChild;
					} else {
						if(nextNode.parent.left === nextNode) {
							nextNode.parent.left = nextNodeChild;
						} else {
							nextNode.parent.right = nextNodeChild;
						}
					}
				} else {
					if(!nextNode.parent) {
						this.head = undefined;
					} else if(nextNode.parent.left === nextNode) {
						nextNode.parent.left = undefined;
					} else {
						nextNode.parent.right = undefined;
					}
				}
				currHead.data = nextNode.data.slice();
			} else if(!(currHead.left || currHead.right)) {
				// no children
				if(currHead.parent) {
					if(currHead.parent.left === currHead) {
						currHead.parent.left = undefined;
					} else {
						currHead.parent.right = undefined;
					}
				} else {
					this.head = undefined;
				}
			} else {
				// one child
				let child = currHead.left ? currHead.left : currHead.right;
				if(currHead.parent === undefined) {
					this.head = child;
				} else if(currHead.parent.left === currHead) {
					currHead.parent.left = child;
				} else {
					currHead.parent.right = child;
				}
				child.parent = currHead.parent;
			}
		}

		this.successor = function(node) {
			if(node.right) {
				let rootRight = node.right;
				while(rootRight.left) {
					rootRight = rootRight.left;
				}
				return rootRight;
			}
			let nodeParent = node.parent;
			while(nodeParent && node === nodeParent.right) {
				node = nodeParent;
				nodeParent = nodeParent.parent;
			}
			return nodeParent;
		}

		this.display = function(node = this.head) {
			if(node === undefined) return;
			let toDisplay = "";
			if(node.left) toDisplay += this.display(node.left) + ", ";
			toDisplay += `(${node.data[0]}, ${node.data[1]}), `;
			if(node.right) toDisplay += this.display(node.right);
			return toDisplay;
		}
	}

	function RNG(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function Grid() {
		this.elves = [];
		this.proposed = new Map();
		this.invalid = new Set();
		this.moveOrder = [
			[[-1, -1], [ 0, -1], [ 1, -1]], // N
			[[-1,  1], [ 0,  1], [ 1,  1]], // S
			[[-1, -1], [-1,  0], [-1,  1]], // W
			[[ 1, -1], [ 1,  0], [ 1,  1]]];// E
		this.adjacency = [
			[-1, -1],
			[-1,  0],
			[-1,  1],
			[ 0, -1],
			[ 0,  1],
			[ 1, -1],
			[ 1,  0],
			[ 1,  1]];
		this.elfPos = new BST();

		this.finished;

		this.initBST = function() {
			let elfPosArr = [];
			for(let elf of this.elves) {
				elfPosArr.push(elf.pos);
			}
			for(let i = 0; i < elfPosArr.length; i++) {
				let toSwap = RNG(i, elfPosArr.length - 1);
				let temp = elfPosArr[i].slice();
				elfPosArr[i] = elfPosArr[toSwap].slice();
				elfPosArr[toSwap] = temp;
			}
			for(let position of elfPosArr) {
				this.elfPos.insert(position);
			}
		}

		this.isElfHere = function(pos) {
			return this.elfPos.search(pos) ? true : false;
			//return this.elves.some(elf => elf.pos[0] === pos[0] && elf.pos[1] === pos[1]);
		}

		this.round = function(roundNum) {
			console.log(`Beginning round ${roundNum}.`);
			this.proposed.clear();
			this.invalid.clear();

			let willMove = false;
			for(let elf of this.elves) {
				if(!this.adjacency.every(function(offset) {
					return !this.isElfHere([elf.pos[0] + offset[0], elf.pos[1] + offset[1]]);
				}.bind(this))) {
					willMove = true;
					elf.proposeMove();
				}
			}
			if(!willMove) {
				return true;
			}

			console.log(`Proposals finished.`);

			for(let [pos, elf] of this.proposed) {
				if(!this.invalid.has(pos)) {
					let realPos = pos.split(",");
					realPos[0] = +realPos[0];
					realPos[1] = +realPos[1];
					this.elfPos.delete(elf.pos);
					this.elfPos.insert(realPos);
					elf.move(realPos);
				}
			}

			let rotation = this.moveOrder.shift();
			this.moveOrder.push(rotation);

			console.log(`Movement finished.`);

			return false;
		}

		this.display = function() {
			let minX = Number.MAX_SAFE_INTEGER;
			let minY = Number.MAX_SAFE_INTEGER;
			let maxX = Number.MIN_SAFE_INTEGER;
			let maxY = Number.MIN_SAFE_INTEGER;
			for(let elf of trueGrid.elves) {
				if(elf.pos[0] < minX) minX = elf.pos[0];
				if(elf.pos[1] < minY) minY = elf.pos[1];
				if(elf.pos[0] > maxX) maxX = elf.pos[0];
				if(elf.pos[1] > maxY) maxY = elf.pos[1];
			}
			let finalDisplay = `(${minX}, ${minY}) to (${maxX}, ${maxY}):
`;
			for(let y = minY; y <= maxY; y++) {
				let row = "";
				for(let x = minX; x <= maxX; x++) {
					if(this.isElfHere([x, y])) {
						row += "█";
					} else {
						row += " ";
					}
				}
				finalDisplay += row + "\n";
			}
			return finalDisplay;
		}
	}

	function Elf(pos) {
		this.pos = pos;
		this.grid;

		this.proposeMove = function() {
			let moveDirInd = -1;
			let isValidMove = true;
			do {
				moveDirInd++;
				isValidMove = true;
				if(moveDirInd === this.grid.moveOrder.length) return; // No moving allowed.
				for(let dir of this.grid.moveOrder[moveDirInd]) {
					if(this.grid.isElfHere([this.pos[0] + dir[0], this.pos[1] + dir[1]])) isValidMove = false;	
				}
			} while(!isValidMove);
			let trueVector = this.grid.moveOrder[moveDirInd][1];
			let finalMove = [this.pos[0] + trueVector[0], this.pos[1] + trueVector[1]];
			if(this.grid.proposed.has(finalMove.join())) {
				// Someone else proposed it :(
				this.grid.invalid.add(finalMove.join());
			} else {
				this.grid.proposed.set(finalMove.join(), this);
			}
		}

		this.move = function(pos) {
			this.pos = pos;
		}
	}

	let displayStorage = [];
	displayStorage.push(trueGrid.display());

	let roundNum = 1;
	while(!trueGrid.round(roundNum)) {
		displayStorage.push(trueGrid.display());
		if(roundNum === 10) {
			let minX = Number.MAX_SAFE_INTEGER;
			let minY = Number.MAX_SAFE_INTEGER;
			let maxX = Number.MIN_SAFE_INTEGER;
			let maxY = Number.MIN_SAFE_INTEGER;
			for(let elf of trueGrid.elves) {
				if(elf.pos[0] < minX) minX = elf.pos[0];
				if(elf.pos[1] < minY) minY = elf.pos[1];
				if(elf.pos[0] > maxX) maxX = elf.pos[0];
				if(elf.pos[1] > maxY) maxY = elf.pos[1];
			}

			displayCaption(`The area without elves is ${(maxX - minX + 1) * (maxY - minY + 1) - trueGrid.elves.length}.`);
		}
		roundNum++;
	}

	displayCaption(`All in all, it took ${roundNum} rounds.`);
	displayCaption(`The positions of every elf is displayed.`);
	displayCaption(`Use the buttons to move forward or back one round,`);
	displayCaption(`return to the start, play rounds at ten rounds a second, or pause playback.`);


	function buttonClosure() {
		let roundNum = 0;
		const MAX_ROUND_NUM = displayStorage.length;
		let intervalID;

		displayText(`Round 0:`);
		displayText(displayStorage[roundNum]);

		function increase() {
			if(roundNum + 1 < MAX_ROUND_NUM) {
				roundNum++;
				clearText();
				displayText(`Round ${roundNum}:`);
				displayText(displayStorage[roundNum]);
			} else {
				stop();
			}
		}

		function decrease() {
			if(roundNum > 0) {
				roundNum--;
				clearText();
				displayText(`Round ${roundNum}:`);
				displayText(displayStorage[roundNum]);
			}
		}

		function reset() {
			roundNum = 0;
			clearText();
			displayText(`Round ${roundNum}:`);
			displayText(displayStorage[roundNum]);
		}

		function go() {
			if(intervalID === undefined) {
				intervalID = setInterval(increase, 100);
			}
		}

		function stop() {
			if(intervalID !== undefined) {
				clearInterval(intervalID);
				intervalID = undefined;
			}
		}

		return [increase, decrease, reset, go, stop];
	}

	let buttonFuncs = buttonClosure();
	const button1 = assignButton(buttonFuncs[0], "Next Step");
	const button2 = assignButton(buttonFuncs[1], "Previous Step");
	const button3 = assignButton(buttonFuncs[2], "Return to Start");
	const button4 = assignButton(buttonFuncs[3], "Play");
	const button5 = assignButton(buttonFuncs[4], "Pause");
}