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
			nodes.push(new Node(entry[0], [index % ROW_LENGTH, Math.floor(index / ROW_LENGTH)]));
		} else if(entry[0] === "S") {
			startPos = [index % ROW_LENGTH, Math.floor(index / ROW_LENGTH)];
			nodes.push(new Node("a", [index % ROW_LENGTH, Math.floor(index / ROW_LENGTH)]));
		} else {
			endPos = [index % ROW_LENGTH, Math.floor(index / ROW_LENGTH)];
			nodes.push(new Node("z", [index % ROW_LENGTH, Math.floor(index / ROW_LENGTH)]));
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

	function Node(elevation, position) {
		this.height = elevation.charCodeAt(0) - "a".charCodeAt(0);
		this.pos = position;
		this.neighbors = [];
		this.depth = Number.MAX_SAFE_INTEGER;
		this.parent;
		this.color = 0; // 0: White, 1: Grey, 2: Black

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

	function search() {
		let queue = [getNode(startPos)];
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

	displayCaption(`Shortest path is length ${search()}.`);
}