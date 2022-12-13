"use strict";

function day13(input) {
	let packets = input.split("\n");
	let pairs = [[]];
	for(let packet of packets) {
		if(packet.length === 0) {
			pairs.push([]);
		} else {
			let newArray = arrayFromString(packet);
			pairs[pairs.length - 1].push(newArray);
		}
	}

	function arrayFromString(str) {
		let newArr = [];
		str = str.slice(1, -1);
		for(let i = 0; i < str.length; i++) {
			if(!Number.isNaN(+str[i])) {
				let num = "";
				while(!Number.isNaN(+str[i])) {
					num += str[i];
					i++;
				}
				newArr.push(+num);
			} else if(str[i] === "[") {
				let arrStart = i;
				let arrEnd;
				let bracketStack = 0;
				for(let j = i + 1; j < str.length; j++) {
					if(str[j] === "[") {
						bracketStack++;
					} else if(str[j] === "]") {
						bracketStack--;
						if(bracketStack === -1) {
							arrEnd = j + 1;
							break;
						}
					}
				}
				newArr.push(arrayFromString(str.slice(arrStart, arrEnd)));
				i = arrEnd;
			}
		}
		return newArr;
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
		first = deepCopy(first);
		second = deepCopy(second);
		while(first.length !== 0 && second.length !== 0) {
			let firstElem = first.shift();
			let secondElem = second.shift();
			if(typeof firstElem === "number" && typeof secondElem === "number") {
				if(firstElem > secondElem) {
					return false;
				} else if(secondElem > firstElem) {
					return true;
				}
			} else if(typeof firstElem === "object" && typeof secondElem === "object") {
				let result = comparePairs(firstElem, secondElem);
				if(result !== undefined) {
					return result;
				}
			} else if(typeof firstElem === "number") {
				let result = comparePairs([firstElem], secondElem);
				if(result !== undefined) {
					return result;
				}
			} else {
				let result = comparePairs(firstElem, [secondElem]);
				if(result !== undefined) {
					return result;
				}
			}
		}
		if(first.length === second.length) {
			return undefined;
		} else if(first.length === 0) {
			return true;
		} else {
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
	displayCaption(`The packets are listed in sorted order, with their indices given.`);
	displayCaption(`The packets [[2]] and [[6]] are highlighted using <strong> elements.`);

	function stringFromArray(arr) {
		if(arr.length === 0) return "[]";
		let newStr = "[";
		for(let i = 0; i < arr.length; i++) {
			if(typeof arr[i] === "number") {
				newStr += arr[i] + ", ";
			} else {
				newStr += stringFromArray(arr[i]) + ", ";
			}
		}
		newStr = newStr.slice(0, -2);
		// remove the last ", "
		newStr += "]";
		return newStr;
	}

	for(let i = 0; i < pairs.length; i++) {
		if(i + 1 === indexOf2 || i + 1 === indexOf6) {
			displayText(`<strong>${(i + 1).toString().padStart(3)}: ${stringFromArray(pairs[i])}</strong>`);
		} else {
			displayText(`${(i + 1).toString().padStart(3)}: ${stringFromArray(pairs[i])}`);
		}
	}
}