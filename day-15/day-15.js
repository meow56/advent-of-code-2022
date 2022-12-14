"use strict";

function day15(input) {
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
		this.boundingBox = [[this.pos[0] - this.closeDistance, this.pos[1] - this.closeDistance], 
							[this.pos[0] + this.closeDistance, this.pos[1] + this.closeDistance]];

		this.testBeaconFails = function(potLocation) {
			// Returns true if the beacon is inside the range.
			return manhattan(this.pos, potLocation) <= this.closeDistance;
		}

		this.couldBeDisBeacon = function(disBeaPos) {
			// Suppose the previous disBeaPos was not the distress beacon.
			// Now, what about the new disBeaPos?
			if(disBeaPos[0] < this.boundingBox[0][0] ||
			   disBeaPos[0] > this.boundingBox[1][0] ||
			   disBeaPos[1] < this.boundingBox[0][1] ||
			   disBeaPos[1] > this.boundingBox[1][1]) {
			   	// Out of the bounding box, so it's definitely not restricted
			   	// by this one.
				return true;
			} else {
				return !this.testBeaconFails(disBeaPos);
			}
		}

		this.intersection = function(...otherSensors) {
			let candidates = new Set();
			let othSensor = otherSensors[0];
			let dirX = Math.sign(othSensor.pos[0] - this.pos[0]);
			let dirY = Math.sign(othSensor.pos[1] - this.pos[1]);
			let offset = this.closeDistance + 1;
			if(manhattan(this.pos, othSensor.pos) === this.closeDistance + othSensor.closeDistance + 2) {
				if(dirX === 0) {
					// There is exactly one point of intersection, the top/bottom vertex.
					candidates.add(`${this.pos[0]},${this.pos[1] + offset}`);
					candidates.add(`${this.pos[0]},${this.pos[1] - offset}`);
				} else if(dirY === 0) {
					// Same as above, but left/right
					candidates.add(`${this.pos[0] + offset},${this.pos[1]}`);
					candidates.add(`${this.pos[0] - offset},${this.pos[1]}`);
				} else {
					// Their edges line up.
					/** EX
					 *    #   ~
					 *   # # ~ ~
					 *  #   # o ~
					 * #  o  # ~
					 *  #   # ~
					 *   # #
					 *    #
					 */

					// x increases to the right
					// y increases down
					// TR: y - (C_y - r) = (x - C_x)  x = [C_x, C_x + r]
					// TL: y - (C_y - r) = -(x - C_x) x = [C_x - r, C_x]
					// BR: y - (C_y + r) = -(x - C_x) x = [C_x, C_x + r]
					// BL: y - (C_y + r) = (x - C_x)  x = [C_x - r, C_x]
					// so line of intersection: 
					// take the equation in the direction towards the other...
					// and the smallest range of x...
					// TR: y - (C_y - r) = (x - C_x)  x = [max(C_x, C_x2 - r2), min(C_x + r, C_x2)]
					// BR: y - (C_y + r) = -(x - C_x) x = [max(C_x, C_x2 - r2), min(C_x + r, C_x2)]
					let left = this.pos[0] < othSensor.pos[0] ? this : othSensor;
					let right = this.pos[0] > othSensor.pos[0] ? this : othSensor;
					let r = left.closeDistance + 1;
					let C_y = left.pos[1];
					let C_x = left.pos[0];
					let C_x2 = right.pos[0];
					let r2 = right.closeDistance + 1;
					for(let x = Math.max(C_x, C_x2 - r2); x <= Math.min(C_x + r, C_x2); x++) {
						candidates.add(`${x},${-dirY * (x - C_x) + C_y + dirY * r}`);
					}
				}
			} else {
				/** EX 2
				 *       ~
				 *    # ~ ~
				 *   # #   ~
				 *  # ~ #o  ~
				 * #  o~ # ~
				 *  #   # ~
				 *   # # ~
				 *    #
				 */
				// This one's less nice
				// TR can intersect with TR, TL, BR
				// BR can intersect with BL, BR, TR
				// TR: y - (C_y - r) = (x - C_x)  x = [C_x, C_x + r]
				// TL: y - (C_y - r) = -(x - C_x) x = [C_x - r, C_x]
				// BR: y - (C_y + r) = -(x - C_x) x = [C_x, C_x + r]
				// BL: y - (C_y + r) = (x - C_x)  x = [C_x - r, C_x]
				// TRTR: y - (C_y - r) = (x - C_x)     x = [C_x, C_x + r]
				//       y - (C_y2 - r2) = (x - C_x2)  x = [C_x2, C_x + r2]
				//       x - C_x + C_y - r - (C_y2 - r2) = x - C_x2
				//    so C_x2 - C_x + C_y - r - C_y2 + r2 = 0
				//    or C_x2 - C_y2 + r2 = C_x - C_y + r. intersection at intersection of domain
				// TRTL: y - (C_y - r) = x - C_x     x = [C_x, C_x + r]
				//       y - (C_y2 - r2) = -x + C_x2 x = [C_x2 - r2, C_x2]
				//       2y - (C_y - r) - (C_y2 - r2) = C_x2 - C_x
				//       y = (C_x2 + C_y2 - r2 - C_x + C_y - r) / 2
				//       y = average of y - average of r + (C_x2 - C_x) / 2
				//       -(C_y - r) + (C_y2 - r2) = 2x - C_x - C_x2
				//       (C_x2 + C_y2 - r2 + C_x - C_y + r) / 2 = x
				//       x = average of x + (C_y2 - C_y) / 2 - (r2 - r) / 2
				// TRBR: y - (C_y - r) = x - C_x       x = [C_x, C_x + r]
				//       y - (C_y2 + r2) = -x + C_x2   x = [C_x2, C_x2 + r2]
				//       y = (C_x2 + C_y2 + r2 - C_x + C_y - r) / 2
				//       y = average of y + (r2 - r) / 2 + (C_x2 - C_x) / 2
				//       x = (C_y2 - C_y) / 2 + average of r + average of x
				let left = this.pos[0] < othSensor.pos[0] ? this : othSensor;
				let right = this.pos[0] > othSensor.pos[0] ? this : othSensor;
				let r = left.closeDistance + 1;
				let C_y = left.pos[1];
				let C_x = left.pos[0];
				let C_y2 = right.pos[1];
				let C_x2 = right.pos[0];
				let r2 = right.closeDistance + 1;
				if(C_x2 - C_y2 + r2 === C_x - C_y + r) {
					for(let x = Math.max(C_x, C_x2); x <= Math.min(C_x + r, C_x2 + r2); x++) {
						candidates.add(`${x},${(x - C_x) + C_y - r}`);
					}
				}
				let TRTLIntX = average(C_x2, C_x) + halfDist(C_y2, C_y) - halfDist(r2, r);
				let TRTLIntY = average(C_y2, C_y) - average(r2, r) + halfDist(C_x2, C_x);
				candidates.add(`${TRTLIntX},${TRTLIntY}`);
				let TRBRIntX = halfDist(C_y2, C_y) + average(r2, r) + average(C_x2, C_x);
				let TRBRIntY = average(C_y2, C_y) + halfDist(r2, r) + halfDist(C_x2, C_x);
				candidates.add(`${TRBRIntX},${TRBRIntY}`);

				// TR: y - (C_y - r) = (x - C_x)  x = [C_x, C_x + r]
				// TL: y - (C_y - r) = -(x - C_x) x = [C_x - r, C_x]
				// BR: y - (C_y + r) = -(x - C_x) x = [C_x, C_x + r]
				// BL: y - (C_y + r) = (x - C_x)  x = [C_x - r, C_x]
				// BRBR: y - (C_y + r) = -(x - C_x)    x = [C_x, C_x + r]
				//       y - (C_y2 + r2) = -(x - C_x2) x = [C_x2, C_x2 + r2]
				//       -C_y - r + C_y2 + r2 = C_x - C_x2
				//       C_y2 + r2 + C_x2 = C_x + C_y + r
				// BRBL: y - (C_y + r) = -x + C_x      x = [C_x, C_x + r]
				//       y - (C_y2 + r2) = (x - C_x2)  x = [C_x2 - r2, C_x2]
				//       2y - (C_y + r) - (C_y2 + r2) = C_x - C_x2
				//       y = - halfDist(x) + average(y) + average(r)
				//       x = average(x) - halfDist(y) - halfDist(r)
				// BRTR: y - (C_y + r) = -x + C_x     x = [C_x, C_x + r]
				//       y - (C_y - r2) = (x - C_x2)  x = [C_x2, C_x2 + r2]
				//       y = - halfDist(x) + average(y) - halfDist(r)
				//       x = average(x) - halfDist(y) + average(r)
				if(C_x2 + C_y2 + r2 === C_x + C_y + r) {
					for(let x = Math.max(C_x, C_x2); x <= Math.min(C_x + r, C_x2 + r2); x++) {
						candidates.add(`${x},${-(x - C_x) + C_y + r}`);
					}
				}
				let BRBLIntX = - halfDist(C_x2, C_x) + average(C_y2, C_y) + average(r2, r);
				let BRBLIntY = average(C_x2, C_x) - halfDist(C_y2, C_y) - halfDist(r2, r);
				candidates.add(`${BRBLIntX},${BRBLIntY}`);
				let BRTRIntX = - halfDist(C_x2, C_x) + average(C_y2, C_y) - halfDist(r2, r);
				let BRTRIntY = average(C_x2, C_x) - halfDist(C_y2, C_y) + average(r2, r);
				candidates.add(`${BRTRIntX},${BRTRIntY}`);
			}

			for(let point of candidates) {
				if(point.includes(".")) { // No decimals allowed.
					candidates.delete(point);
				}
			}
			return candidates;
		}
	}

	function halfDist(n1, n2) {
		return (n1 - n2) / 2;
	}

	function average(n1, n2) {
		return (n1 + n2) / 2;
	}

	function intersectionPossible(...sensors) {
		// Two Manhattan circles are intersecting IFF manhattan(centers) <= r1 + r2
		for(let i = 0; i < sensors.length; i++) {
			for(let j = i + 1; j < sensors.length; j++) {
				if(manhattan(sensors[i].pos, sensors[j].pos) > sensors[i].closeDistance + sensors[j].closeDistance + 2) {
					return false;
				}
			}
		}
		return true;
	}


	const TRIAL_LINE = 2000000;
	let impossibleCount = 0;
	console.time(`part1`);
	for(let x = minX; x <= maxX; x++) {
		if(sensors.some(sensor => sensor.testBeaconFails([x, TRIAL_LINE]))) {
			if(!beacons.has(`${x},${TRIAL_LINE}`)) {
				impossibleCount++;	
			}
		}
	}
	console.timeEnd(`part1`);

	console.time(`part2`);
	let trueDisBeaPos = [0, 0];
	try {
		for(let i = 0; i < sensors.length; i++) {
			for(let j = i + 1; j < sensors.length; j++) {
				let sensor1 = sensors[i];
				let sensor2 = sensors[j];
				if(intersectionPossible(sensor1, sensor2)) {
					let possible = sensor1.intersection(sensor2);
					if(possible.size !== 0) {
						for(let pos of possible) {
							let testPos = pos.split(",");
							testPos[0] = +testPos[0];
							testPos[1] = +testPos[1];
							if(sensors.every(sensor => sensor.couldBeDisBeacon(testPos))) {
								if(testPos[0] >= 0 && testPos[0] <= 4000000 &&
								   testPos[1] >= 0 && testPos[1] <= 4000000) {
									trueDisBeaPos = testPos;
									throw "Done here";
								}
							}
						}
					}
				}
			}
		}
	} catch (e) {
		if(e !== "Done here") {
			throw e;
		}
	}
	console.timeEnd(`part2`);



	displayCaption(`There are ${impossibleCount} places that cannot contain a beacon on line y=${TRIAL_LINE}.`);
	displayCaption(`The tuning frequency is ${(4000000 * trueDisBeaPos[0]) + trueDisBeaPos[1]}.`);
}