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

		this.isElfHere = function(pos) {
			return this.elves.some((val) => val.pos[0] === pos[0] && val.pos[1] === pos[1]);
		}

		this.round = function(roundNum) {
			console.log(`Beginning round ${roundNum}.`);
			this.proposed.clear();
			this.invalid.clear();
			for(let elf of this.elves) {
				elf.proposeMove();
			}

			console.log(`Proposals finished.`)

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
		}

		this.display = function() {
			let minX, minY, maxX, maxY;
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
				let newPos;
				if(moveDirInd === this.grid.moveOrder.length) break;
				for(let dirs of this.grid.moveOrder[moveDirInd]) {
					newPos = this.pos.slice();
					newPos[0] += dirs[0];
					newPos[1] += dirs[1];
					if(this.grid.isElfHere(newPos)) isValidMove = false;	
				}
			} while(!isValidMove);
			if(moveDirInd >= this.grid.moveOrder.length) return; // No moving allowed.
			let finalMove = this.pos.slice();
			let trueVector = this.grid.moveOrder[moveDirInd][1];
			finalMove[0] += trueVector[0];
			finalMove[1] += trueVector[1];
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

	for(let i = 1; i <= 10; i++) {
		trueGrid.round(i);
	}
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