"use strict";

function day18(input) {
	const FILE_REGEX = /(\d+),(\d+),(\d+)/g;
	let cubes = [];
	let cubeSet = new Set();
	let cubeSet0 = new Set();
	let entry;
	let minX = Number.MAX_SAFE_INTEGER;
	let maxX = Number.MIN_SAFE_INTEGER;
	let minY = Number.MAX_SAFE_INTEGER;
	let maxY = Number.MIN_SAFE_INTEGER;
	let minZ = Number.MAX_SAFE_INTEGER;
	let maxZ = Number.MIN_SAFE_INTEGER;
	while(entry = FILE_REGEX.exec(input)) {
		if(+entry[1] < minX) minX = +entry[1];
		if(+entry[1] > maxX) maxX = +entry[1];
		if(+entry[2] < minY) minY = +entry[2];
		if(+entry[2] > maxY) maxY = +entry[2];
		if(+entry[3] < minZ) minZ = +entry[3];
		if(+entry[3] > maxZ) maxZ = +entry[3];
		cubes.push(new Cube([+entry[1], +entry[2], +entry[3]]));
		cubeSet.add(entry[0]);
		cubeSet0.add(entry[0]);
	}

	function EmptyCube(pos) {
		this.pos = pos;
		this.depth = Number.MAX_SAFE_INTEGER;
		this.visited = false;
		this.neighbors = [];

		this.initNeighbors = function() {
			let neighPos = this.pos.slice();
			neighPos[0]--;
			let neighbor = find(neighPos);
			if(neighbor !== undefined) this.neighbors.push(neighbor);
			neighPos[0] += 2;
			neighbor = find(neighPos);
			if(neighbor !== undefined) this.neighbors.push(neighbor);
			neighPos[0]--;
			neighPos[1]--;
			neighbor = find(neighPos);
			if(neighbor !== undefined) this.neighbors.push(neighbor);
			neighPos[1] += 2;
			neighbor = find(neighPos);
			if(neighbor !== undefined) this.neighbors.push(neighbor);
			neighPos[1]--;
			neighPos[2]--;
			neighbor = find(neighPos);
			if(neighbor !== undefined) this.neighbors.push(neighbor);
			neighPos[2] += 2;
			neighbor = find(neighPos);
			if(neighbor !== undefined) this.neighbors.push(neighbor);
			neighPos[2]--;
		}

	}

	function find(pos) {
		for(let emCube of emptyCubes) {
			if(emCube.pos[0] === pos[0] &&
			   emCube.pos[1] === pos[1] &&
			   emCube.pos[2] === pos[2]) return emCube;
		}
	}

	let emptyCubes = [];
	for(let x = minX; x <= maxX; x++) {
		for(let y = minY; y <= maxY; y++) {
			for(let z = minZ; z <= maxZ; z++) {
				if(!isFilled([x, y, z])) {
					emptyCubes.push(new EmptyCube([x, y, z]));
				}
			}
		}
	}
	let regions = [];
	for(let empty of emptyCubes) {
		empty.initNeighbors();
	}

	for(let empty of emptyCubes) {
		if(!regions.some(elem => elem.includes(empty.pos.join()))) {
			let nextRegion = BFS(empty);
			regions.push(nextRegion);
		}
	}

	// Since the end bounds are -1/+1, the outside should be connected.
	regions = regions.filter(elem => !elem.includes(`${minX},${minY},${minZ}`));
	for(let region of regions) {
		for(let block of region) {
			cubeSet.add(block);
		}
	}

	function BFS(start) {
		let connected = [start.pos.join()];
		let queue = [start];
		while(queue.length !== 0) {
			let next = queue.shift();
			if(next.pos[0] < minX - 1 || next.pos[0] > maxX + 1 || 
			   next.pos[1] < minY - 1 || next.pos[1] > maxY + 1 || 
			   next.pos[2] < minZ - 1 || next.pos[2] > maxZ + 1) continue;
			for(let path of next.neighbors) {
				if(!path.visited) {
					path.visited = true;
					queue.push(path);
					connected.push(path.pos.join());
				}
			}
		}
		return connected;
	}

	function isFilled(pos, whichSet = cubeSet) {
		return whichSet.has(pos.join());
	}

	function Cube(pos) {
		this.pos = pos;

		this.calcSurfaceArea = function(part2) {
			let exposedSides = 0;
			let theSet = part2 ? cubeSet : cubeSet0;
			let testPos = this.pos.slice();
			testPos[0]--;
			if(!isFilled(testPos, theSet)) exposedSides++;
			testPos[0] += 2;
			if(!isFilled(testPos, theSet)) exposedSides++;
			testPos[0]--;
			testPos[1]--;
			if(!isFilled(testPos, theSet)) exposedSides++;
			testPos[1] += 2;
			if(!isFilled(testPos, theSet)) exposedSides++;
			testPos[1]--;
			testPos[2]--;
			if(!isFilled(testPos, theSet)) exposedSides++;
			testPos[2] += 2;
			if(!isFilled(testPos, theSet)) exposedSides++;
			testPos[2]--;
			return exposedSides;
		}
	}

	let totalSurfaceArea = 0;
	for(let cube of cubes) {
		totalSurfaceArea += cube.calcSurfaceArea(false);
	}
	let exposedSurfaceArea = 0;
	for(let cube of cubes) {
		exposedSurfaceArea += cube.calcSurfaceArea(true);
	}
	displayCaption(`The total surface area is ${totalSurfaceArea}.`);
	displayCaption(`The exposed surface area is ${exposedSurfaceArea}.`);
}