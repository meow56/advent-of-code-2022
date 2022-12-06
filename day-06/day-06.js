"use strict";

function day6(input) {
	let currWindow = [input[0], input[1], input[2], input[3]];
	function isRepeating() {
		return currWindow[0] === currWindow[1] || currWindow[0] === currWindow[2] || currWindow[0] === currWindow[3]
			|| currWindow[1] === currWindow[2] || currWindow[1] === currWindow[3]
			|| currWindow[2] === currWindow[3];
	}
	for(let index = 4; index < input.length; index++) {
		console.log(currWindow);
		if(!isRepeating()) {
			displayCaption(`Found it at ${index}.`);
			break;
		}
		currWindow.push(input[index]);
		currWindow.shift();
	}
}