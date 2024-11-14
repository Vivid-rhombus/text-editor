class RopeNode {
	constructor(str, left, right) {
		this.str = str;
		this.left = left;
		this.right = right;
		this.weight = str?.length || 0;
	}

	setWeight(weight) {
		this.weight = weight;
	}

	setStr(str) {
		this.str = str;
	}

	sum() {
		const leftSum = this.left?.sum();
		const rightSum = this.right?.sum();
		const sum = (leftSum ? leftSum : 0) + (rightSum ? rightSum : 0);
		return sum > 0 ? sum : this.weight;
	}

	sumLeftTree() {
		const leftTreeSum = this.left?.sum();
		return leftTreeSum;
	}
}

class Rope {
	constructor(str) {
		this.str = str;
		this.length = str?.length || 0;
		this.left;
		this.right;

		this.SPLIT_LEN = 1000;
		this.JOIN_LEN = 500;
		this.BALANCE_RATIO = 1.2;
	}

	adjust() {
		if (this.str) {
			if (this.str > this.SPLIT_LEN) {
				const middle = Math.ceil(this.str.length / 2);
				this.left = new Rope(this.str.substring(0, middle));
				this.left = new Rope(this.str.substring(middle));
				delete this.str;
			}
		} else {
			if (this.length < Rope.JOIN_LEN) {
				this.str = this.left.toString() + this.right.toString();
				delete this.left;
				delete this.right;
			}
		}
	}

	toString() {
		if (this.str instanceof string) {
			return this.str;
		} else {
			return this.left.toString() + this.right.toString();
		}
	}

	validateRange(start, end) {
		if (start < 0 || start > this.length)
			throw new RangeError('Start is not within rope bounds.');
		if (end < 0 || end > this.length)
			throw new RangeError('End is not within rope bounds.');
		if (start > end) throw new RangeError('Start is greater than end.');
	}

	childSubstringIndices(startIndex, endIndex, leftLength, rightLength) {
		const leftStart = Math.min(startIndex, leftLength);
		const leftEnd = Math.min(endIndex, leftLength);
		const rightStart = Math.max(
			0,
			Math.min(startIndex - leftLength, rightLength)
		);
		const rightEnd = Math.max(0, Math.min(endIndex - leftLength, rightLength));

		return [leftStart, leftEnd, rightStart, rightEnd];
	}

	remove(startIndex, endIndex) {
		this.validateRange(startIndex, endIndex);
		if (this.str instanceof string) {
			this.str =
				this.str.substring(0, startIndex) + this.str.substring(endIndex);
			this.length = this.str.length;
			return;
		} else {
			const leftLength = this.left.length;
			const rightLength = this.right.length;

			const [leftStart, leftEnd, rightStart, rightEnd] = childSubstringIndices(
				startIndex,
				endIndex,
				leftLength,
				rightLength
			);
			if (leftStart < leftLength) {
				this.left.remove(leftStart, leftEnd);
			}
			if (rightEnd > 0) {
				this.right.remove(rightStart, rightEnd);
			}
			this.length = this.left.length + this.right.length;
		}
		this.adjust();
	}

	remove(start, end) {
		if (this.str instanceof string) {
			this.str = this.str.substring(0, start) + this.str.substring(end);
			this.length = this.str.length;
		} else {
			const leftLength = this.left.length;
			const leftStart = Math.min(start, leftLength);
			const leftEnd = Math.min(end, leftLength);
			const rightLength = this.right.length;
			const rightStart = Math.max(0, Math.min(start - leftLength, rightLength));
			const rightEnd = Math.max(0, Math.min(end - leftLength, rightLength));
			if (leftStart < leftLength) {
				this.left.remove(leftStart, leftEnd);
			}
			if (rightEnd > 0) {
				this.right.remove(rightStart, rightEnd);
			}
			this.length = this.left.length + this.right.length;
		}
		adjust.call(this);
	}

