// const gap_size = 10;
// let gap_left = 0;
// let gap_right = gap_size - gap_left - 1;
// let size = 10;

class Cursor {
	x: number;
	y: number;
	bufferIndex: number;

	constructor(buffer: string[]) {
		const [x, y] = buffer.reduce(
			(acc, char: string): [number, number] => {
				const [x, y] = acc;
				if (char === '\n') {
					return [1, y + 1];
				}
				return [x + 1, y];
			},
			[1, 1]
		);
		this.x = x;
		this.y = y;
		this.bufferIndex = buffer.length;
	}

	moveLeft() {
		this.x = this.x > 1 ? this.x - 1 : 1;
	}
	moveRight() {
		this.x += 1;
	}

	incrementNewline() {
		this.x = 1;
		this.y += 1;
	}

	decrementNewline(index: number) {
		this.y = this.y > 1 ? this.y - 1 : 1;
		this.x = index > 0 ? index + 1 : 1;
	}
}

export default class gapBuffer {
	left: string[];
	right: string[];
	gap: number;
	cursor: Cursor;

	constructor(str?: string) {
		if (str) {
			this.left = [...str];
		} else {
			this.left = [];
		}
		this.right = [];
		this.gap = this.left.length;
		this.cursor = new Cursor(this.left);
	}

	moveLeft(length: number) {
		while (length > 0) {
			length--;
			const val = this.left.pop() || '';
			this.gap = this.left.length;
			if (val === '\n') {
				const lastNewline = this.left.findLastIndex(
					(char: string) => char === '\n'
				);
				const adjustedIndex = this.left.length - lastNewline - 1;
				this.cursor.decrementNewline(adjustedIndex);
			} else {
				this.cursor.moveLeft();
			}
			if (val) {
				this.right.unshift(val);
			}
		}
	}

	moveRight(length: number) {
		while (length > 0) {
			length--;
			const val = this.right.shift() || '';
			if (val === '\n') {
				this.cursor.incrementNewline();
			} else {
				this.cursor.moveRight();
			}
			if (val) {
				this.left.push(val);
				this.gap = this.left.length;
			}
		}
	}

	moveUp() {
		const cursorX = this.cursor.x;
		this.moveLeft(cursorX);
		const i = this.left.lastIndexOf('\n');
		// const newlineIndex = i < 0 ? 0 : i;
		const lineLength = this.left.length - i;
		if (cursorX >= lineLength) {
			return;
		}
		this.moveLeft(lineLength - cursorX);
	}

	moveDown() {
		const cursorX = this.cursor.x;
		const i = this.right.indexOf('\n');
		const newlineIndex = i < 0 ? this.right.length : i + 1;
		this.moveRight(newlineIndex);

		const ni = this.right.indexOf('\n');
		const nextLineLength = ni < 0 ? this.right.length : ni;
		if (cursorX >= nextLineLength) {
			this.moveRight(nextLineLength);
			return;
		}
		this.moveRight(cursorX - 1);
	}

	home() {
		this.moveLeft(this.cursor.x - 1);
	}

	end() {
		const i = this.right.indexOf('\n');
		const newlineIndex = i < 0 ? this.right.length : i;
		this.moveRight(newlineIndex);
	}

	moveCursor(index: number) {
		if (index < this.gap) {
			this.moveLeft(this.gap - index);
		} else {
			this.moveRight(index - this.gap);
		}
	}

	pop() {
		const val = this.left.pop() || '';
		this.gap = this.left.length;
		if (val === '\n') {
			const lastNewline = this.left.findLastIndex(
				(char: string) => char === '\n'
			);
			const adjustedIndex = this.left.length - lastNewline - 1;
			this.cursor.decrementNewline(adjustedIndex);
		} else if (val) {
			this.cursor.moveLeft();
		}
	}

	push(input: string) {
		for (let i = 0; i < input.length; i++) {
			this.left.push(input[i]);
			this.cursor.moveRight();
			this.gap++;
			if (input[i] === '\n') this.cursor.incrementNewline();
		}
	}

	toString() {
		return this.left.join('') + this.right.join('');
	}
}
