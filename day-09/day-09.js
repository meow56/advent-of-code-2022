"use strict";

function day9(input) {
	const FILE_REGEX = /[URLD] \d+/g;
	let instructions = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		entry = entry[0].split(" ");
		instructions.push([entry[0], +entry[1]]);
	}

	function Knot(head) {
		this.pos = [0, 0];
		this.visited = new Set(["0,0"]);
		this.head = head;
		this.tail;

		this.calcManDist = function() {
			return Math.abs(this.head.pos[0] - this.pos[0]) + Math.abs(this.head.pos[1] - this.pos[1]);
		}

		this.isFarAway = function() {
			let manDist = this.calcManDist();
			if(manDist >= 3) return true;
			return manDist === 2 && (this.head.pos[0] === this.pos[0] || this.head.pos[1] === this.pos[1]);
		}

		this.move = function(instruction) {
			if(!this.head) {
				let toChange, direction;
				switch(instruction[0]) {
				case "U":
					toChange = 1;
					direction = 1;
					break;
				case "D":
					toChange = 1;
					direction = -1;
					break;
				case "L":
					toChange = 0;
					direction = -1;
					break;
				case "R":
					toChange = 0;
					direction = 1;
					break;
				}
				for(let i = 0; i < instruction[1]; i++) {
					this.pos[toChange] += direction;
					this.tail.move();
				}
			} else {
				if(this.isFarAway()) {
					this.pos[0] += Math.sign(this.head.pos[0] - this.pos[0]);
					this.pos[1] += Math.sign(this.head.pos[1] - this.pos[1]);
					this.visited.add(this.pos.toString());
					if(this.tail) {
						this.tail.move();
					}
				}
			}
		}
	}

	let head = new Knot();
	let tails = [];
	for(let i = 0; i < 9; i++) {
		tails.push(new Knot(i === 0 ? head : tails[i - 1]));
	}
	for(let i = 0; i < tails.length - 1; i++) {
		tails[i].tail = tails[i + 1];
	}
	head.tail = tails[0];
	for(let i = 0; i < instructions.length; i++) {
		head.move(instructions[i]);
	}

	displayCaption(`Visited ${tails[0].visited.size} coords with the first tail.`);
	displayCaption(`Visited ${tails[tails.length - 1].visited.size} coords with the last tail.`);
}