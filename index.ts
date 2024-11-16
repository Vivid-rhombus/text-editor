import * as fs from 'fs';
import chalk from 'chalk';
import gapBuffer from './gapBuffer';
import map from './inputCodeMap';

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdout.write(Buffer.from('\u001B[?25l')); // hides default cursor

const file = fs.readFileSync('./text.txt', 'utf8');

const rope = new gapBuffer(file);
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
	const inputArr = [];
	for (let inputCode of inputIterator) {
		inputArr.push(inputCode);
	}
	const inputString = inputArr.join('-');
	if (debug) console.log(inputString); // Print charcode of last char inserted for debug purposes
	if (inputString === map.ctrlq || inputString === map.ctrlc) {
		// Ctrl + Q / C to quit
		process.stdout.write(Buffer.from('\u001B[?25h')); // Show default cursor
		process.exit();
	}
	if (inputString === map.ctrls) saveToDisk(); // Save to disk
	if (inputString === map.backspace) {
		rope.pop();
	}
	if (inputString === map.tab) {
		rope.push('\t');
	}
	if (inputString === map.newline) {
		rope.push('\n');
	}
	if (parseInt(inputString) >= 32 && parseInt(inputString) <= 126) {
		rope.push(String.fromCharCode(parseInt(inputString)));
	}

	if (inputString === map.left) {
	}
	process.stdout.write(rope.toString() + chalk.bgBlue(' '));
});

/**
 * TO DO:
 *
 * Create cursor object/state manager
 * Add directional key input handling to cursor
 *
 */
