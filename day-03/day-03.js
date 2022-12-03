"use strict";

function day3(input) {
	const FILE_REGEX = /[a-zA-Z]+/g;
	let rucksacks = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		rucksacks.push([entry[0].slice(0, entry[0].length / 2), entry[0].slice(entry[0].length / 2)]);
	}
	let total = 0;
	rucksacks.forEach(function(rucksack) {
		let regex = new RegExp(`[${rucksack[0]}]`);
		let result = rucksack[1].match(regex)[0];
		if(result.charCodeAt() >= "a".charCodeAt()) {
			total += result.charCodeAt() - "a".charCodeAt() + 1;
		} else {
			total += result.charCodeAt() - "A".charCodeAt() + 27;
		}
	});
	displayCaption(`The total score is ${total}`);
}