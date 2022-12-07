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
	function computeDirSize(dir) {
		let filesAndDirs = Object.entries(currFileSystem(dir));
		let dirSize = 0;
		for(const [key, value] of filesAndDirs) {
			if(typeof value === "number") {
				dirSize += value;
			} else {
				dirSize += computeDirSize([...dir, key]);
			}
		}
		if(dirSize <= 100000) {
			totalAtMost100000 += dirSize;
		}
		if(dir.length === 1) {
			// then it's /
			currFreeMemory = totalMemory - dirSize;
		}
		currFileSystem(dir).size1 = dirSize; // just to make sure that there's no collision
		return dirSize;
	}

	function getSizeList(dir, currList) {
		let filesAndDirs = Object.entries(currFileSystem(dir));
		currList.push(currFileSystem(dir).size1);
		for(const [key, value] of filesAndDirs) {
			if(typeof value === "object") {
				currList = getSizeList([...dir, key], currList);
			}
		}
		return currList;
	}

	computeDirSize([]);
	const freeMem = updateMemory - currFreeMemory;
	let sizeList = getSizeList([], []);
	sizeList = sizeList.filter(val => val >= freeMem);
	let currentClosest = Math.min(...sizeList);
	displayCaption(`Total is ${totalAtMost100000}.`);
	displayCaption(`Memory to free is ${currentClosest}.`);
	displayCaption(`The file system is displayed.`);
	displayCaption(`It mostly follows the format on the site.`);
	displayCaption(`However, directories also display their size.`);

	function displayFileSystem(dir) {
		let filesAndDirs = Object.entries(currFileSystem(dir));
		let fileIndent = "  ".repeat(dir.length - 1) + "- ";
		let directoryText = `${fileIndent}${dir[dir.length - 1]} (dir, size=${currFileSystem(dir).size1})`;
		displayText(directoryText);
		for(const [key, value] of filesAndDirs) {
			if(typeof value === "object") {
				displayFileSystem([...dir, key]);
			} else if(!key.endsWith("1")) {
				displayText(`  ${fileIndent}${key} (file, size=${value})`);
			}
		}
	}
	displayFileSystem(["/"]);
}