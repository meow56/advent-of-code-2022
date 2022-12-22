"use strict";

function day22(input) {
	const MAP_REGEX = /(?: |\.|#)+/g;
	let map = [];
	let entry;
	let row = 1;
	while(entry = MAP_REGEX.exec(input)) {
		let column = 1;
		let tiles = entry[0].split("");
		for(let tile of tiles) {
			map.push(new Tile([row, column++], tile));
		}
		row++;
	}
	const MOVE_REGEX = /(\d+)/g;
	const TURN_REGEX = /L|R/g;
	let instructions = [];
	while(entry = MOVE_REGEX.exec(input)) {
		instructions.push(+entry[0]);
		entry = TURN_REGEX.exec(input);
		if(entry !== null) {
			instructions.push(entry[0]);
		}
	}

	function Tile(pos, type) {
		this.pos = pos;
		this.type = type;
		this.isEmpty = this.type === " ";
		this.isWall = this.type === "#";

		this.rightNeighbor;
		this.downNeighbor;
		this.leftNeighbor;
		this.upNeighbor;

		this.initNeighbors = function() {
			if(this.isEmpty) return;
			let currPos = this.pos.slice();
			currPos[1]++;
			let nextTile = findTile(currPos);
			if(nextTile === undefined || nextTile.isEmpty) {
				do {
					currPos[1]--;
					nextTile = findTile(currPos);
				} while(nextTile !== undefined && !nextTile.isEmpty);
				currPos[1]++;
				nextTile = findTile(currPos);
			}
			this.rightNeighbor = nextTile;
			currPos = this.pos.slice();
			currPos[0]++;
			nextTile = findTile(currPos);
			if(nextTile === undefined || nextTile.isEmpty) {
				do {
					currPos[0]--;
					nextTile = findTile(currPos);
				} while(nextTile !== undefined && !nextTile.isEmpty);
				currPos[0]++;
				nextTile = findTile(currPos);
			}
			this.downNeighbor = nextTile;
			currPos = this.pos.slice();
			currPos[1]--;
			nextTile = findTile(currPos);
			if(nextTile === undefined || nextTile.isEmpty) {
				do {
					currPos[1]++;
					nextTile = findTile(currPos);
				} while(nextTile !== undefined && !nextTile.isEmpty);
				currPos[1]--;
				nextTile = findTile(currPos);
			}
			this.leftNeighbor = nextTile;
			currPos = this.pos.slice();
			currPos[0]--;
			nextTile = findTile(currPos);
			if(nextTile === undefined || nextTile.isEmpty) {
				do {
					currPos[0]++;
					nextTile = findTile(currPos);
				} while(nextTile !== undefined && !nextTile.isEmpty);
				currPos[0]--;
				nextTile = findTile(currPos);
			}
			this.upNeighbor = nextTile;
		}
	}

	function findTile(pos) {
		for(let tile of map) {
			if(tile.pos[0] === pos[0] && tile.pos[1] === pos[1]) return tile;
		}
	}

	for(let tile of map) {
		tile.initNeighbors();
	}

	let currPos = [1, 1];
	while(findTile(currPos).isEmpty) {
		currPos[1]++;
	}
	currPos = findTile(currPos);
	let facing = 0;

	for(let inst of instructions) {
		if(typeof inst === "number") {
			for(let i = 0; i < inst; i++) {
				let newPos;
				switch(facing) {
				case 0: // move right
					newPos = currPos.rightNeighbor;
					break;
				case 1: // move down
					newPos = currPos.downNeighbor;
					break;
				case 2: // move left
					newPos = currPos.leftNeighbor;
					break;
				case 3: // move up
					newPos = currPos.upNeighbor;
					break;
				}
				if(newPos.isWall) {
					break;
				} else {
					currPos = newPos;
				}
			}
		} else {
			if(inst === "L") {
				facing = (((facing - 1) % 4) + 4) % 4;
			} else {
				facing = (((facing + 1) % 4) + 4) % 4;
			}
		}
	}

	displayCaption(`The password is ${(currPos.pos[0] * 1000) + (currPos.pos[1] * 4) + facing}.`);
}