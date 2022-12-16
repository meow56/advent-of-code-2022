"use strict";

function day16(input) {
	const FILE_REGEX = /Valve ([A-Z][A-Z]) has flow rate=(\d+); tunnels? leads? to valves? ((?:[A-Z][A-Z],? ?)+)/g;
	let valves = [];
	let entry;
	let AA;
	while(entry = FILE_REGEX.exec(input)) {
		valves.push(new Valve(entry[1], +entry[2], entry[3].split(", ")));
		if(entry[1] === "AA") AA = valves[valves.length - 1];
	}

	function Valve(name, flowRate, tunnels) {
		this.name = name;
		this.flowRate = flowRate;
		this.tunnels = tunnels;
		this.isOpen = false;
		this.isTarget = this.flowRate !== 0;
		this.visited = false;
		this.depth = Number.MAX_SAFE_INTEGER;

		this.targetDepths = new Map();

		this.initializeTunnels = function() {
			let tunnelCopy = [];
			for(let tunnel of this.tunnels) {
				for(let valve of valves) {
					if(valve.name === tunnel) {
						tunnelCopy.push(valve);
						break;
					}
				}
			}
			this.tunnels = tunnelCopy;
		}

		this.copy = function() {
			let copyV = new Valve(this.name, this.flowRate, this.tunnels);
			copyV.isOpen = this.isOpen;
			copyV.targetDepths = this.targetDepths;
			copyV.isTarget = this.isTarget;
			return copyV;
		}
	}

	function resetNodes(start) {
		for(let valve of valves) {
			valve.visited = false;
			valve.depth = Number.MAX_SAFE_INTEGER;
		}
		start.depth = 0;
	}

	function BFS(start) {
		resetNodes(start);
		let queue = [start];
		while(queue.length !== 0) {
			let next = queue.shift();
			for(let path of next.tunnels) {
				if(!path.visited) {
					path.visited = true;
					path.depth = next.depth + 1;
					queue.push(path);
				}
			}
		}
		for(let valve of valves) {
			if(valve.isTarget) {
				start.targetDepths.set(valve.name, valve.depth);
			}
		}
	}

	function deepCopy(arr) {
		let newArray = [];
		for(let elem of arr) {
			newArray.push(elem.copy());
		}
		return newArray;
	}

	function find(arr, name) {
		for(let elem of arr) {
			if(elem.name === name) return elem;
		}
	}

	function updateTotalFlow(valves) {
		let toAdd = 0;
		for(let valve of valves) {
			if(valve.isOpen) {
				toAdd += valve.flowRate;
			}
		}
		return toAdd;
	}

	for(let valve of valves) {
		valve.initializeTunnels();
	}
	
	let targets = [];
	for(let valve of valves) {
		if(valve.isTarget) {
			targets.push(valve);
			BFS(valve);
		}
	}
	BFS(AA);
	targets.sort((a, b) => b.flowRate - a.flowRate);

	function Opener(name, currPos) {
		this.name = name;
		this.currPos = currPos;
		this.timeLeft = 26;
		this.totalFlow = 0;

		this.openValve = function() {
			this.timeLeft--;
			this.totalFlow += this.timeLeft * this.currPos.flowRate;
			this.currPos = this.currPos.copy();
			this.currPos.isOpen = true;
			return `t = ${26 - this.timeLeft}: ${this.name} opened valve ${this.currPos.name}, releasing ${this.currPos.flowRate} * ${this.timeLeft} = ${this.timeLeft * this.currPos.flowRate} flow.`;
		}

		this.move = function(target) {
			this.timeLeft -= this.currPos.targetDepths.get(target.name);
			this.currPos = target.copy();
			return this;
		}

		this.copy = function() {
			let newOpener = new Opener(this.name, this.currPos.copy());
			newOpener.timeLeft = this.timeLeft;
			newOpener.totalFlow = this.totalFlow;
			return newOpener;
		}
	}


	function openValves(valves, targets, timeLeft, totalFlow, currPos) {
		if(timeLeft === 0) return totalFlow;
		//console.log(`${currPos.name},${timeLeft}`);
		//console.log(targets.length);
		let candidateMoves = [];
		if(!currPos.isOpen && currPos.isTarget) {
			let newTargets = [];
			for(let target of targets) {
				if(target.name !== currPos.name) {
					newTargets.push(target);
				}
			}
			let newValves = deepCopy(valves);
			let newPos = find(newValves, currPos.name);
			newPos.isOpen = true;
			valves = newValves;
			targets = newTargets;
			timeLeft--;
			totalFlow += timeLeft * currPos.flowRate;
			currPos = newPos;
		}
		for(let target of targets) {
			if(target.name === currPos.name) continue;
			if(timeLeft < currPos.targetDepths.get(target.name)) continue;
			//console.log(`Targeting ${target.name}`);
			candidateMoves.push(openValves(valves, targets, timeLeft - currPos.targetDepths.get(target.name), totalFlow, target));
		}
		return Math.max(...candidateMoves, totalFlow);
	}

	function openValves2(targets, timeLeft, you, elephant) {
		if(timeLeft === 0) return [you.totalFlow + elephant.totalFlow, []];
		//console.log(`${currPos.name},${timeLeft}`);
		//console.log(targets.length);
		let candidateMoves = [];
		let valveStuff = [];
		if(you.timeLeft === timeLeft && !you.currPos.isOpen && you.currPos.isTarget) {
			valveStuff.push(you.openValve());
		}
		if(elephant.timeLeft === timeLeft && !elephant.currPos.isOpen && elephant.currPos.isTarget) {
			valveStuff.push(elephant.openValve());
		}

		let currRecord = 0;

		let youBestCase = you.totalFlow + elephant.totalFlow;
		let youValidTargets = [];
		for(let target of targets) {
			if(target.name === you.currPos.name) continue;
			if(timeLeft < you.currPos.targetDepths.get(target.name)) continue;
			youBestCase += timeLeft * target.flowRate;
			youValidTargets.push(target);
		}
		let elephantBestCase = you.totalFlow + elephant.totalFlow;
		let elephantValidTargets = [];
		for(let target of targets) {
			if(target.name === elephant.currPos.name) continue;
			if(timeLeft < elephant.currPos.targetDepths.get(target.name)) continue;
			elephantBestCase += timeLeft * target.flowRate;
			elephantValidTargets.push(target);
		}
		if(youValidTargets.length !== 0 && currRecord <= youBestCase && you.timeLeft === timeLeft) {
			// We need to pick a new destination for you.
			for(let target of youValidTargets) {
				let newTargets = [];
				for(let othTarget of youValidTargets) {
					if(othTarget.name !== target.name) {
						newTargets.push(othTarget);
					}
				}
				let [nextMove, record] = openValves2(newTargets, timeLeft, you.copy().move(target), elephant.copy());
				record.unshift(`t = ${26 - timeLeft + 1}: You move to ${target.name}`);
				candidateMoves.push([nextMove, record]);
				if(nextMove > currRecord) currRecord = nextMove;
			}
		} else if(elephantValidTargets.length !== 0 && currRecord <= elephantBestCase && elephant.timeLeft === timeLeft) {
			for(let target of elephantValidTargets) {
				let newTargets = [];
				for(let othTarget of elephantValidTargets) {
					if(othTarget.name !== target.name) {
						newTargets.push(othTarget);
					}
				}
				let [nextMove, record] = openValves2(newTargets, timeLeft, you.copy(), elephant.copy().move(target));
				record.unshift(`t = ${26 - timeLeft + 1}: Elephant moves to ${target.name}`);
				candidateMoves.push([nextMove, record]);
				if(nextMove > currRecord) currRecord = nextMove;
			}
		} else {
			candidateMoves.push(openValves2(targets, timeLeft - 1, you.copy(), elephant.copy()));
		}
		let max = you.totalFlow + elephant.totalFlow;
		let maxMove = ["Nothing else happens after this."];
		for(let move of candidateMoves) {
			if(move[0] > max) {
				max = move[0];
				maxMove = move[1];
			}
		}
		for(let valveS of valveStuff) {
			maxMove.unshift(valveS);
		}
		return [max, maxMove];
	}


	let maxFlow = openValves(deepCopy(valves), deepCopy(targets), 30, 0, AA);
	let you = new Opener("You", AA);
	let elephant = new Opener("Elephant", AA);
	console.time(`part 2`);
	let [maxFlow2, maxMove] = openValves2(targets, 26, you, elephant);
	console.timeEnd(`part 2`);
	displayCaption(`The max flow is ${maxFlow}.`);
	displayCaption(`The elephant makes the max flow ${maxFlow2}.`);
	displayCaption(`The optimal path is displayed.`);
	for(let move of maxMove) {
		displayText(move);
	}
}