"use strict";

function day6(input) {
	function findFirstUnique(size) {
		for(let i = size - 1; i < input.length; i++) {
			let start = i - size + 1;
			let theWindow = input.slice(start, i + 1);
			let uniqueTest = new Set(theWindow);
			if(uniqueTest.size === size) {
				displayCaption(`First unique run of ${size} at ${i + 1}.`);
				return;
			}
		}
		displayCaption(`No unique run of ${size} found.`);
	}

	findFirstUnique(4);
	findFirstUnique(14);
}