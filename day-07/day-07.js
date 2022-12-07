"use strict";

function day7(input) {
	const DIRECTORY_REGEX = /.+/g;
	let commands = [];
	let fileSystem = {};
	fileSystem["/"] = {};
	let currentDir = [];
	let entry;

	const totalMemory = 70000000;
	const updateMemory = 30000000;

	function currFileSystem(currDir = currentDir) {
		let trueFileSys = fileSystem;
		for(let i = 0; i < currDir.length; i++) {
			trueFileSys = trueFileSys[currDir[i]];
		}
		return trueFileSys;
	}

	while(entry = DIRECTORY_REGEX.exec(input)) {
		let line = entry[0];
		if(line.startsWith("$ cd")) {
			let intoFileSystem = line.slice(5);
			if(intoFileSystem === "..") {
				currentDir.pop();
			} else if(!Object.hasOwn(currFileSystem(), intoFileSystem)) {
				throw `File system ${intoFileSystem} not found!`;
			} else {
				currentDir.push(intoFileSystem);
			}
		} else if(line.startsWith("$ ls")) {
			// do nothing.
		} else {
			if(isNaN(+line[0])) {
				// it doesn't start with a number, so it's a dir.
				// dir ____
				let newDir = line.slice(4);
				currFileSystem()[newDir] = {};
			} else {
				// it's a file.
				let fileInfo = line.split(" ");
				let fileSize = +fileInfo[0];
				let fileName = fileInfo[1];
				currFileSystem()[fileName] = fileSize;
			}
		}
	}

	console.log(fileSystem);

	let totalAtMost100000 = 0;
	let currFreeMemory;
	function computeDirSize(dir, part2 = false) {
		let filesAndDirs = Object.entries(currFileSystem(dir));
		let dirSize = 0;
		for(const [key, value] of filesAndDirs) {
			if(typeof value === "number") {
				dirSize += value;
			} else {
				dirSize += computeDirSize([...dir, key], part2);
			}
		}
		if(dirSize <= 100000 && !part2) {
			totalAtMost100000 += dirSize;
		}
		if(dir.length === 1) {
			// then it's /
			currFreeMemory = totalMemory - dirSize;
		}
		if(part2) {
			if(dirSize >= freeMem && dirSize < currentClosest) {
				currentClosest = dirSize;
			}
		}
		return dirSize;
	}

	computeDirSize([]);
	displayText(`Total is ${totalAtMost100000}.`);
	const freeMem = updateMemory - currFreeMemory;
	let currentClosest = 1e308;
	computeDirSize([], true);
	displayText(`Memory to free is ${currentClosest}.`);
}