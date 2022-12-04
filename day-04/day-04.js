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
	let pairStatus = [];
	for(let i = 0; i < pairs.length; i++) {
		let pair = pairs[i];
		if((pair[0][0] >= pair[1][0] && pair[0][1] <= pair[1][1]) || (pair[1][0] >= pair[0][0] && pair[1][1] <= pair[0][1])) {
			encapsulated++;
			overlapped++;
			pairStatus[i] = 2; // encapsulated
		} else if((pair[0][0] <= pair[1][1] && pair[0][1] >= pair[1][0]) || (pair[1][0] <= pair[0][1] && pair[1][1] >= pair[0][0])) {
			overlapped++;
			pairStatus[i] = 1; // overlapped
		} else {
			pairStatus[i] = 0; // no.
		}
	}
	displayCaption(`The number of encapsulated pairs is ${encapsulated}.`);
	displayCaption(`The number of overlapped pairs is ${overlapped}.`);
	displayCaption(`In addition, a visualization of the ranges of the pairs is shown.`);
	displayCaption(`Numbers with a red background are sectors only visited by one elf.`);
	displayCaption(`Numbers in orange are visited by both elves.`);
	displayCaption(`Numbers in yellow are visited by the other elf.`);
	displayCaption(`Note that red is assigned to the elf whose range starts first.`);
	displayCaption(`Sectors that are not checked are written as '..'.`);

	display(0);
	function display(i) {
		if(i === pairs.length) return;
		let finalString = "";
		// ~I've seen the highest highs, when I'm down in the lowest lows~
		let lowestLow = Math.min(pairs[i][0][0], pairs[i][1][0]);
		let highestLow = Math.max(pairs[i][0][0], pairs[i][1][0]);
		let lowestHigh = Math.min(pairs[i][0][1], pairs[i][1][1]);
		let highestHigh = Math.max(pairs[i][0][1], pairs[i][1][1]);
		switch(pairStatus[i]) {
		case 0:
			// no overlap.

			// Since there's no overlap, we know it's of the form
			// LL -> LH -> HL -> HH
			for(let j = 1; j < 100; j++) {
				if(j === lowestLow) {
					finalString += `<span class='red'>`;
				} else if(j === highestLow) {
					finalString += `<span class='yellow'>`;
				}
				if(j >= lowestLow && j <= lowestHigh) {
					finalString += j.toString().padStart(2, "0");
				} else if(j >= highestLow && j <= highestHigh) {
					finalString += j.toString().padStart(2, "0");
				} else {
					finalString += "..";
				}
				if(j === lowestHigh || j === highestHigh) {
					finalString += `</span> `;
				} else {
					finalString += " ";
				}
			}
			break;
		case 1:
			// overlap, no encapsulation.

			// In this case, it's of the form
			// LL -> HL -> LH -> HH
			// and LL and LH belong to the same pair.
			for(let j = 1; j < 100; j++) {
				if(j === lowestLow) {
					finalString += `<span class='red'>`;
				} else if(j === highestLow) {
					finalString += `</span><span class='orange'>`;
				}
				if(j >= lowestLow && j <= highestHigh) {
					finalString += j.toString().padStart(2, "0");
				} else {
					finalString += "..";
				}
				if(j === lowestHigh) {
					finalString += `</span><span class='yellow'> `;
				} else if(j === highestHigh) {
					finalString += `</span> `;
				} else {
					finalString += " ";
				}
			}
			break;
		case 2:
			// encapsulation.

			// This case has
			// LL -> HL -> LH -> HH
			// as well, it's just that LL and HH belong to the same pair this time.
			for(let j = 1; j < 100; j++) {
				if(j === lowestLow && j === highestLow) {
					finalString += `<span class='orange'>`;
				} else if(j === lowestLow) {
					finalString += `<span class='red'>`;
				} else if(j === highestLow) {
					finalString += `</span><span class='orange'>`;
				}
				if(j >= lowestLow && j <= highestHigh) {
					finalString += j.toString().padStart(2, "0");
				} else {
					finalString += "..";
				}
				if(j === lowestHigh && j === highestHigh) {
					finalString += `</span> `;
				} else if(j === lowestHigh) {
					finalString += `</span><span class='red'> `;
				} else if(j === highestHigh) {
					finalString += `</span> `;
				} else {
					finalString += " ";
				}
			}
			break;
		}
		displayText(finalString);
		setTimeout(display, 0, i + 1);
	}
}