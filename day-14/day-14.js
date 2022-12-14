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

	const SAND_ENTRY = [500, 0];
	let sandCount = 0;
	function fall() {
		let didFall = false;
		let currPosition = SAND_ENTRY.slice();
		do {
			didFall = false;
			let testPos = currPosition.slice();
			testPos[1]++;
			if(testPos[1] > lowestY) {
				// into the void.
				return true;
			}
			if(!filledPoints.has(testPos.join())) {
				currPosition[1]++;
				didFall = true;
				continue;
			}
			testPos[0]--;
			if(!filledPoints.has(testPos.join())) {
				currPosition[1]++;
				currPosition[0]--;
				didFall = true;
				continue;
			}
			testPos[0] += 2;
			if(!filledPoints.has(testPos.join())) {
				currPosition[1]++;
				currPosition[0]++;
				didFall = true;
				continue;
			}
		} while(didFall)
		sandCount++;
		filledPoints.add(currPosition.join());
	}

	while(!fall()) {
		console.log(`The clock is ticking. Sand ${sandCount}.`);
	}

	displayCaption(`In total, ${sandCount} sand settled before falling into the abyss.`)

}