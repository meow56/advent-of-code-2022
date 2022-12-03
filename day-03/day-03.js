"use strict";

function day3(input) {
	const FILE_REGEX = /[a-zA-Z]+/g;
	let rucksacks = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		rucksacks.push([entry[0].slice(0, entry[0].length / 2), entry[0].slice(entry[0].length / 2)]);
	}
	let total = 0;
	let wrongValue = [];
	rucksacks.forEach(function(rucksack, index) {
		let regex = new RegExp(`[${rucksack[0]}]`);
		let result = rucksack[1].match(regex)[0];
		wrongValue[index] = result;
		if(result.charCodeAt() >= "a".charCodeAt()) {
			total += result.charCodeAt() - "a".charCodeAt() + 1;
		} else {
			total += result.charCodeAt() - "A".charCodeAt() + 27;
		}
	});
	let badgeTotal = 0;
	let badges = [];
	rucksacks.forEach(function(rucksack, index, rucksacks) {
		if(index % 3 !== 0) return;
		let regex = new RegExp(`[${rucksack.join("")}]`, 'g');
		let interResult = rucksacks[index + 1].join("").match(regex);
		regex = new RegExp(`[${interResult.join("")}]`);
		let finalResult = rucksacks[index + 2].join("").match(regex)[0];
		badges[index / 3] = finalResult;
		if(finalResult.charCodeAt() >= "a".charCodeAt()) {
			badgeTotal += finalResult.charCodeAt() - "a".charCodeAt() + 1;
		} else {
			badgeTotal += finalResult.charCodeAt() - "A".charCodeAt() + 27;
		}
	});
	displayCaption(`The total score is ${total}`);
	displayCaption(`The total badge score is ${badgeTotal}`);

	displayText(`Rucksacks`);
	for(let i = 0; i < rucksacks.length; i++) {
		let finalString = rucksacks[i].join(" ");
		finalString = finalString.replaceAll(wrongValue[i], `<$>${wrongValue[i]}</!>`);
		finalString = finalString.replaceAll(badges[Math.floor(i / 3)], `<&>${badges[Math.floor(i / 3)]}</!>`);
		finalString = finalString.replaceAll("$", "span class='wrong'");
		finalString = finalString.replaceAll("&", "span class='badge'");
		finalString = finalString.replaceAll("!", "span");
		finalString = "    " + finalString;
		if(i % 3 === 0) {
			displayText(`Group ${i / 3 + 1}:`);
		}
		displayText(finalString);
	}
	displayCaption(`A list of rucksacks are shown, seperated into groups of 3.`);
	displayCaption(`The items that are in both halves of the rucksacks are highlighted in red (class "wrong").`);
	displayCaption(`The badges for each group of 3 are highlighted in yellow (class "badge").`);
}