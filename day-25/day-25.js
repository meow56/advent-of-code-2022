"use strict";

function day25(input) {
	let numbers = input.split("\n");

	function parseNum(number) {
		let digits = number.split("");
		let place = 1;
		let sum = 0;
		for(let i = digits.length - 1; i >= 0; i--) {
			if(!Number.isNaN(+digits[i])) {
				sum += +digits[i] * place;
			} else if(digits[i] === "-") {
				sum += -place;
			} else {
				sum += -2 * place;
			}
			place *= 5;
		}
		return sum;
	}

	let interResults = ["0"];
	let totalSum = "0";
	for(let num of numbers) {
		totalSum = add(totalSum, num);
	}
	displayCaption(`The sum is ${totalSum} (${parseNum(totalSum)}).`);

	let merryChristmas = assignBlock("Christmas");
	let sumStuff = assignBlock("sum");

	merryChristmas.style = 'background-color: black;';
	let offset = 0;
	function christmas() {
		let text = "Merry Christmas!".split("");
		for(let i = 0; i < text.length; i++) {
			if((i + offset) % 3 === 0) {
				text[i] = `<span class='text-red'>${text[i]}</span>`;
			} else if((i + offset) % 3 === 1) {
				text[i] = `<span class='text-green'>${text[i]}</span>`;
			} else {
				text[i] = `<span class='text-white'>${text[i]}</span>`;
			}
		}
		merryChristmas.clearText();
		merryChristmas.displayText(text.join(""));
		offset++;
	}
	setInterval(christmas, 500);


	function add(num1, num2) {
		let maxLength = Math.max(num1.length, num2.length);
		num1 = num1.padStart(maxLength, "0");
		num2 = num2.padStart(maxLength, "0");
		let num1Arr = num1.split("");
		num1Arr = num1Arr.map(digit => {
			if(digit === "-") return -1;
			if(digit === "=") return -2;
			return +digit;
		});
		let num2Arr = num2.split("");
		num2Arr = num2Arr.map(digit => {
			if(digit === "-") return -1;
			if(digit === "=") return -2;
			return +digit;
		});
		let finalSum = [];
		let carry = 0;
		for(let i = maxLength - 1; i >= 0; i--) {
			let digit1 = num1Arr[i];
			let digit2 = num2Arr[i];
			let digitSum = digit1 + digit2 + carry;
			if(digitSum > 2) {
				carry = 0;
				while(digitSum > 2) {
					digitSum -= 5;
					carry++;
				}
			} else if(digitSum < -2) {
				carry = 0;
				while(digitSum < -2) {
					digitSum += 5;
					carry--;
				}
			} else {
				carry = 0;
			}
			finalSum.unshift(digitSum);
		}
		if(carry !== 0) finalSum.unshift(carry);
		let trueFinale = "";
		for(let digit of finalSum) {
			if(digit >= 0) trueFinale += digit;
			else if(digit === -1) trueFinale += "-";
			else trueFinale += "=";
		}
		interResults.push(trueFinale);
		return trueFinale;
	}

	function display() {
		let maxLength = Math.max(...(interResults.map((elem) => elem.length)));
		for(let i = 0; i < interResults.length; i++) {
			let res = interResults[i];
			sumStuff.displayText(res.padStart(maxLength) + ` (${parseNum(res)})`);
			if(i === interResults.length - 1) break;
			sumStuff.displayText(numbers[i].padStart(maxLength) + ` (${parseNum(numbers[i])})`);
			sumStuff.displayText("-".repeat(maxLength));
		}
	}

	display();
}