"use strict";

function day1(input) {
	let splitLines = input.split("\n");
	let totals = [[0, 1, 0]];
	let elfNum = 1;
	for(let i = 0; i < splitLines.length; i++) {
		if(splitLines[i] === "") {
			totals.push([0, ++elfNum, 0]);
		} else {
			totals[totals.length - 1][0] += parseInt(splitLines[i], 10);
			totals[totals.length - 1][2]++;
		}
	}
	totals.sort((a, b) => b[0] - a[0]);
	let maxVals = [totals[0][0], totals[1][0], totals[2][0]];
	let maxSum = maxVals.reduce(function(acc, val) {
		return acc + val;
	}, 0);
	displayText(`Elf Preparedness Leaderboard/First Line of Defense Against the Hunger`);
	for(let i = 0; i < totals.length; i++) {
		displayText(`${(i + 1).toString().padStart(totals.length.toString().length)}. Elf ${totals[i][1].toString().padStart(totals.length.toString().length)} with ${totals[i][2].toString().padStart(2)} ${totals[i][2] === 1 ? "snack " : "snacks"} totaling ${totals[i][0].toString().padStart(totals[0][0].toString().length)} calories`);
	}
	displayCaption(`The max calorie amount is ${maxVals[0]}.`);
	displayCaption(`The sum of the max calorie amounts is ${maxSum}.`);
	displayCaption(`A leaderboard is shown, ranking elves by how many calories they have stored.`);
	displayCaption(`Each line shows the elves' id (the first elf in the input is 1, the next 2, etc),`);
	displayCaption(`the number of snacks they brought, and the total calories they possess.`);
}