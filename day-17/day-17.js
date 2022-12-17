"use strict";

function day17(input) {
	let inputs = input.split("");

	let inIndex = 0;

	function Piece(type, highFloor) {
		this.type = type;
		this.shape;
		this.leftCheck;
		this.rightCheck;
		this.downCheck;
		// The bottom left corner is 0, 0. y increases going up, x to the right.
		switch(this.type) {
		case "_":
			this.shape = [[0, 0], [1, 0], [2, 0], [3, 0]];
			this.leftCheck = [[-1, 0]];
			this.rightCheck = [[4, 0]];
			this.downCheck = [[0, -1], [1, -1], [2, -1], [3, -1]];
			break;
		case "X":
			this.shape = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
			this.leftCheck = [[-1, 1], [0, 0]];
			this.rightCheck = [[3, 1], [2, 0]];
			this.downCheck = [[0, 0], [1, -1], [2, 0]];
			break;
		case "J":
			this.shape = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]];
			this.leftCheck = [[-1, 0]];
			this.rightCheck = [[3, 0], [3, 1], [3, 2]];
			this.downCheck = [[0, -1], [1, -1], [2, -1]];
			break;
		case "I":
			this.shape = [[0, 0], [0, 1], [0, 2], [0, 3]];
			this.leftCheck = [[-1, 0], [-1, 1], [-1, 2], [-1, 3]];
			this.rightCheck = [[1, 0], [1, 1], [1, 2], [1, 3]];
			this.downCheck = [[0, -1]];
			break;
		case "O":
			this.shape = [[0, 0], [1, 0], [0, 1], [1, 1]];
			this.leftCheck = [[-1, 0], [-1, 1]];
			this.rightCheck = [[2, 0], [2, 1]];
			this.downCheck = [[0, -1], [1, -1]];
			break;
		}

		this.pos = [2, 4 + highFloor];

		this.moveFall = function(board) {
			if(this.pos[1] === 4 + highFloor) {
				let leftMargin = this.pos[0];
				let rightMargin;
				switch(this.type) {
				case "I":
					rightMargin = 4;
					break;
				case "X":
					rightMargin = 2;
					break;
				case "J":
					rightMargin = 2;
					break;
				case "_":
					rightMargin = 1;
					break;
				case "O":
					rightMargin = 3;
					break;
				}
				for(let i = 4; i > 1; i--) {
					let nextVal = inputs[inIndex % inputs.length];
					inIndex++;
					if(nextVal === "<") {
						if(leftMargin > 0) {
							this.pos[0]--;
							leftMargin--;
							rightMargin++;
						}
					} else {
						if(rightMargin > 0) {
							this.pos[0]++;
							leftMargin++;
							rightMargin--;
						}
					}
				}
				this.pos[1] = 1 + highFloor;
				return;
			}
			let nextVal = inputs[inIndex % inputs.length];
			inIndex++;
			let newPos = this.pos.slice();
			newPos[0] += nextVal === "<" ? -1 : 1;
			let toCheck = nextVal === "<" ? this.leftCheck : this.rightCheck;
			let isValid = true;
			for(let point of toCheck) {
				let pointPos = this.pos.slice();
				pointPos[0] += point[0];
				pointPos[1] += point[1];
				if(board.isFilled(pointPos)) {
					isValid = false;
				}
			}
			if(isValid) {
				this.pos = newPos;
			}

			newPos = this.pos.slice();
			newPos[1]--;
			toCheck = this.downCheck;
			isValid = true;
			for(let point of toCheck) {
				let pointPos = this.pos.slice();
				pointPos[0] += point[0];
				pointPos[1] += point[1];
				if(board.isFilled(pointPos)) {
					isValid = false;
				}
			}
			if(!isValid) {
				board.lock(this);
			} else {
				this.pos = newPos;
			}
		}
	}

	let prevInIndex = [];
	function Board(part2) {
		this.part2 = part2;
		this.width = 7;
		this.trueHighFloor = 0;
		this.highFloor = 0;
		this.upperFloor = [true, true, true, true, true, true, true];
		this.filledPoints = new Map();
		this.currPiece;
		this.bag = ["_", "X", "J", "I", "O"];
		this.pieceCount = 0;
		this.locked = false;

		this.isFilled = function(point) {
			if(point[0] < 0 || point[0] > 6 || point[1] <= 0) return true;
			return this.filledPoints.has(point.join());
		}

		this.clearLines = function() {
			let highestPerColumn = [];
			for(let x = 0; x < 7; x++) {
				let highY = this.highFloor;
				while(!this.isFilled([x, highY])) {
					highY--;
				}
				highestPerColumn[x] = highY;
			}

			let lowHighY = Math.min(...highestPerColumn);
			for(let y = lowHighY - 1; y >= 0; y--) {
				for(let x = 0; x < 7; x++) {
					this.filledPoints.delete(`${x},${y}`);
				}
			}
			for(let y = lowHighY; y <= this.highFloor; y++) {
				for(let x = 0; x < 7; x++) {
					if(this.filledPoints.has(`${x},${y}`)) {
						this.filledPoints.set(`${x},${y - lowHighY}`, this.filledPoints.get(`${x},${y}`));
						this.filledPoints.delete(`${x},${y}`);
					}
				}
			}
			this.highFloor = this.highFloor - lowHighY;
		}

		this.lock = function(piece) {
			let newHighFloor = this.highFloor;
			for(let point of piece.shape) {
				let pointPos = piece.pos.slice();
				pointPos[0] += point[0];
				pointPos[1] += point[1];
				if(pointPos[1] > newHighFloor) newHighFloor = pointPos[1];
				if(this.filledPoints.has(pointPos.join())) throw `Duplicate position ${pointPos}`;
				this.filledPoints.set(pointPos.join(), true);
			}
			this.trueHighFloor += newHighFloor - this.highFloor;
			this.highFloor = newHighFloor;
			this.locked = true;
		}

		this.generate = function() {
			this.currPiece = new Piece(this.bag[this.pieceCount++ % 5], this.highFloor);
			if(this.pieceCount === (this.part2 ? 1000000000001 : 2023)) {
				return this.trueHighFloor;
			}
			return false;
		}

		this.run = function() {
			inIndex = 0;
			prevInIndex = new Map();
			let prevMatch;
			let output;
			do {
				if(this.pieceCount % 500 === 0) this.clearLines();
				if(this.pieceCount % 1e6 === 1) console.log(`Piece average ${inIndex / this.pieceCount}`);
				output = this.generate();
				if(prevInIndex.has(inIndex % inputs.length)) {
					if(prevInIndex.get(inIndex % inputs.length)[1] % 1705 === 212) {
						console.log(this.pieceCount);
						console.log(this.trueHighFloor - prevInIndex.get(inIndex % inputs.length)[2]);
						console.log("Match found.");
						// Cycle identified.
						// First piece: 212. First repetition: 1917.
						// So cycle length: 1705.
						// Thus we do 586510263 cycles.
						// Leaving 1374 pieces afterward, since it hasn't locked yet.
						// Every cycle adds 2597 to the height.
						// First piece leaves the stack at height 307.
						// The 1536th piece is at height 2393, so increases by 2086.
						// So putting it all together, (2597 * 586510263) + 2086 + 307 = 1523167155404
					}
				}
				prevInIndex.set(inIndex % inputs.length, [this.currPiece.type, this.pieceCount, this.trueHighFloor]);
				this.locked = false;
				while(!this.locked) {
					this.currPiece.moveFall(this);
				}
				//this.display();
			} while (typeof output !== "number");
			return output;
		}

		this.display = function() {
			let finalBoard = "";
			for(let y = this.highFloor + 1; y >= 0; y--) {
				let row = "";
				if(y === 0) {
					row = "+-------+";
				} else {
					row += "|";
					for(let x = 0; x < 7; x++) {
						if(this.isFilled([x, y])) {
							row += "█";
						} else {
							row += " ";
						}
					}
					row += "|";
				}
				finalBoard += row + "\n";
			}
			console.log(finalBoard);
		}
	}

	let board = new Board(false);
	let out = board.run();
	let board2 = new Board(true);
	let out2 = board2.run();
	displayCaption(`The highest floor is ${out}.`);
	displayCaption(`The tower is now ${out2} tall.`);
}