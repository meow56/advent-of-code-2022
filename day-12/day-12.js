"use strict";

function day12(input) {
	const FILE_REGEX = /[a-z]|S|E/g;
	let nodes = [];
	let entry;
	entry = input.split("\n");
	const ROW_LENGTH = entry[0].length;
	const COL_LENGTH = entry.length;
	let index = 0;
	let startPos;
	let endPos;
	while(entry = FILE_REGEX.exec(input)) {
		if(entry[0] !== "S" && entry[0] !== "E") {
			nodes.push(new MyNode(entry[0], [index % ROW_LENGTH, Math.floor(index / ROW_LENGTH)]));
		} else if(entry[0] === "S") {
			startPos = [index % ROW_LENGTH, Math.floor(index / ROW_LENGTH)];
			nodes.push(new MyNode("a", [index % ROW_LENGTH, Math.floor(index / ROW_LENGTH)]));
		} else {
			endPos = [index % ROW_LENGTH, Math.floor(index / ROW_LENGTH)];
			nodes.push(new MyNode("z", [index % ROW_LENGTH, Math.floor(index / ROW_LENGTH)]));
		}
		index++;
	}

	for(let node of nodes) {
		node.initNeighbors();
	}

	function getNode(position) {
		for(let node of nodes) {
			if(node.pos[0] === position[0] && node.pos[1] === position[1]) {
				return node;
			}
		}
	}

	function MyNode(elevation, position) {
		this.height = elevation.charCodeAt(0) - "a".charCodeAt(0);
		this.pos = position;
		this.neighbors = [];
		this.depth = Number.MAX_SAFE_INTEGER;
		this.parent;
		this.color = 0; // 0: White, 1: Grey, 2: Black

		this.onPath = false;

		this.initNeighbors = function() {
			if(this.pos[0] !== ROW_LENGTH - 1) {
				let neighbor = getNode([this.pos[0] + 1, this.pos[1]]);
				if(neighbor === undefined) console.log("M");
				if(neighbor.height <= this.height + 1) {
					this.neighbors.push(neighbor);
				}
			}
			if(this.pos[0] !== 0) {
				let neighbor = getNode([this.pos[0] - 1, this.pos[1]]);
				if(neighbor === undefined) console.log("M");
				if(neighbor.height <= this.height + 1) {
					this.neighbors.push(neighbor);
				}
			}
			if(this.pos[1] !== COL_LENGTH - 1) {
				let neighbor = getNode([this.pos[0], this.pos[1] + 1]);
				if(neighbor === undefined) console.log("M");
				if(neighbor.height <= this.height + 1) {
					this.neighbors.push(neighbor);
				}
			}
			if(this.pos[1] !== 0) {
				let neighbor = getNode([this.pos[0], this.pos[1] - 1]);
				if(neighbor === undefined) console.log("M");
				if(neighbor.height <= this.height + 1) {
					this.neighbors.push(neighbor);
				}
			}
		}
	}

	getNode(startPos).depth = 0;

	function resetNodes(start) {
		for(let node of nodes) {
			node.depth = Number.MAX_SAFE_INTEGER;
			node.color = 0;
			node.parent = undefined;
			node.onPath = false;
		}
		start.depth = 0;
	}

	function search(start = getNode(startPos)) {
		resetNodes(start);
		let queue = [start];
		while(queue.length !== 0) {
			let nextNode = queue.shift();
			for(let neighbor of nextNode.neighbors) {
				if(neighbor.color === 0) {
					neighbor.color = 1;
					neighbor.depth = nextNode.depth + 1;
					neighbor.parent = nextNode;
					queue.push(neighbor);
				}
			}
			nextNode.color = 2;
		}
		return getNode(endPos).depth;
	}

	let finalDepth = search();
	let scenicCandidates = [];
	let scenicOptions = [];
	for(let node of nodes) {
		if(node.height === 0) {
			scenicCandidates.push(search(node));
			scenicOptions.push([getNode(endPos).depth, node.pos]);
		}
	}

	displayCaption(`Shortest path is length ${finalDepth}.`);
	displayCaption(`Scenic path is length ${Math.min(...scenicCandidates)}.`);
	displayCaption(`The height map is shown, with the path marked in black. The path length is also displayed.`);
	displayCaption(`Use the buttons to check different starting positions.`);
	displayCaption(`The first map shown is the original input (part 1).`);
	displayCaption(`The rest of the maps are sorted in ascending order.`);
	displayCaption(`So the second map is the shortest path.`);
	
	scenicOptions.sort((a, b) => {
		if(a[1][0] === startPos[0] && a[1][1] === startPos[1]) return -1;
		if(b[1][0] === startPos[0] && b[1][1] === startPos[1]) return 1;
		return a[0] - b[0];
	});


	function buttonClosure() {
		const pathBlock = assignBlock("paths");
		const closureScenicOptions = scenicOptions.slice();
		let index = 0;
		const LAST_INDEX = closureScenicOptions.length - 1;
		function displayFromStart(start = startPos) {
			pathBlock.clearText();
			let pathLength = search(getNode(start));
			if(pathLength === Number.MAX_SAFE_INTEGER) {
				pathBlock.displayText(`Help, I've fallen and I can't get up! (No path)`);
			} else {
				pathBlock.displayText(`Path length: ${pathLength}`);
			}
			pathBlock.displayText();
			let onPath = getNode(endPos).parent;
			if(pathLength !== Number.MAX_SAFE_INTEGER) {
				while(onPath.parent !== undefined) {
					onPath.onPath = true;
					onPath = onPath.parent;
				}
			}
			for(let i = 0; i < COL_LENGTH; i++) {
				let nextText = "";
				for(let j = 0; j < ROW_LENGTH; j++) {
					if(getNode([j, i]).onPath) {
						nextText += "█";
					} else if(i === start[1] && j === start[0]) {
						nextText += "S";
					} else if(i === endPos[1] && j === endPos[0]) {
						nextText += "E";
					} else {
						nextText += String.fromCharCode(getNode([j, i]).height + "a".charCodeAt(0));
					}
				}
				pathBlock.displayText(nextText);
			}
		}
		displayFromStart();

		function prev() {
			if(index !== 0) {
				index--;
				displayFromStart(closureScenicOptions[index][1]);
			}
		}

		function nex() {
			if(index !== LAST_INDEX) {
				index++;
				displayFromStart(closureScenicOptions[index][1]);
			}
		}

		function res() {
			index = 0;
			displayFromStart(closureScenicOptions[index][1]);
		}
		return [prev, nex, res];
	}
	let [prev, nex, res] = buttonClosure();
	let button1 = assignButton(prev, "Previous");
	let button2 = assignButton(res, "Return to Start");
	let button3 = assignButton(nex, "Next");


}