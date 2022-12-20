"use strict";

function day20(input) {
	const FILE_REGEX = /-?\d+/g;
	let numbers = [];
	let numbers2 = [];
	let entry;
	while(entry = FILE_REGEX.exec(input)) {
		numbers.push(new CircularNode(+entry[0]));
		numbers2.push(new CircularNode(+entry[0] * 811589153));
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

	for(let i = 0; i < numbers2.length; i++) {
		if(i === 0) {
			numbers2[i].next = numbers2[i + 1];
			numbers2[i].prev = numbers2[numbers2.length - 1];
		} else if(i === numbers2.length - 1) {
			numbers2[i].next = numbers2[0];
			numbers2[i].prev = numbers2[i - 1];
		} else {
			numbers2[i].next = numbers2[i + 1];
			numbers2[i].prev = numbers2[i - 1];
		}
	}

	function findNumber(num, which = numbers) {
		for(let i = 0; i < which.length; i++) {
			if(which[i].value === num) return which[i];
		}
	}

	function CircularNode(value) {
		this.prev;
		this.next;
		this.value = value;

		this.move = function(which = numbers) {
			if(this.value < 0) {
				// finalPrev: the node BEFORE WHICH to place this node.
				let currNext = this.next;
				let currPrev = this.prev;
				currNext.prev = currPrev;
				currPrev.next = currNext;
				let finalPrev = this.prev;
				for(let i = 1; i < Math.abs(this.value) % (which.length - 1); i++) {
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
				for(let i = 1; i < this.value % (which.length - 1); i++) {
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

	for(let num of numbers) {
		num.move();
	}

	for(let i = 0; i < 10; i++) {
		for(let num of numbers2) {
			num.move();
		}
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

	let currNode2 = findNumber(0, numbers2);
	let node1000two;
	let node2000two;
	let node3000two;
	for(let i = 1; i <= 3000; i++) {
		currNode2 = currNode2.next;
		if(i === 1000) node1000two = currNode2;
		if(i === 2000) node2000two = currNode2;
		if(i === 3000) node3000two = currNode2;
	}
	displayCaption(`The sum is ${node1000.value + node2000.value + node3000.value}.`);
	displayCaption(`The REAL sum is ${node1000two.value + node2000two.value + node3000two.value}.`);
}