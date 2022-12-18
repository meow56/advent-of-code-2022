"use strict";

function day18(input) {
	const FILE_REGEX = /(\d+),(\d+),(\d+)/g;
	let cubes = [];
	let cubeSet = new Set();
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		cubes.push(new Cube([+entry[1], +entry[2], +entry[3]]));
		cubeSet.add(entry[0]);
	}

	function isFilled(pos) {
		return cubeSet.has(pos.join());
	}

	function Cube(pos) {
		this.pos = pos;

		this.calcSurfaceArea = function() {
			let exposedSides = 0;
			let testPos = this.pos.slice();
			testPos[0]--;
			if(!isFilled(testPos)) exposedSides++;
			testPos[0] += 2;
			if(!isFilled(testPos)) exposedSides++;
			testPos[0]--;
			testPos[1]--;
			if(!isFilled(testPos)) exposedSides++;
			testPos[1] += 2;
			if(!isFilled(testPos)) exposedSides++;
			testPos[1]--;
			testPos[2]--;
			if(!isFilled(testPos)) exposedSides++;
			testPos[2] += 2;
			if(!isFilled(testPos)) exposedSides++;
			testPos[2]--;
			return exposedSides;
		}
	}

	let totalSurfaceArea = 0;
	for(let cube of cubes) {
		totalSurfaceArea += cube.calcSurfaceArea();
	}
	displayCaption(`The total surface area is ${totalSurfaceArea}.`);
}