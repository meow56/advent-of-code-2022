"use strict";

function day20(input) {
// 	input = `1
// 2
// -3
// 3
// -2
// 0
// 4`;
	const FILE_REGEX = /-?\d+/g;
	let numbers = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		numbers.push(new CircularNode(+entry[0]));
	}

	for(let i = 0; i < numbers.length; i++) {
		if(i === 0) {
			numbers[i].next = numbers[i + 1];
			numbers[i].prev = numbers[numbers.length - 1];
		} else if(i === numbers.length - 1) {
			numbers[i].next = numbers[0];
			numbers[i].prev = numbers[i - 1];
		} else {
			numbers[i].next = numbers[i + 1];
			numbers[i].prev = numbers[i - 1];
		}
	}


	let order = numbers.slice();

	function findNumber(num) {
		for(let i = 0; i < numbers.length; i++) {
			if(numbers[i].value === num) return numbers[i];
		}
	}

	function CircularNode(value) {
		this.prev;
		this.next;
		this.value = value;

		this.move = function() {
			if(this.value < 0) {
				// finalPrev: the node BEFORE WHICH to place this node.
				let currNext = this.next;
				let currPrev = this.prev;
				currNext.prev = currPrev;
				currPrev.next = currNext;
				let finalPrev = this.prev;
				for(let i = -1; i > this.value; i--) {
					finalPrev = finalPrev.prev;
				}
				let prevPrev = finalPrev.prev;
				finalPrev.prev = this;
				prevPrev.next = this;
				this.next = finalPrev;
				this.prev = prevPrev;
			} else if(this.value > 0) {
				// finalNext: the node AFTER WHICH to place this node.
				let currNext = this.next;
				let currPrev = this.prev;
				currNext.prev = currPrev;
				currPrev.next = currNext;
				let finalNext = this.next;
				for(let i = 1; i < this.value; i++) {
					finalNext = finalNext.next;
				}
				let nextNext = finalNext.next;
				finalNext.next = this;
				nextNext.prev = this;
				this.next = nextNext;
				this.prev = finalNext;
			}
		}
	}

	//console.log(`Now it's ${numbers.join()}`);
	for(let num of order) {
		num.move();
		// let display = num.value + ",";
		// let theNext = num.next;
		// while(theNext !== num) {
		// 	display += theNext.value + ",";
		// 	theNext = theNext.next;
		// }
		// console.log(display);
	}

	let currNode = findNumber(0);
	let node1000;
	let node2000;
	let node3000;
	for(let i = 1; i <= 3000; i++) {
		currNode = currNode.next;
		if(i === 1000) node1000 = currNode;
		if(i === 2000) node2000 = currNode;
		if(i === 3000) node3000 = currNode;
	}
	displayCaption(`The sum is ${node1000.value + node2000.value + node3000.value}.`);
}