	insert(position, value) {
		if (position < 0 || position > this.length)
			throw new RangeError('position is not within rope bounds.');
		if (this.str instanceof string) {
			this.str =
				this.str.substring(0, position) +
				value.toString() +
				this.str.substring(position);
			this.length = this.str.length;
		} else {
			const leftLength = this.left.length;
			if (position < leftLength) {
				this.left.insert(position, value);
				this.length = this.left.length + this.right.length;
			} else {
				this.right.insert(position - leftLength, value);
			}
		}
		this.adjust();
	}

	rebuild() {
		if (this.str === undefined) {
			this.str = this.left.toString() + this.right.toString();
			delete this.left;
			delete this.right;
			this.adjust();
		}
	}

	rebalance() {
		if (this.str instanceof string) {
			if (
				this.left.length / this.right.length > Rope.REBALANCE_RATIO ||
				this.right.length / this.left.length > Rope.REBALANCE_RATIO
			) {
				this.rebuild();
			} else {
				this.left.rebalance();
				this.right.rebalance();
			}
		}
	}

	substring(start, end) {
		if (start < 0 || !start) {
			start = 0;
		} else if (start > this.length) {
			start = this.length;
		}
		if (end < 0 || !end) {
			end = 0;
		} else if (end > this.length) {
			end = this.length;
		}
		if (this.str instanceof string) {
			return this.str.substring(start, end);
		} else {
			const leftLength = this.left.length;
			const leftStart = Math.min(start, leftLength);
			const leftEnd = Math.min(end, leftLength);
			const rightLength = this.right.length;
			const rightStart = Math.max(0, Math.min(start - leftLength, rightLength));
			const rightEnd = Math.max(0, Math.min(end - leftLength, rightLength));

			if (leftStart != leftEnd) {
				if (rightStart != rightEnd) {
					return (
						this.left.substring(leftStart, leftEnd) +
						this.right.substring(rightStart, rightEnd)
					);
				} else {
					return this.left.substring(leftStart, leftEnd);
				}
			} else {
				if (rightStart != rightEnd) {
					return this.right.substring(rightStart, rightEnd);
				} else {
					return '';
				}
			}
		}
	}

	substr(start, length) {
		let end;
		if (start < 0) {
			start = this.length + start;
			if (start < 0) {
				start = 0;
			}
		}
		if (!end) {
			end = this.length;
		} else {
			if (length < 0) {
				length = 0;
			}
			end = start + length;
		}
		return this.substring(start, end);
	}

	charAt(position) {
		return this.substring(position, position + 1);
	}
}

//

class RopeIterator {
	constructor(rope) {
		const stack = [];
		let node = rope.root;
		while (node) {
			this.stack.push(node);
			node = node.left;
		}

		this.rope = rope;
		this.stack = stack;
	}

	next() {
		const res = this.stack.pop();
		if (this.stack.length > 0) {
			const parent = this.stack.pop();
			const right = parent.right;
			if (right) {
				this.stack.push(right);
				let left = right.left;
				while (left) {
					this.stack.push(left);
					left = left.left;
				}
			}
		}
		return res;
	}
}

//										10              - A
//									 /  \
// 	 				   		  7		 .						- B
// 	 		 	   ______/\______
// 	 		 	  /			   			 \
// 	 		   3								4					- C, D
// 	 		 _/ \_        		_/ \_
//	 	  /     \      		 /     \
// 	   3       0		 		2			  2     - E, F, G, H
// 	  / \      |        |     / \
// 	 2   1              |    1   1   - I, J, K, L, M, N, O, P
//   |	 |				      |    |   |
//   he  l             or    l   d

class Node {
	constructor(val, left, right) {
		this.val = val;
		this.left = left;
		this.right = right;
	}
}

class StackNode {
	constructor(val, parent) {
		this.val = val;
		this.parent = parent;
	}
}

class Stack {
	constructor() {
		this.top = null;
	}

	push(val) {
		const node = new StackNode(val);
		if (this.top) {
			node.parent = this.top;
		}
		this.top = node;
	}

	pop() {
		const node = this.top;
		if (!node) return undefined;
		this.top = this.top.parent;
		return node.value;
	}
}

