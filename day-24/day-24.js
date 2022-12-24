"use strict";

function day24(input) {
	let rows = input.split("\n");
	let minX, maxX;
	let minY = 1;
	let maxY = rows.length - 2;
	let blizzards = [];
	for(let y = 0; y < rows.length; y++) {
		let poses = rows[y].split("");
		minX = 1;
		maxX = poses.length - 2;
		for(let x = 0; x < poses.length; x++) {
			if(poses[x] !== "." && poses[x] !== "#") {
				blizzards.push(new Blizzard([x, y], poses[x]));
			}
		}
	}
	let goal = [maxX, maxY];


	let blizzardPoses = new BST();
	let blizz = blizzards.slice();
	for(let i = 0; i < blizz.length; i++) {
		let swapInd = RNG(i, blizz.length - 1);
		let temp = blizz[i];
		blizz[i] = blizz[swapInd];
		blizz[swapInd] = temp;
	}
	blizzards = blizz;
	for(let b of blizz) {
		blizzardPoses.insert(b.pos);
	}
	// let tempDisp = "";
	// for(let y = minY; y <= maxY; y++) {
	// 	let row = "";
	// 	for(let x = minX; x <= maxX; x++) {
	// 		console.log(`(${x}, ${y})`);
	// 		let dirInd = " ";
	// 		for(let blizz of blizzards) {
	// 			if(isEqual(blizz.pos, [x, y])) {
	// 				if(blizz.dir === "v") {
	// 					dirInd = "v";
	// 				}
	// 			}
	// 		}
	// 		row += dirInd;
	// 	}
	// 	tempDisp += row + "\n";
	// }
	// console.log(tempDisp);

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

		this.copy = function() {
			let theCopy = new BSTNode(this.data, this.parent);
			if(this.left) theCopy.left = this.left.copy();
			if(this.right) theCopy.right = this.right.copy();
			return theCopy;
		}
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

		this.copy = function() {
			let theCopy = new BST();
			let newNodes = [];
			for(let node of this.nodes) {
				newNodes.push(node.copy());
			}
			theCopy.nodes = newNodes;
			theCopy.head = this.head;
			return theCopy;
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

	function mod(num, base) {
		return ((num % base) + base) % base;
	}

	function GCD(num1, num2) {
		while(num1 !== 0) {
			let temp = num1;
			num1 = num2 % num1;
			num2 = temp;
		}
		return num2;
	}

	function LCM(num1, num2) {
		return num1 * num2 / GCD(num1, num2);
	}

	function Blizzard(pos, dir) {
		this.pos = pos;
		this.dir = dir;
		switch(dir) {
		case ">":
			this.move = (step) => {
				return [mod(this.pos[0] + step - minX, maxX - minX + 1) + minX, this.pos[1]];
			}
			break;
		case "v":
			this.move = (step) => {
				return [this.pos[0], mod(this.pos[1] + step - minY, maxY - minY + 1) + minY];
			}
			break;
		case "<":
			this.move = (step) => {
				return [mod(this.pos[0] - step - minX, maxX - minX + 1) + minX, this.pos[1]];
			}
			break;
		case "^":
			this.move = (step) => {
				return [this.pos[0], mod(this.pos[1] - step - minY, maxY - minY + 1) + minY];
			}
			break;
		}

		this.trueMove = function(step, bst) {
			bst.insert(this.move(step));
		}

		this.copy = function() {
			return new Blizzard(this.pos, this.dir);
		}
	}

	let reachedPos = new Map();

	function genKey(currPos, nextTime) {
		return currPos.join() + "," + (nextTime % LCM(maxX - minX + 1, maxY - minY + 1));
	}

	let bsts = [];

	function TileNode(pos, time) {
		this.pos = pos;
		this.time = time;
		this.visited = false;
		this.depth;
		this.neighbors = [];
		if(bsts[this.time]) {
			this.bst = bsts[this.time];
		} else {
			this.bst = new BST();
			blizzards.map((blizz) => blizz.trueMove(this.time + 1, this.bst));
			bsts[this.time] = this.bst;
		}
		let availableMoves = [];
		let nextPos = [this.pos[0] + 1, this.pos[1]];
		if(rows[nextPos[1]][nextPos[0]] !== "#" && !this.bst.search(nextPos)) {
			this.neighbors.push(nextPos);
		}
		nextPos = [this.pos[0], this.pos[1] + 1];
		if(nextPos[1] < maxY + 1 && rows[nextPos[1]][nextPos[0]] !== "#" && !this.bst.search(nextPos)) {
			this.neighbors.push(nextPos);
		}
		nextPos = [this.pos[0] - 1, this.pos[1]];
		if(rows[nextPos[1]][nextPos[0]] !== "#" && !this.bst.search(nextPos)) {
			this.neighbors.push(nextPos);
		}
		nextPos = [this.pos[0], this.pos[1] - 1];
		if(nextPos[1] > 0 && rows[nextPos[1]][nextPos[0]] !== "#" && !this.bst.search(nextPos)) {
			this.neighbors.push(nextPos);
		}

		if(!this.bst.search(this.pos)) {
			this.neighbors.push(this.pos);
		}
	}

	let tiles = [new TileNode([1, 0], 0)];

	function findTile(pos, time) {
		for(let tile of tiles) {
			if(isEqual(tile.pos, pos) && time === tile.time) return tile;
		}
	}

	function BFS(start = tiles[0], goal = [maxX, maxY]) {
		tiles = [start];
		let queue = [start];
		while(queue.length !== 0) {
			let next = queue.shift();
			if(isEqual(next.pos, goal)) return next.time + 1;
			for(let neighbor of next.neighbors) {
				if(!findTile(neighbor, next.time + 1)) {
					tiles.push(new TileNode(neighbor, next.time + 1));
					queue.push(tiles[tiles.length - 1]);
				}
			}
		}
	}
	let part1 = BFS();
	displayCaption(`The shortest time is ${part1}.`);
	let waitGoBack = BFS(new TileNode([maxX, maxY + 1], part1), [minX, minY]);
	let iSaidGoBack = BFS(new TileNode([minX, minY - 1], waitGoBack));
	displayCaption(`The big time is ${iSaidGoBack}.`);



	let currMin = Number.MAX_SAFE_INTEGER;
	function toTheFinish(currPos = [1, 0], nextTime = 1) {
		if(isEqual(currPos, goal)) {
			console.log(`Made it! Score: ${nextTime}`);
			reachedPos.set(genKey(currPos, nextTime), nextTime);
			currMin = Math.min(nextTime, currMin);
			return nextTime; // One final move is required to move down to the exit.
		}
		// if(trace.includes(genKey(currPos, nextTime))) {
		// 	// We just wasted time.
		// 	reachedPos.set(genKey(currPos, nextTime), Number.MAX_SAFE_INTEGER);
		// 	return Number.MAX_SAFE_INTEGER;
		// }
		if(currMin < nextTime) {
			// We've already taken more steps than
			// the current best route to the finish.
			return Number.MAX_SAFE_INTEGER;
		}
		if(reachedPos.has(genKey(currPos, nextTime))) {
			if(reachedPos.get(genKey(currPos, nextTime)) < nextTime) {
				return Number.MAX_SAFE_INTEGER;
				// We've reached this exact position quicker than currently,
				// so we just wasted time.
			}
		}
		reachedPos.set(genKey(currPos, nextTime), Math.min(nextTime, reachedPos.get(genKey(currPos, nextTime))));
		// trace.push(genKey(currPos, nextTime));
		// let finalDisplay = "";
		// for(let y = minY; y <= maxY; y++) {
		// 	let row = "";
		// 	for(let x = minX; x <= maxX; x++) {
		// 		if(isEqual(currPos, [x, y])) {
		// 			row += "E";
		// 		} else if(blizzards.some((blizz) => isEqual(blizz.move(nextTime - 1), [x, y]))) {
		// 			let dirInd;
		// 			for(let blizz of blizzards) {
		// 				if(isEqual(blizz.move(nextTime - 1), [x, y])) {
		// 					if(!dirInd) {
		// 						dirInd = blizz.dir;
		// 					} else {
		// 						if(typeof dirInd !== "number") {
		// 							dirInd = 2;
		// 						} else {
		// 							dirInd++;
		// 						}
		// 					}
		// 				}
		// 			}
		// 			row += dirInd;
		// 		} else {
		// 			row += " ";
		// 		}
		// 	}
		// 	finalDisplay += row + "\n";
		// }
		// console.log(finalDisplay);
		let bst = new BST();
		blizzards.map((blizz) => blizz.trueMove(nextTime, bst));
		let availableMoves = [];
		let nextPos = [currPos[0] + 1, currPos[1]];
		if(rows[nextPos[1]][nextPos[0]] !== "#" && !bst.search(nextPos)) {
			availableMoves.push(nextPos);
		}
		nextPos = [currPos[0], currPos[1] + 1];
		if(rows[nextPos[1]][nextPos[0]] !== "#" && !bst.search(nextPos)) {
			availableMoves.push(nextPos);
		}
		nextPos = [currPos[0] - 1, currPos[1]];
		if(rows[nextPos[1]][nextPos[0]] !== "#" && !bst.search(nextPos)) {
			availableMoves.push(nextPos);
		}
		nextPos = [currPos[0], currPos[1] - 1];
		if(nextPos[1] > 0 && rows[nextPos[1]][nextPos[0]] !== "#" && !bst.search(nextPos)) {
			availableMoves.push(nextPos);
		}

		if(!bst.search(currPos)) {
			availableMoves.push(currPos);
		}

		if(availableMoves.length === 0) return Number.MAX_SAFE_INTEGER; // Trapped :(
		let scores = [];
		for(let nextMove of availableMoves) {
			scores.push(toTheFinish(nextMove, nextTime + 1));
		}
		return Math.min(...scores);
	}

	//let part1 = toTheFinish();
	//displayCaption(`The shortest path is ${part1}.`);
}