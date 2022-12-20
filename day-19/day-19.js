"use strict";

function day19(input) {
	const FILE_REGEX = /Blueprint (\d+): Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\./g;
	let blueprints = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		blueprints.push(new Blueprint(+entry[1], [+entry[2]], [+entry[3]], [+entry[4], +entry[5]], [+entry[6], 0, +entry[7]]));
	}

	const RTI = new Map();
	RTI.set("ore", 0);
	RTI.set("clay", 1);
	RTI.set("obsidian", 2);
	RTI.set("geode", 3);

	const IND_TO_RES = ["ore", "clay", "obsidian", "geode"];

	function Blueprint(id, RRCost, CRCost, BRCost, GRCost) {
		this.id = id;
		this.robotCosts = [RRCost, CRCost, BRCost, GRCost];
		this.best;
	}

	const MEMO_MAP = new Map();
	const RES_RATE_MAP = new Map();

	function generateKey(which, resources, rates, currTime) {
		let newKey = "";
		newKey += which.id + ",";
		newKey += resources.join() + ",";
		newKey += rates.join() + ",";
		newKey += currTime;
		return newKey;
	}

	function genResRateKey(which, currTime) {
		return "" + which.id + "," + currTime;
	}

	function isLess(which, resources, rates, currTime) {
		let [bestRes, bestRate] = RES_RATE_MAP.get(genResRateKey(which, currTime));
		let resLess = resources.every((resource, ind) => resource <= bestRes[ind]);
		let rateLess = rates.every((rate, ind) => rate <= bestRate[ind]);
		return resLess && rateLess;
	}

	function testBlueprint(which, part2 = false, resources = [0, 0, 0, 0], rates = [1, 0, 0, 0], currTime = 1, trace = []) {
		if((!part2 && currTime > 24) || (part2 && currTime > 32)) return [resources[RTI.get("geode")], trace];
		if(MEMO_MAP.has(generateKey(which, resources, rates, currTime))) return MEMO_MAP.get(generateKey(which, resources, rates, currTime));
		if(!RES_RATE_MAP.has(genResRateKey(which, currTime)) || !isLess(which, resources, rates, currTime)) {
			RES_RATE_MAP.set(genResRateKey(which, currTime), [resources.slice(), rates.slice()]);
		} else {
			return [Number.MIN_SAFE_INTEGER, []];
		}
		// decide what to construct
		let possible;

		let oreDiffG = which.robotCosts[RTI.get("geode")][RTI.get("ore")] - resources[RTI.get("ore")];
		let obsDiffG = which.robotCosts[RTI.get("geode")][RTI.get("obsidian")] - resources[RTI.get("obsidian")];
		let timeTillOreG = Math.max(0, Math.ceil(oreDiffG / rates[RTI.get("ore")]));
		let timeTillObsG = Math.max(0, Math.ceil(obsDiffG / rates[RTI.get("obsidian")]));
		let geodeBottleneck = timeTillOreG > timeTillObsG ? "ore" : "obsidian";
		let timeToGR = Math.max(timeTillObsG, timeTillOreG);

		let oreDiffB = which.robotCosts[RTI.get("obsidian")][RTI.get("ore")] - resources[RTI.get("ore")];
		let clayDiffB = which.robotCosts[RTI.get("obsidian")][RTI.get("clay")] - resources[RTI.get("clay")];
		let timeTillOreB = Math.max(0, Math.ceil(oreDiffB / rates[RTI.get("ore")]));
		let timeTillClayB = Math.max(0, Math.ceil(clayDiffB / rates[RTI.get("clay")]));
		let obsBottleneck = timeTillOreB > timeTillClayB ? "ore" : "clay";
		let timeToBR = Math.max(timeTillOreB, timeTillClayB);

		let oreDiffC = which.robotCosts[RTI.get("clay")][RTI.get("ore")] - resources[RTI.get("ore")];
		let timeTillOreC = Math.max(0, Math.ceil(oreDiffC / rates[RTI.get("ore")]));
		let clayBottleneck = "ore";
		let timeToCR = timeTillOreC;

		let oreDiffO = which.robotCosts[RTI.get("ore")][RTI.get("ore")] - resources[RTI.get("ore")];
		let timeTillOreO = Math.max(0, Math.ceil(oreDiffO / rates[RTI.get("ore")]));
		let oreBottleneck = "ore";
		let timeToOR = timeTillOreO;

		let maxOreCost = which.robotCosts.reduce((acc, val) => Math.max(val[RTI.get("ore")], acc), 0);
		let maxClayCost = which.robotCosts[RTI.get("obsidian")][RTI.get("clay")];
		let maxObsCost = which.robotCosts[RTI.get("geode")][RTI.get("obsidian")];

		// Time to make a decision.
		if(timeToGR === 0) {
			// Build it immediately!?
			possible = [RTI.get("geode")];
			if(timeToBR === 0 && rates[RTI.get("obsidian")] <= maxObsCost) {
				let currGeodeTotal = 0;
				let nextGeodeTotal = 0;
				let currObs = resources[RTI.get("obsidian")] + rates[RTI.get("obsidian")];
				let nextObs = resources[RTI.get("obsidian")] + rates[RTI.get("obsidian")] + 1;
				for(let i = currTime + 1; i <= 32; i++) {
					if(currObs >= maxObsCost) {
						currObs -= maxObsCost;
						currGeodeTotal += i;
					}
					if(nextObs >= maxObsCost) {
						nextObs -= maxObsCost;
						nextGeodeTotal += i;
					}
					currObs += rates[RTI.get("obsidian")];
					nextObs += rates[RTI.get("obsidian")] + 1;
				}
				if(nextObs > currObs)
					possible.push(RTI.get("obsidian"));
			}
		} else {
			if(geodeBottleneck === "obsidian") {
				if(timeToBR === 0) {
					// Build it immediately...?
					if(rates[RTI.get("obsidian")] >= maxObsCost) {
						// We can only spend a max of maxObsCost per turn,
						// so there's no reason to construct another obsidian robot.
						possible = [];
					} else {
						possible = [RTI.get("obsidian")];
					}
					if(timeToCR === 0 && rates[RTI.get("clay")] < maxClayCost && resources[RTI.get("clay")] / maxClayCost < currTime) possible.push(RTI.get("clay"));
					//if(resources[RTI.get("ore")] < maxOreCost) possible.push(-1);
				} else {
					if(obsBottleneck === "clay") {
						if(timeToCR === 0) {
							if(rates[RTI.get("clay")] >= maxClayCost) {
								possible = [];
							} else {
								possible = [RTI.get("clay")];
							}
							if(timeToOR === 0 && rates[RTI.get("ore")] < maxOreCost && resources[RTI.get("ore")] / maxOreCost < currTime) possible.push(RTI.get("ore"));
							
							// The only scenario where waiting is optimal
							// is if ore is a bottleneck, right?

							if(resources[RTI.get("ore")] - which.robotCosts[RTI.get("clay")][RTI.get("ore")] < maxOreCost) {
								let nextClay = resources[RTI.get("clay")] + rates[RTI.get("clay")];
								let nextObs = resources[RTI.get("obsidian")] + rates[RTI.get("obsidian")];
								if(nextClay >= maxClayCost || nextObs >= maxObsCost || (which.robotCosts[RTI.get("ore")][RTI.get("ore")] > which.robotCosts[RTI.get("clay")][RTI.get("ore")] && rates[RTI.get("ore")] < maxOreCost && timeToOR !== 0))
									possible.push(-1);
							}
						} else {
							if(timeToOR === 0 && rates[RTI.get("ore")] <= maxOreCost) {
								// It could be good to wait to build a clay bot,
								// or it could be good to build a ore bot...
								possible = [RTI.get("ore"), -1];
							} else {
								// Nothing to do but wait.
								possible = [-1];
							}
						}
					} else {
						if(timeToOR === 0 && rates[RTI.get("ore")] <= maxOreCost) {
							// It could be good to wait to build an obsidian bot,
							// or it could be good to build a ore bot...
							possible = [RTI.get("ore"), -1];
						} else {
							// Nothing to do but wait.
							possible = [-1];
						}
					}
				}
			} else {
				if(timeToOR === 0 && rates[RTI.get("ore")] <= maxOreCost) {
					// It could be good to wait to build a geode bot,
					// or it could be good to build a ore bot...
					possible = [RTI.get("ore"), -1];
				} else {
					// Nothing to do but wait.
					possible = [-1];
				}
			}
		}
		if(currTime === (part2 ? 32 : 24)) possible = [-1];

		// increase
		for(let i = 0; i < resources.length; i++) {
			resources[i] += rates[i];
		}

		// finish building
		let maxGeodes = [];
		for(let poss of possible) {
			if(poss === -1) {
				maxGeodes.push(testBlueprint(which, part2, resources.slice(), rates.slice(), currTime + 1, [...trace, `t = ${currTime}: Now we have ${resources[0]} ore, ${resources[1]} clay, ${resources[2]} obsidian, and ${resources[3]} geodes.`]));
				continue;
			}
			let newRates = rates.slice();
			newRates[poss]++;
			let newRes = resources.slice();
			for(let i = 0; i < which.robotCosts[poss].length; i++) {
				newRes[i] -= which.robotCosts[poss][i];
			}
			if(newRes.every((val, ind) => val === resources[ind])) throw "Robot cost fail";
			let nextStep = testBlueprint(which, part2, newRes, newRates, currTime + 1, [...trace, `t = ${currTime}: Built ${IND_TO_RES[poss]} robot. Now we have ${newRes[0]} ore, ${newRes[1]} clay, ${newRes[2]} obsidian, and ${newRes[3]} geodes.`]);
			maxGeodes.push(nextStep);
		}
		for(let nextStep of maxGeodes) {
			if(nextStep[1].includes(`t = 17: Built obsidian robot. Now we have 2 ore, 7 clay, 4 obsidian, and 0 geodes.`)) {
				console.log("Test");
			}
		}
		let trueMax = maxGeodes.reduce((acc, val) => val[0] > acc[0] ? val : acc, [-1, []]);
		MEMO_MAP.set(generateKey(which, resources, rates, currTime), [trueMax, trace]);
		return trueMax;
	}

	let qualityTotal = 0;
	for(let blueprint of blueprints) {
		let [bestGeodes, trace] = testBlueprint(blueprint);
		console.log(`Done with blueprint ${blueprint.id}: ${bestGeodes}`);
		console.groupCollapsed(`Trace`);
		for(let message of trace) {
			console.log(message);
		}
		console.groupEnd();
		qualityTotal += bestGeodes * blueprint.id;
	}

	MEMO_MAP.clear();
	RES_RATE_MAP.clear();
	let amazingGeodes = 1;
	for(let i = 0; i < 3; i++) {
		let [bestGeodes, trace] = testBlueprint(blueprints[i], true);
		console.log(`Done with blueprint ${blueprints[i].id}: ${bestGeodes}`);
		console.groupCollapsed(`Trace`);
		for(let message of trace) {
			console.log(message);
		}
		console.groupEnd();
		amazingGeodes *= bestGeodes;
	}
	displayCaption(`The quality total is ${qualityTotal}.`);
	displayCaption(`The product of best geodes is ${amazingGeodes}.`);
}