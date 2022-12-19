"use strict";

function day19(input) {
// 	input = `Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
// Blueprint 2: Each ore robot costs 2 ore. Each clay robot costs 3 ore. Each obsidian robot costs 3 ore and 8 clay. Each geode robot costs 3 ore and 12 obsidian.`
	const FILE_REGEX = /Blueprint (\d+): Each ore robot costs (\d+) ore\. Each clay robot costs (\d+) ore\. Each obsidian robot costs (\d+) ore and (\d+) clay\. Each geode robot costs (\d+) ore and (\d+) obsidian\./g;
	let blueprints = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		blueprints.push(new Blueprint(+entry[1], [+entry[2]], [+entry[3]], [+entry[4], +entry[5]], [+entry[6], 0, +entry[7]]));
	}

	const RES_TO_IND = new Map();
	RES_TO_IND.set("ore", 0);
	RES_TO_IND.set("clay", 1);
	RES_TO_IND.set("obsidian", 2);
	RES_TO_IND.set("geode", 3);

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

	function testBlueprint(which, resources = [0, 0, 0, 0], rates = [1, 0, 0, 0], currTime = 1, trace = []) {
		if(currTime > 24) return [resources[RES_TO_IND.get("geode")], trace];
		//if(MEMO_MAP.has(generateKey(which, resources, rates, currTime))) return MEMO_MAP.get(generateKey(which, resources, rates, currTime));
		// if(!RES_RATE_MAP.has(genResRateKey(which, currTime)) || !isLess(which, resources, rates, currTime)) {
		// 	RES_RATE_MAP.set(genResRateKey(which, currTime), [resources.slice(), rates.slice()]);
		// } else {
		// 	return Number.MIN_SAFE_INTEGER;
		// }
		// decide what to construct
		let possible;

		let oreDiffG = which.robotCosts[RES_TO_IND.get("geode")][RES_TO_IND.get("ore")] - resources[RES_TO_IND.get("ore")];
		let obsDiffG = which.robotCosts[RES_TO_IND.get("geode")][RES_TO_IND.get("obsidian")] - resources[RES_TO_IND.get("obsidian")];
		let timeTillOreG = Math.max(0, Math.ceil(oreDiffG / rates[RES_TO_IND.get("ore")]));
		let timeTillObsG = Math.max(0, Math.ceil(obsDiffG / rates[RES_TO_IND.get("obsidian")]));
		let geodeBottleneck = timeTillOreG > timeTillObsG ? "ore" : "obsidian";
		let timeToGR = Math.max(timeTillObsG, timeTillOreG);

		let oreDiffB = which.robotCosts[RES_TO_IND.get("obsidian")][RES_TO_IND.get("ore")] - resources[RES_TO_IND.get("ore")];
		let clayDiffB = which.robotCosts[RES_TO_IND.get("obsidian")][RES_TO_IND.get("clay")] - resources[RES_TO_IND.get("clay")];
		let timeTillOreB = Math.max(0, Math.ceil(oreDiffB / rates[RES_TO_IND.get("ore")]));
		let timeTillClayB = Math.max(0, Math.ceil(clayDiffB / rates[RES_TO_IND.get("clay")]));
		let obsBottleneck = timeTillOreB > timeTillClayB ? "ore" : "clay";
		let timeToBR = Math.max(timeTillOreB, timeTillClayB);

		let oreDiffC = which.robotCosts[RES_TO_IND.get("clay")][RES_TO_IND.get("ore")] - resources[RES_TO_IND.get("ore")];
		let timeTillOreC = Math.max(0, Math.ceil(oreDiffC / rates[RES_TO_IND.get("ore")]));
		let clayBottleneck = "ore";
		let timeToCR = timeTillOreC;

		let oreDiffO = which.robotCosts[RES_TO_IND.get("ore")][RES_TO_IND.get("ore")] - resources[RES_TO_IND.get("ore")];
		let timeTillOreO = Math.max(0, Math.ceil(oreDiffO / rates[RES_TO_IND.get("ore")]));
		let oreBottleneck = "ore";
		let timeToOR = timeTillOreO;

		let maxOreCost = which.robotCosts.reduce((acc, val) => Math.max(val[RES_TO_IND.get("ore")], acc), 0);
		let maxClayCost = which.robotCosts[RES_TO_IND.get("obsidian")][RES_TO_IND.get("clay")];
		let maxObsCost = which.robotCosts[RES_TO_IND.get("geode")][RES_TO_IND.get("obsidian")];

		// Time to make a decision.
		if(timeToGR === 0) {
			// Build it immediately!
			possible = [RES_TO_IND.get("geode")];
		} else {
			if(geodeBottleneck === "obsidian") {
				if(timeToBR === 0) {
					// Build it immediately...?
					if(rates[RES_TO_IND.get("obsidian")] >= maxObsCost) {
						// We can only spend a max of maxObsCost per turn,
						// so there's no reason to construct another obsidian robot.
						possible = [-1];
					} else {
						possible = [RES_TO_IND.get("obsidian"), -1];
					}
				} else {
					if(obsBottleneck === "clay") {
						if(timeToCR === 0) {
							// The question is: is building the robot going to
							// make the obsidian bottleneck worse?
							// If so, waiting is better.
							if(rates[RES_TO_IND.get("clay")] >= maxClayCost) {
								possible = [];
							} else {
								possible = [RES_TO_IND.get("clay")];
							}
							if(timeToOR === 0 && rates[RES_TO_IND.get("ore")] <= maxOreCost) possible.push(RES_TO_IND.get("ore"));
							possible.push(-1);
						} else {
							if(timeToOR === 0 && rates[RES_TO_IND.get("ore")] <= maxOreCost) {
								// It could be good to wait to build a clay bot,
								// or it could be good to build a ore bot...
								possible = [RES_TO_IND.get("ore"), -1];
							} else {
								// Nothing to do but wait.
								possible = [-1];
							}
						}
					} else {
						if(timeToOR === 0 && rates[RES_TO_IND.get("ore")] <= maxOreCost) {
							// It could be good to wait to build an obsidian bot,
							// or it could be good to build a ore bot...
							possible = [RES_TO_IND.get("ore"), -1];
						} else {
							// Nothing to do but wait.
							possible = [-1];
						}
					}
				}
			} else {
				if(timeToOR === 0 && rates[RES_TO_IND.get("ore")] <= maxOreCost) {
					// It could be good to wait to build a geode bot,
					// or it could be good to build a ore bot...
					possible = [RES_TO_IND.get("ore"), -1];
				} else {
					// Nothing to do but wait.
					possible = [-1];
				}
			}
		}

		// increase
		for(let i = 0; i < resources.length; i++) {
			resources[i] += rates[i];
		}

		// finish building
		let maxGeodes = [];
		for(let poss of possible) {
			if(poss === -1) {
				maxGeodes.push(testBlueprint(which, resources.slice(), rates.slice(), currTime + 1, [...trace, `t = ${currTime}: Now we have ${resources[0]} ore, ${resources[1]} clay, ${resources[2]} obsidian, and ${resources[3]} geodes.`]));
				continue;
			}
			let newRates = rates.slice();
			newRates[poss]++;
			let newRes = resources.slice();
			for(let i = 0; i < which.robotCosts[poss].length; i++) {
				newRes[i] -= which.robotCosts[poss][i];
			}
			if(newRes.every((val, ind) => val === resources[ind])) throw "Robot cost fail";
			let nextStep = testBlueprint(which, newRes, newRates, currTime + 1, [...trace, `t = ${currTime}: Built ${IND_TO_RES[poss]} robot. Now we have ${newRes[0]} ore, ${newRes[1]} clay, ${newRes[2]} obsidian, and ${newRes[3]} geodes.`]);
			maxGeodes.push(nextStep);
		}
		let trueMax = maxGeodes.reduce((acc, val) => val[0] > acc[0] ? val : acc, [-1, []]);
		//MEMO_MAP.set(generateKey(which, resources, rates, currTime), trueMax);
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
	displayCaption(`The quality total is ${qualityTotal}.`);
}