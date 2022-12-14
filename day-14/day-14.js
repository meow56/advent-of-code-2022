"use strict";

function day14(input) {
	let lines = input.split("\n");
	let trueLines = [];
	for(let line of lines) {
		let coords = line.split(" -> ");
		let finalCoords = [];
		for(let point of coords) {
			finalCoords.push(point.split(",").map(val => +val));
		}
		trueLines.push(finalCoords);
	}

	let filledPoints = new Set();
	let lowestY = 0;
	for(let line of trueLines) {
		for(let i = 1; i < line.length; i++) {
			let prevPoint = line[i - 1];
			let thisPoint = line[i];
			if(prevPoint[1] > lowestY) lowestY = prevPoint[1];
			if(prevPoint[0] !== thisPoint[0]) {
				// x's aren't the same.
				let minPoint = prevPoint[0] < thisPoint[0] ? prevPoint : thisPoint;
				let maxPoint = prevPoint[0] < thisPoint[0] ? thisPoint : prevPoint;
				for(let j = minPoint[0]; j <= maxPoint[0]; j++) {
					filledPoints.add(`${j},${prevPoint[1]}`);
				}
			} else {
				// y's aren't the same.
				let minPoint = prevPoint[1] < thisPoint[1] ? prevPoint : thisPoint;
				let maxPoint = prevPoint[1] < thisPoint[1] ? thisPoint : prevPoint;
				for(let j = minPoint[1]; j <= maxPoint[1]; j++) {
					filledPoints.add(`${prevPoint[0]},${j}`);
				}
			}
		}
	}

	let filledCopy = new Set();
	for(let entry of filledPoints) {
		filledCopy.add(entry);
	}
	let filledCopyCopy = new Set();
	for(let entry of filledPoints) {
		filledCopyCopy.add(entry);
	}

	const SAND_ENTRY = [500, 0];
	let sandCount = 0;
	function fall(pointsSet, part2 = false) {
		let didFall = false;
		let currPosition = SAND_ENTRY.slice();
		do {
			didFall = false;
			let testPos = currPosition.slice();
			testPos[1]++;
			if(!part2 && testPos[1] > lowestY) {
				// into the void.
				return true;
			}
			if(part2 && testPos[1] === lowestY + 2) {
				// hit the floor.
				break;
			}
			if(!pointsSet.has(testPos.join())) {
				currPosition[1]++;
				didFall = true;
				continue;
			}
			testPos[0]--;
			if(!pointsSet.has(testPos.join())) {
				currPosition[1]++;
				currPosition[0]--;
				didFall = true;
				continue;
			}
			testPos[0] += 2;
			if(!pointsSet.has(testPos.join())) {
				currPosition[1]++;
				currPosition[0]++;
				didFall = true;
				continue;
			}
		} while(didFall)
		sandCount++;
		pointsSet.add(currPosition.join());
		if(currPosition[0] === 500 && currPosition[1] === 0) return true;
	}

	while(!fall(filledPoints)) {
	}

	displayCaption(`In total, ${sandCount} sand settled before falling into the abyss.`);
	sandCount = 0;
	while(!fall(filledCopy, true)) {
	}
	displayCaption(`Now that conservation of mass isn't being violated, ${sandCount} sand settled.`);

	let minX = Number.MAX_SAFE_INTEGER;
	let minY = 0; // This is known.
	let maxX = Number.MIN_SAFE_INTEGER;
	let maxY = lowestY + 1; // This is also known.
	for(let point of filledPoints) {
		let pointX = +(point.split(",")[0]);
		minX = Math.min(minX, pointX);
		maxX = Math.max(maxX, pointX);
	}

	let part1Board = [];
	for(let y = minY; y <= maxY; y++) {
		let displayLine = "";
		for(let x = minX; x <= maxX; x++) {
			if(filledCopyCopy.has(`${x},${y}`)) {
				displayLine += "█";
			} else if(filledPoints.has(`${x},${y}`)) {
				displayLine += "░";
			} else {
				displayLine += " ";
			}
		}
		part1Board.push(displayLine);
	}

	minX = Number.MAX_SAFE_INTEGER;
	maxX = Number.MIN_SAFE_INTEGER;
	for(let point of filledCopy) {
		let pointX = +(point.split(",")[0]);
		minX = Math.min(minX, pointX);
		maxX = Math.max(maxX, pointX);
	}

	let part2Board = [];
	for(let y = minY; y <= maxY; y++) {
		let displayLine = "";
		for(let x = minX; x <= maxX; x++) {
			if(filledCopyCopy.has(`${x},${y}`)) {
				displayLine += "█";
			} else if(filledCopy.has(`${x},${y}`)) {
				displayLine += "░";
			} else {
				displayLine += " ";
			}
		}
		part2Board.push(displayLine);
	}
	part2Board.push("█".repeat(maxX - minX + 1));

	function p12ButtonClosure() {
		let isPart1 = false;

		function switchParts() {
			isPart1 = !isPart1;
			clearText();
			if(isPart1) {
				for(let line of part1Board) {
					displayText(line);
				}
			} else {
				for(let line of part2Board) {
					displayText(line);
				}
			}
		}

		return switchParts;
	}

	let func1 = p12ButtonClosure();
	let button1 = assignButton(func1, "Switch Part");
	func1();
}