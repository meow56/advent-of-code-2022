"use strict";

function day4(input) {
	const FILE_REGEX = /(\d+)-(\d+),(\d+)-(\d+)/g;
	let pairs = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		pairs.push([[+entry[1], +entry[2]], [+entry[3], +entry[4]]]);
	}
	let encapsulated = 0;
	let overlapped = 0;
	for(const pair of pairs) {
		if((pair[0][0] >= pair[1][0] && pair[0][1] <= pair[1][1]) || (pair[1][0] >= pair[0][0] && pair[1][1] <= pair[0][1])) {
			encapsulated++;
			overlapped++;
		} else if((pair[0][0] <= pair[1][1] && pair[0][1] >= pair[1][0]) || (pair[1][0] <= pair[0][1] && pair[1][1] >= pair[0][0])) {
			overlapped++;
		}
	}
	displayCaption(`The number of encapsulated pairs is ${encapsulated}`);
	displayCaption(`The number of overlapped pairs is ${overlapped}`);
}