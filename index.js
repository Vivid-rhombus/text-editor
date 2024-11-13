import chalk from 'chalk';
import fs from 'fs';

process.stdin.setRawMode(true);
process.stdin.resume();

const file = fs.readFileSync('./text.txt', 'utf8');
let text = [...file];
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
		text.pop();
		text.push(cursorLit ? ' ' : chalk.bgBlue(' '));
		process.stdout.write(text.join(''));
	}, 500);
	return timeoutId;
};

if (!debug) flickerCursor();

const saveToDisk = () => {
	fs.writeFileSync('./text.txt', text.join(''));
};

process.stdout.write(text.join(''));

process.stdin.on('data', (inputBuffer) => {
	console.clear();
	cursorLit = true;
	text.pop();
	const inputIterator = inputBuffer.values();
	let altKey = false;
	for (let inputCode of inputIterator) {
		if (debug) console.log(inputCode); // Print charcode of last char inserted for debug purposes
		if (inputCode === 17) process.exit(); // Ctrl + Q to quit
		if (inputCode === 19) saveToDisk(); // Save to disk
		if (inputCode === 8) text.pop(); // Backspace
		if (inputCode === 27) altKey = true;
		if (inputCode === 9) text.push('\t');
		if (inputCode === 13) text.push('\n');
		if (inputCode >= 32 && inputCode <= 126)
			text.push(String.fromCharCode(inputCode)); // Printable characters
	}
	text.push(chalk.bgBlue(' '));
	process.stdout.write(text.join(''));
});

/**
 * TO DO:
 *
 * Make an inputCode - char/func function (or map, will figure it out)
 * Create cursor object/state manager
 * Add directional key input handling to cursor
 * Build more optiomal data structure (rope?)
 *
 *
 */
