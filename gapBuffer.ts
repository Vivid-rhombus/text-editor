const gap_size = 10;
let gap_left = 0;
let gap_right = gap_size - gap_left - 1;
let size = 10;

export default class gapBuffer {
	left: string[];
	right: string[];
	cursor: number;
	// cursorRight: number;

	constructor(str?: string) {
		if (str) {
			this.left = [...str];
		} else {
			this.left = [];
		}
		this.right = [];
		this.cursor = this.left.length;
		// this.cursorRight = 0;
	}

	moveLeft(length: number) {
		while (length > 0) {
			length--;
			this.cursor--;
			this.right.unshift(this.left.pop() || '');
		}
	}

	moveRight(length: number) {
		while (length > 0) {
			length--;
			this.cursor++;
			this.left.push(this.right.shift() || '');
		}
	}

	moveCursor(index: number) {
		if (index < this.cursor) {
			this.moveLeft(this.cursor - index);
		} else {
			this.moveRight(index - this.cursor);
		}
	}

	pop() {
		this.moveCursor(this.left.length);
		const isEmpty = this.left.length === 0;
		this.left.pop();
		this.cursor += isEmpty ? 0 : -1;
	}

	push(input: string) {
		this.moveCursor(this.left.length);

		for (let i = 0; i < input.length; i++) {
			this.left[this.cursor] = input[i];
			this.cursor++;
		}
	}

	toString() {
		return this.left.join('') + this.right.join('');
	}
}
