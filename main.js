"use strict";

const devMode = false;

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
	input.text().then(text => window["day" + document.getElementById("dayNum").value](text));
}

function displayText(text = "") {
	const display = document.getElementById("display");
	display.textContent += text + "\n";
}

function displayCaption(text = "") {
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
