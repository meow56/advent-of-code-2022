"use strict";

function day15(input) {
// 	input = `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
// Sensor at x=9, y=16: closest beacon is at x=10, y=16
// Sensor at x=13, y=2: closest beacon is at x=15, y=3
// Sensor at x=12, y=14: closest beacon is at x=10, y=16
// Sensor at x=10, y=20: closest beacon is at x=10, y=16
// Sensor at x=14, y=17: closest beacon is at x=10, y=16
// Sensor at x=8, y=7: closest beacon is at x=2, y=10
// Sensor at x=2, y=0: closest beacon is at x=2, y=10
// Sensor at x=0, y=11: closest beacon is at x=2, y=10
// Sensor at x=20, y=14: closest beacon is at x=25, y=17
// Sensor at x=17, y=20: closest beacon is at x=21, y=22
// Sensor at x=16, y=7: closest beacon is at x=15, y=3
// Sensor at x=14, y=3: closest beacon is at x=15, y=3
// Sensor at x=20, y=1: closest beacon is at x=15, y=3`;
	const FILE_REGEX = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/g;
	let sensors = [];
	let entry;
	let beacons = new Set();
	let minX = Number.MAX_SAFE_INTEGER;
	let maxX = Number.MIN_SAFE_INTEGER;
	while(entry = FILE_REGEX.exec(input)) {
		beacons.add(entry[3] + "," + entry[4]);
		sensors.push(new Sensor([+entry[1], +entry[2]], [+entry[3], +entry[4]]));
		if(+entry[1] - sensors[sensors.length - 1].closeDistance < minX) {
			minX = +entry[1] - sensors[sensors.length - 1].closeDistance;
		}
		if(+entry[1] + sensors[sensors.length - 1].closeDistance > maxX) {
			maxX = +entry[1] + sensors[sensors.length - 1].closeDistance;
		}
	}

	function manhattan(pos1, pos2) {
		return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
	}

	function Sensor(position, close) {
		this.pos = position;
		this.closeBeacon = close;
		this.closeDistance = manhattan(this.pos, this.closeBeacon);

		this.testBeaconFails = function(potLocation) {
			// Returns true if the beacon is inside the range.
			return manhattan(this.pos, potLocation) <= this.closeDistance;
		}
	}

	const TRIAL_LINE = 2000000;
	let impossibleCount = 0;
	for(let x = minX; x <= maxX; x++) {
		if(sensors.some(sensor => sensor.testBeaconFails([x, TRIAL_LINE]))) {
			if(!beacons.has(`${x},${TRIAL_LINE}`)) {
				impossibleCount++;	
			}
		}
	}

	displayCaption(`There are ${impossibleCount} places that cannot contain a beacon on line y=${TRIAL_LINE}.`);
}