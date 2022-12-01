"use strict";

window.onload = function() {
	let date = new Date();
	date.setUTCHours(date.getUTCHours() - 5); // Time zones :(
	let day = date.getUTCMonth() !== 11 ? 25 : date.getUTCDate();
	document.getElementById("dayNum").value = Math.min(day, 25);
	document.getElementById("input").addEventListener("change", handleFiles, false);
}

function handleFiles() {
	clearText();
	clearCaption();
	const input = this.files[0];
	input.text().then(text => detDay(text));

	function detDay(text) {
		const dayInput = document.getElementById("dayNum");
		const dayNum = dayInput.value;
		switch(dayNum) { // hmm.
			case "1":
				day1(text);
				break;
			case "2":
				day2(text);
				break;
			case "3":
				day3(text);
				break;
			case "4":
				day4(text);
				break;
			case "5":
				day5(text);
				break;
			case "6":
				day6(text);
				break;
			case "7":
				day7(text);
				break;
			case "8":
				day8(text);
				break;
			case "9":
				day9(text);
				break;
			case "10":
				day10(text);
				break;
			case "11":
				day11(text);
				break;
			case "12":
				day12(text);
				break;
			case "13":
				day13(text);
				break;
			case "14":
				day14(text);
				break;
			case "15":
				day15(text);
				break;
			case "16":
				day16(text);
				break;
			case "17":
				day17(text);
				break;
			case "18":
				day18(text);
				break;
			case "19":
				day19(text);
				break;
			case "20":
				day20(text);
				break;
			case "21":
				day21(text);
				break;
			case "22":
				day22(text);
				break;
			case "23":
				day23(text);
				break;
			case "24":
				day24(text);
				break;
			case "25":
				day25(text);
				break;
		}
	}
}

function displayText(text = "") {
	const display = document.getElementById("display");
	display.textContent += text + "\n";
}

function updateCaption(text = "") {
	const caption = document.getElementById("caption");
	caption.textContent += text + "\n";
}

function clearText() {
	const display = document.getElementById("display");
	display.textContent = "";
}

function clearCaption() {
	const caption = document.getElementById("caption");
	caption.textContent = "";
}

function assignBlock(id) {
	const display = document.getElementById("display");
	if(document.getElementById(id) !== null) {
		throw `A block with ID ${id} already exists.`;
	}
	let NEW_PRE = document.createElement("PRE");
	NEW_PRE.id = id;
	NEW_PRE.displayText = function(text = "") {
		this.textContent += text + "\n";
	}.bind(NEW_PRE);
	NEW_PRE.clearText = function() {
		this.textContent = "";
	}.bind(NEW_PRE);
	display.parentNode.appendChild(NEW_PRE);
	return NEW_PRE;
}

function assignButton(callback, text) {
	const buttons = document.getElementById("buttons");
	let NEW_BUTTON = document.createElement("BUTTON");
	NEW_BUTTON.textContent = text;
	NEW_BUTTON.onclick = callback;
	buttons.appendChild(NEW_BUTTON);
	return NEW_BUTTON;
}

const devMode = false;