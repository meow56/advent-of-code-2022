"use strict";

function day7(input) {
// 	input = `$ cd /
// $ ls
// dir a
// 14848514 b.txt
// 8504156 c.dat
// dir d
// $ cd a
// $ ls
// dir e
// 29116 f
// 2557 g
// 62596 h.lst
// $ cd e
// $ ls
// 584 i
// $ cd ..
// $ cd ..
// $ cd d
// $ ls
// 4060174 j
// 8033020 d.log
// 5626152 d.ext
// 7214296 k`;
	const DIRECTORY_REGEX = /.+/g;
	let commands = [];
	let fileSystem = {};
	fileSystem["/"] = {};
	let currentDir = [];
	let entry;

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
		console.log(`Size of dir ${dir.join("_")} is ${dirSize}.`);
		return dirSize;
	}

	computeDirSize([]);
	displayText(`Total is ${totalAtMost100000}.`);
}