const a = new Rope(
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vulputate ipsum vel mauris sagittis, quis luctus velit scelerisque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu tincidunt ipsum. In id scelerisque mi. Nullam nec dolor quis quam pretium commodo. Aenean rhoncus pellentesque maximus. Integer euismod interdum leo. Aliquam commodo ut augue ac imperdiet. Phasellus vel lectus eleifend, accumsan lectus sed, scelerisque dolor. Aliquam erat volutpat. Praesent dictum risus hendrerit ipsum blandit, ut gravida orci interdum. Sed elementum condimentum lectus eget consequat.\nMorbi tempus, nulla non hendrerit euismod, ligula ante commodo leo, eget rhoncus magna eros sed libero. Suspendisse fermentum ipsum velit. Nulla orci metus, vehicula maximus ante sed, ultricies imperdiet leo. Morbi ut sem a lectus commodo egestas a nec tellus. Nulla semper neque risus, eu congue augue commodo id. Vestibulum finibus et augue sed auctor. Nullam dapibus lobortis lacus, sit amet blandit enim convallis porttitor. Ut auctor molestie metus maximus accumsan. Curabitur imperdiet purus urna, sed elementum arcu accumsan in. Curabitur egestas justo in mattis tincidunt. Ut nec sodales risus.\nInteger faucibus iaculis ullamcorper. Ut nec viverra neque. Maecenas vitae arcu tristique, fringilla dui ut, sollicitudin velit. Mauris bibendum aliquet tellus fermentum vestibulum. Nullam ac urna tortor. Nam lacinia, quam sit amet pulvinar varius, est lacus porta arcu, eu vulputate mi velit sed turpis. Ut ullamcorper leo vitae aliquet interdum. Quisque malesuada aliquam nibh nec efficitur. Integer id vulputate arcu. Aliquam erat volutpat. Integer euismod, turpis ornare tincidunt dapibus, dui purus ultricies sem, vitae placerat est eros a metus. In fermentum faucibus metus id interdum. Mauris in imperdiet justo, vitae feugiat erat. Etiam interdum in tellus vitae efficitur.\nProin tincidunt dolor et neque tincidunt dictum. Cras vel porttitor nisi. Mauris interdum sed arcu quis convallis. Etiam ullamcorper rhoncus sollicitudin. Pellentesque a nisl turpis. Fusce tincidunt quam eu dolor commodo, ac consequat lorem mollis. Etiam sit amet euismod enim. Donec eros lectus, varius non vestibulum quis, commodo ac tortor. Vestibulum sit amet sem venenatis, ornare dolor vel, consequat ex. Aenean in augue in sapien lobortis rutrum.\nUt odio metus, congue nec lacus sit amet, aliquet tincidunt enim. Aliquam lacinia fermentum tincidunt. Pellentesque vehicula, nibh non varius gravida, ipsum sapien posuere sapien, id fringilla nunc lacus vitae erat. Quisque nibh nibh, venenatis in mauris eu, scelerisque dignissim felis. Aenean porttitor ultricies faucibus. Maecenas ac dignissim nibh, ut semper nunc. Aliquam erat volutpat. Phasellus sit amet gravida leo. Cras id consequat turpis. Etiam leo quam, lacinia a lorem at, fermentum rhoncus augue. Maecenas ac tellus tortor. Etiam scelerisque neque euismod urna efficitur malesuada. Aliquam dapibus a urna eu aliquet.'
);

console.log(a.toString());
// const a1 = new RopeNode('hel');
// const a2 = new RopeNode('lo');
// const a3 = new RopeNode('w');
// const a4 = new RopeNode('r');
// const a5 = new RopeNode('ld');
// const b1 = new RopeNode(undefined, a1, a2);
// const b2 = new RopeNode(undefined, b1, a3);
// const b3 = new RopeNode(undefined, a4, a5);
// const b4 = new RopeNode(undefined, b2, b3);
// const b5 = new RopeNode(undefined, b4);

// b1.setWeight(b1.sumLeftTree());
// b2.setWeight(b2.sumLeftTree());
// b3.setWeight(b3.sumLeftTree());
// b4.setWeight(b4.sumLeftTree());
// b5.setWeight(b5.sumLeftTree());

// const rope = new Rope(b5);

// console.log(rope.collectLeaves());
// console.log(a1);
