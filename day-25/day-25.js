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

	let totalSum = "0";
	for(let num of numbers) {
		totalSum = add(totalSum, num);
	}
	displayCaption(`The sum is ${totalSum} (${parseNum(totalSum)}).`);
	function reverseParse(number) {

	}

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
		return trueFinale;
	}
}