"use strict";

function day17(input) {
	//input = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;
	let inputs = input.split("");

	let inIndex = 0;

	function Piece(type) {
		this.type = type;
		this.shape;
		// The bottom left corner is 0, 0. y increases going up, x to the right.
		switch(this.type) {
		case "I":
			this.shape = [[0, 0], [0, 1], [0, 2], [0, 3]];
			break;
		case "X":
			this.shape = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
			break;
		case "J":
			this.shape = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]];
			break;
		case "_":
			this.shape = [[0, 0], [1, 0], [2, 0], [3, 0]];
			break;
		case "O":
			this.shape = [[0, 0], [1, 0], [0, 1], [1, 1]];
			break;
		}

		this.pos = [2, 4];

		this.moveFall = function(board) {
			let nextVal = inputs[inIndex];
			inIndex = (inIndex + 1) % inputs.length;
			let newPos = this.pos.slice();
			newPos[0] += nextVal === "<" ? -1 : 1;
			let isValid = true;
			for(let point of this.shape) {
				let pointPos = newPos.slice();
				pointPos[0] += point[0];
				pointPos[1] += point[1] + board.highFloor;
				if(board.isFilled(pointPos)) {
					isValid = false;
				}
			}
			if(isValid) {
				this.pos = newPos;
			}

			newPos = this.pos.slice();
			newPos[1]--;
			isValid = true;
			for(let point of this.shape) {
				let pointPos = newPos.slice();
				pointPos[0] += point[0];
				pointPos[1] += point[1] + board.highFloor;
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

	function Board() {
		this.width = 7;
		this.highFloor = 0;
		this.filledPoints = new Map();
		this.currPiece;
		this.bag = ["_", "X", "J", "I", "O"];
		this.pieceCount = 0;
		this.locked = false;

		this.isFilled = function(point) {
			if(point[0] < 0 || point[0] > 6 || point[1] <= 0) return true;
			return this.filledPoints.has(point.join());
		}

		this.lock = function(piece) {
			let newHighFloor = this.highFloor;
			for(let point of piece.shape) {
				let pointPos = piece.pos.slice();
				pointPos[0] += point[0];
				pointPos[1] += point[1] + this.highFloor;
				if(pointPos[1] > newHighFloor) newHighFloor = pointPos[1];
				if(this.filledPoints.has(pointPos.join())) throw `Duplicate position ${pointPos}`;
				this.filledPoints.set(pointPos.join(), true);
			}
			this.highFloor = newHighFloor;
			this.locked = true;
		}

		this.generate = function() {
			this.currPiece = new Piece(this.bag[this.pieceCount++ % 5]);
			if(this.pieceCount === 2023) {
				return this.highFloor;
			}
			return false;
		}

		this.run = function() {
			let output;
			do {
				output = this.generate();
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

	let board = new Board();
	let out = board.run();
	displayCaption(`The highest floor is ${out}.`);
}