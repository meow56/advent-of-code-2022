"use strict";

function day16(input) {
// 	input = `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
// Valve BB has flow rate=13; tunnels lead to valves CC, AA
// Valve CC has flow rate=2; tunnels lead to valves DD, BB
// Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
// Valve EE has flow rate=3; tunnels lead to valves FF, DD
// Valve FF has flow rate=0; tunnels lead to valves EE, GG
// Valve GG has flow rate=0; tunnels lead to valves FF, HH
// Valve HH has flow rate=22; tunnel leads to valve GG
// Valve II has flow rate=0; tunnels lead to valves AA, JJ
// Valve JJ has flow rate=21; tunnel leads to valve II`;
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

	console.log(valves);

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

	let maxFlow = openValves(valves, targets, 30, 0, AA);
	console.log(`Done`);
	displayCaption(`The max flow is ${maxFlow}.`);
}