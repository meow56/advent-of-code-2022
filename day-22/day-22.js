"use strict";

function day22(input) {
	// 5386 too low
	const MAP_REGEX = /(?: |\.|#)+/g;
	let map = [];
	let net = [new Face(1), new Face(2), new Face(3), new Face(4), new Face(5), new Face(6)];
	let entry;
	let row = 1;
	let firstValidRow = 1;
	let currFace = 0;
	while(entry = MAP_REGEX.exec(input)) {
		let column = 1;
		let firstValidColumn = -1;
		let tiles = entry[0].split("");
		let originalFace = currFace;
		let facesInRow = [currFace];
		for(let tile of tiles) {
			map.push(new Tile([row, column], tile));
			if(tile !== " ") {
				if(firstValidColumn === -1) {
					firstValidColumn = column;
					net[currFace].leftBound = column;
					if(row % 50 === 1) net[currFace].upBound = row;
					net[currFace].addCube(new Cube([row, column], tile));
				} else if(column - firstValidColumn === 50) {
					net[currFace].rightBound = column - 1;
					currFace++;
					if(!facesInRow.includes(currFace)) facesInRow.push(currFace);
					if(row % 50 === 1) net[currFace].upBound = row;
					net[currFace].leftBound = column;
					firstValidColumn = column;
					net[currFace].addCube(new Cube([row, column], tile));
				} else {
					net[currFace].addCube(new Cube([row, column], tile));
				}
			}
			column++;
		}
		net[currFace].rightBound = column - 1;
		currFace = originalFace;
		row++;
		if(row - firstValidRow === 50) {
			for(let face of facesInRow) {
				net[face].downBound = row - 1;
			}
			currFace = Math.max(...facesInRow) + 1;
			if(currFace < net.length) {
				net[currFace].upBound = row;
				firstValidRow = row;
			}
		}
	}

	for(let face of net) {
		face.initNeighbors();
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

	function Face(id) {
		this.id = id;
		this.tiles = [];
		
		this.rightBound;
		this.downBound;
		this.leftBound;
		this.upBound;

		this.rightNeighbor;
		this.downNeighbor;
		this.leftNeighbor;
		this.upNeighbor;
		// It's hardcoding time.
		this.initNeighbors = function() {
			switch(this.id) {
			case 1:
				this.rightNeighbor = [net[1], "R"];
				this.downNeighbor = [net[2], "D"];
				this.leftNeighbor = [net[3], "R"];
				this.upNeighbor = [net[5], "R"];
				break;
			case 2:
				this.rightNeighbor = [net[4], "L"];
				this.downNeighbor = [net[2], "L"];
				this.leftNeighbor = [net[0], "L"];
				this.upNeighbor = [net[5], "U"];
				break;
			case 3:
				this.rightNeighbor = [net[1], "U"];
				this.downNeighbor = [net[4], "D"];
				this.leftNeighbor = [net[3], "D"];
				this.upNeighbor = [net[0], "U"];
				break;
			case 4:
				this.rightNeighbor = [net[4], "R"];
				this.downNeighbor = [net[5], "D"];
				this.leftNeighbor = [net[0], "R"];
				this.upNeighbor = [net[2], "R"];
				break;
			case 5:
				this.rightNeighbor = [net[1], "L"];
				this.downNeighbor = [net[5], "L"];
				this.leftNeighbor = [net[3], "L"];
				this.upNeighbor = [net[2], "U"];
				break;
			case 6:
				this.rightNeighbor = [net[4], "U"];
				this.downNeighbor = [net[1], "D"];
				this.leftNeighbor = [net[0], "D"];
				this.upNeighbor = [net[3], "U"];
				break;
			}

			for(let cube of this.tiles) {
				cube.initNeighbors();
			}
		}

		this.addCube = function(cube) {
			this.tiles.push(cube);
			cube.face = this;
			cube.onEdge = this.onBounds(cube);
		}

		this.onBounds = function(cube) {
			if(cube.pos[0] === this.leftBound || cube.pos[0] === this.rightBound) return true;
			if(cube.pos[1] === this.upBound || cube.pos[1] === this.downBound) return true;
			return false;
		}

		this.findCube = function(pos) {
			for(let cube of this.tiles) {
				if(cube.pos[0] === pos[0] && cube.pos[1] === pos[1]) return cube;
			}
		}

		this.getNewPosition = function(pos, facing) {
			let newPos;
			let neighbor;
			if(pos[1] > this.rightBound) {
				neighbor = this.rightNeighbor;
				let offsetR = pos[0] - this.upBound;
				switch(neighbor[1]) {
				case "R":
					newPos = [neighbor[0].upBound + offsetR, neighbor[0].leftBound];
					break;
				case "D":
					newPos = [neighbor[0].upBound, neighbor[0].rightBound - offsetR];
					break;
				case "L":
					newPos = [neighbor[0].downBound - offsetR, neighbor[0].rightBound];
					break;
				case "U":
					newPos = [neighbor[0].downBound, neighbor[0].leftBound + offsetR];
					break;
				}
			} else if(pos[0] > this.downBound) {
				neighbor = this.downNeighbor;
				let offsetC = pos[1] - this.leftBound;
				switch(neighbor[1]) {
				case "R":
					newPos = [neighbor[0].downBound - offsetC, neighbor[0].leftBound];
					break;
				case "D":
					newPos = [neighbor[0].upBound, neighbor[0].leftBound + offsetC];
					break;
				case "L":
					newPos = [neighbor[0].upBound + offsetC, neighbor[0].rightBound];
					break;
				case "U":
					newPos = [neighbor[0].downBound, neighbor[0].rightBound - offsetC];
					break;
				}
			} else if(pos[1] < this.leftBound) {
				neighbor = this.leftNeighbor;
				let offsetR = pos[0] - this.upBound;
				switch(neighbor[1]) {
				case "R":
					newPos = [neighbor[0].downBound - offsetR, neighbor[0].leftBound];
					break;
				case "D":
					newPos = [neighbor[0].upBound, neighbor[0].leftBound + offsetR];
					break;
				case "L":
					newPos = [neighbor[0].upBound + offsetR, neighbor[0].rightBound];
					break;
				case "U":
					newPos = [neighbor[0].downBound, neighbor[0].rightBound - offsetR];
					break;
				}
			} else if(pos[0] < this.upBound) {
				neighbor = this.upNeighbor;
				let offsetC = pos[1] - this.leftBound;
				switch(neighbor[1]) {
				case "R":
					newPos = [neighbor[0].upBound + offsetC, neighbor[0].leftBound];
					break;
				case "D":
					newPos = [neighbor[0].upBound, neighbor[0].rightBound - offsetC];
					break;
				case "L":
					newPos = [neighbor[0].downBound - offsetC, neighbor[0].rightBound];
					break;
				case "U":
					newPos = [neighbor[0].downBound, neighbor[0].leftBound + offsetC];
					break;
				}
			} else {
				return [this.findCube(pos), facing];
			}
			return [neighbor[0].findCube(newPos), neighbor[1]];
		}
	}

	function Cube(pos, type) {
		this.pos = pos;
		this.type = type;
		this.isWall = this.type === "#";

		this.face;
		this.onEdge;

		this.rightNeighbor;
		this.downNeighbor;
		this.leftNeighbor;
		this.upNeighbor;

		this.initNeighbors = function() {
			let currPos = this.pos.slice();
			currPos[1]++;
			this.rightNeighbor = this.face.getNewPosition(currPos, "R");
			currPos = this.pos.slice();
			currPos[0]++;
			this.downNeighbor = this.face.getNewPosition(currPos, "D");
			currPos = this.pos.slice();
			currPos[1]--;
			this.leftNeighbor = this.face.getNewPosition(currPos, "L");
			currPos = this.pos.slice();
			currPos[0]--;
			this.upNeighbor = this.face.getNewPosition(currPos, "U");
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
	let initCurrPos = currPos.slice();
	currPos = findTile(currPos);
	let facing = 0;

	for(let inst of instructions) {
		console.log(`Part 1: Processing ${inst}.`);
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

	currPos = initCurrPos.slice();
	facing = 0;

	for(let face of net) {
		if(face.findCube(currPos)) {
			currPos = face.findCube(currPos);
			break;
		}
	}

	let indToFacing = ["right", "down", "left", "up"];

	for(let inst of instructions) {
		console.log(`Part 2: Processing ${inst}.`);
		if(typeof inst === "number") {
			for(let i = 0; i < inst; i++) {
				let newPos;
				let newFacing;
				switch(facing) {
				case 0: // move right
					newPos = currPos.rightNeighbor[0];
					newFacing = currPos.rightNeighbor[1];
					break;
				case 1: // move down
					newPos = currPos.downNeighbor[0];
					newFacing = currPos.downNeighbor[1];
					break;
				case 2: // move left
					newPos = currPos.leftNeighbor[0];
					newFacing = currPos.leftNeighbor[1];
					break;
				case 3: // move up
					newPos = currPos.upNeighbor[0];
					newFacing = currPos.upNeighbor[1];
					break;
				}
				if(newPos.isWall) {
					break;
				} else {
					currPos = newPos;
					switch(newFacing) {
					case "R":
						facing = 0;
						break;
					case "D":
						facing = 1;
						break;
					case "L":
						facing = 2;
						break;
					case "U":
						facing = 3;
						break;
					}
				}
			}
		} else {
			if(inst === "L") {
				facing = (((facing - 1) % 4) + 4) % 4;
			} else {
				facing = (((facing + 1) % 4) + 4) % 4;
			}
		}

		console.log(`We are now at (${currPos.pos[0]}, ${currPos.pos[1]}) [which is face ${currPos.face.id}], facing ${indToFacing[facing]}.`);
	}

	displayCaption(`From a different perspective, the password is ${(currPos.pos[0] * 1000) + (currPos.pos[1] * 4) + facing}.`)
}