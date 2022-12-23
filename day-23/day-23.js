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

		this.finished;

		this.isElfHere = function(pos) {
			return this.elves.some(elf => elf.pos[0] === pos[0] && elf.pos[1] === pos[1]);
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
						row += "#";
					} else {
						row += ".";
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

	console.log(trueGrid.display());

	let roundNum = 1;
	while(!trueGrid.round(roundNum)) {
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
}