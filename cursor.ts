import gapBuffer from './gapBuffer';

const a = ['h', 'e', 'l', 'l', 'o', '\n', 'w', 'o', 'r', 'l', 'd'];

class Cursor {
	x: number;
	y: number;

	constructor(buffer: gapBuffer) {
		const [x, y] = buffer.left.reduce(
			(acc, char: string): [number, number] => {
				const [x, y] = acc;
				if (char === '\n') {
					return [0, y + 1];
				}
				return [x + 1, y];
			},
			[0, 0]
		);
		this.x = x;
		this.y = y;
	}
}
