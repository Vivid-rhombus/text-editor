import * as fs from 'fs';
import chalk from 'chalk';
import Rope from './rope';

process.stdin.setRawMode(true);
process.stdin.resume();

const file = fs.readFileSync('./text.txt', 'utf8');
// let text: string[] = [...file, chalk.bgBlue(' ')];
const rope = new Rope(file);
let cursorLit = true;
let debug = false;

const parseArgs = () => {
	process.argv.forEach((arg) => {
		if (arg === '-d' || arg === '--debug') debug = true;
	});
};

parseArgs();

const flickerCursor = () => {
	const timeoutId = setInterval(() => {
		console.clear();
		cursorLit = !cursorLit;
		process.stdout.write(
			rope.toString() + (cursorLit ? ' ' : chalk.bgBlue(' '))
		);
	}, 500);
	return timeoutId;
};

if (!debug) flickerCursor();

const saveToDisk = () => {
	fs.writeFileSync('./text.txt', rope.toString());
};

process.stdout.write(rope.toString() + chalk.bgBlue(' '));

process.stdin.on('data', (inputBuffer) => {
	console.clear();
	cursorLit = true;
	const inputIterator = inputBuffer.values();
	let altKey = false;
	const inputArr = [];
	for (let inputCode of inputIterator) {
		inputArr.push(inputCode);
	}
	const inputString = inputArr.join('-');
	if (debug) console.log(inputString); // Print charcode of last char inserted for debug purposes
	if (inputString === '27-97') console.log('Hit ALT + a');
	if (inputString === '17' || inputString === '3') process.exit(); // Ctrl + Q to quit
	if (inputString === '19') saveToDisk(); // Save to disk
	if (inputString === '8') {
		rope.remove(rope.length - 1);
	}
	if (inputString === '27') altKey = true;
	if (inputString === '9') {
		rope.insert(rope.length, '\t');
	}
	if (inputString === '13') {
		rope.insert(rope.length, '\n');
	}
	if (parseInt(inputString) >= 32 && parseInt(inputString) <= 126) {
		rope.insert(rope.length, String.fromCharCode(parseInt(inputString)));
	}

	process.stdout.write(rope.toString() + chalk.bgBlue(' '));
});

/**
 * TO DO:
 *
 * Make an inputCode - char/func function (or map, will figure it out)
 * Create cursor object/state manager
 * Add directional key input handling to cursor
 * Fix - If file has content already, last char is removed
 *
 */
