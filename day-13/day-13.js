"use strict";

function day13(input) {
	let packets = input.split("\n");
	let pairs = [[]];
	for(let packet of packets) {
		if(packet.length === 0) {
			pairs.push([]);
		} else {
			let newArray = Function("return " + packet + ";");
			pairs[pairs.length - 1].push(newArray());
		}
	}

	function deepCopy(arr) {
		let newArray = [];
		for(let elem of arr) {
			if(typeof elem === "number") {
				newArray.push(elem);
			} else {
				newArray.push(deepCopy(elem));
			}
		}
		return newArray;
	}

	function comparePairs(first, second) {
		console.groupCollapsed(`Comparing ${first} and ${second}`);
		first = deepCopy(first);
		second = deepCopy(second);
		while(first.length !== 0 && second.length !== 0) {
			let firstElem = first.shift();
			let secondElem = second.shift();
			console.log(`Comparing elems ${firstElem} and ${secondElem}`);
			if(typeof firstElem === "number" && typeof secondElem === "number") {
				console.log(`Both elems are numbers.`);
				if(firstElem > secondElem) {
					console.log(`${firstElem} > ${secondElem}.`);
					console.groupEnd();
					return false;
				} else if(secondElem > firstElem) {
					console.log(`${firstElem} < ${secondElem}.`);
					console.groupEnd();
					return true;
				}
			} else if(typeof firstElem === "object" && typeof secondElem === "object") {
				console.log(`Both elems are arrays.`);
				let result = comparePairs(firstElem, secondElem);
				if(result !== undefined) {
					console.log(`Sub-lists ${result ? "were" : "were not"} sorted correctly.`);
					console.groupEnd();
					return result;
				}
			} else if(typeof firstElem === "number") {
				console.log(`The first elem is a number.`);
				let result = comparePairs([firstElem], secondElem);
				if(result !== undefined) {
					console.log(`Sub-lists ${result ? "were" : "were not"} sorted correctly.`);
					console.groupEnd();
					return result;
				}
			} else {
				console.log(`The second elem is a number.`);
				let result = comparePairs(firstElem, [secondElem]);
				if(result !== undefined) {
					console.log(`Sub-lists ${result ? "were" : "were not"} sorted correctly.`);
					console.groupEnd();
					return result;
				}
			}
		}
		if(first.length === second.length) {
			console.log(`Conclusion: Equal.`);
			console.groupEnd();
			return undefined;
		} else if(first.length === 0) {
			console.log(`First array is shorter.`);
			console.groupEnd();
			return true;
		} else {
			console.log(`Second array is shorter.`);
			console.groupEnd();
			return false;
		}
	}

	let sum = 0;
	for(let i = 0; i < pairs.length; i++) {
		if(pairs[i].length !== 0) {
			let isSorted = comparePairs(pairs[i][0], pairs[i][1]);
			if(isSorted) {
				sum += i + 1;
			}
		}
	}
	displayCaption(`The correctly ordered pairs sum to ${sum}.`);

	pairs = pairs.flat(1);
	pairs.push([[2]]);
	pairs.push([[6]]);
	pairs.sort((a, b) => comparePairs(a, b) ? -1 : 1);
	let indexOf2, indexOf6;
	for(let i = 0; i < pairs.length; i++) {
		if(pairs[i].length === 1 && pairs[i][0].length === 1 && pairs[i][0][0] === 2) {
			indexOf2 = i + 1;
		}
		if(pairs[i].length === 1 && pairs[i][0].length === 1 && pairs[i][0][0] === 6) {
			indexOf6 = i + 1;
			break;
		}
	}
	displayCaption(`The decoder key is ${indexOf2 * indexOf6}.`);
}