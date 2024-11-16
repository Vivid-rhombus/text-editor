const FIBONNACI = [
	0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584,
	4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229,
	832040, 1346269, 2178309, 3524578, 5702887, 9227465, 14930352, 24157817,
	39088169, 63245986, 102334155, 165580141, 267914296, 433494437, 701408733,
	1134903170, 1836311903, 2971215073, 4807526976, 7778742049, 12586269025,
	20365011074, 32951280099, 53316291173, 86267571272, 139583862445,
	225851433717, 365435296162, 591286729879, 956722026041, 1548008755920,
	2504730781961, 4052739537881, 6557470319842, 10610209857723, 17167680177565,
	27777890035288, 44945570212853, 72723460248141, 117669030460994,
	190392490709135, 308061521170129, 498454011879264, 806515533049393,
	1304969544928657, 2111485077978050, 3416454622906707, 5527939700884757,
	8944394323791464, 14472334024676221, 23416728348467685, 37889062373143906,
	61305790721611591, 99194853094755497, 160500643816367088, 259695496911122585,
	420196140727489673, 679891637638612258, 1100087778366101931,
	1779979416004714189, 2880067194370816120, 4660046610375530309,
	7540113804746346429,
];
const MAX_ROPE_DEPTH = 96;
const COMBINE_LENGTH = 17;

export interface Rope {
	/// <summary>
	/// Returns a new rope created by appending the specified string to
	/// this rope
	/// </summary>
	/// <param name="suffix">the sequence to append</param>
	/// <returns>a new rope</returns>
	Append(appendItem: string | Rope, start?: number, end?: number): Rope;

	/// <summary>
	/// Get the characters at the given index
	/// </summary>
	/// <param name="index">the index to look up</param>
	/// <returns>the character at the given index</returns>
	CharAt(index: number): string;

	/// <summary>
	/// Creates a new rope by deleting the specified character substring.
	/// The substring begins at the specified start and extends to
	/// the character at index end or to the end of the
	/// sequence if no such character exists. If
	/// start is equal to end, no changes are made. Throws an exception
	/// if start > end
	/// </summary>
	/// <param name="start">the beginning index, inclusive</param>
	/// <param name="end">the ending index, inclusive</param>
	/// <returns>this rope</returns>
	Remove(start: number, end: number): Rope;

	/// <summary>
	/// Creates a new rope by inserting the specified string into this
	/// rope. The characters of the string are inserted in order into
	/// this rope at the indicated offset. If s is null, then the four
	/// characters "null" are inserted into this sequence
	/// </summary>
	/// <param name="dstOffset">the offset</param>
	/// <param name="s">the sequence to be inserted</param>
	/// <returns>a new rope</returns>
	Insert(str: string, offset: number): Rope;

	/// <summary>
	/// Returns the count of characters included in this rope
	/// </summary>
	/// <returns>the count of characters</returns>
	Length(): number;

	/// <summary>
	/// Rebalances the current rope, returning the rebalance rope. In general,
	/// rope rebalancing is handled automatically, but this method is provided
	/// to give users more control
	/// </summary>
	/// <returns>a rebalanced rope</returns>
	rebalance(): Rope;

	/// <summary>
	/// Returns a new rope denoting the subsequence from position start to
	/// position end (exclusive)
	/// </summary>
	/// <param name="start">the starting position</param>
	/// <param name="end">end ending position</param>
	/// <returns>a new rope denoting the subsequence</returns>
	SubSequence(start: number, end?: number): Rope;

	/// <summary>
	/// Tells whether the length of the rope is zero.
	/// </summary>
	/// <returns>true if the length is zero, else false</returns>
	isEmpty(): boolean;

	/// <summary>
	/// Reverses this rope
	/// </summary>
	/// <returns>a reversed copy of this rope</returns>
	// Rope Reverse();

	/// <summary>
	/// Returns an enumerator positioned to start at the specified index
	/// </summary>
	/// <param name="start">the starting index</param>
	/// <returns>An enumerator positioned to start at the specified index</returns>
	// IEnumerator<char> GetEnumerator(int start = 0);

	/// <summary>
	/// Returns an enumerator positioned to start from the specified index
	/// and move backward through the Rope
	/// </summary>
	/// <param name="start">the starting index</param>
	/// <returns>An enumerator positioned to start at the specified index
	/// and move backward</returns>
	// IEnumerator<char> GetReverseEnumerator(int start);

	/// <summary>
	/// Returns the index within this rope of the first occurrence of the
	/// specified string starting from the specified index. The value
	/// returned is the smallest k such that this.StartsWith(str, k) is true.
	/// If no such character occurs in this string, then -1 is returned.
	/// </summary>
	/// <param name="sequence">sequence to find</param>
	/// <param name="fromIndex">the index to start searching</param>
	/// <returns>the index if found, else -1</returns>
	// int IndexOf(string sequence, int fromIndex);

	/// <summary>
	/// Trims all whitespace from the beginning and end of this rope
	/// </summary>
	/// <returns>a whitespace-trimmed rope</returns>
	// Rope Trim();

	/// <summary>
	/// Trims all whitespace from the end of this rope
	/// </summary>
	/// <returns>a rope with all trailing whitespace removed</returns>
	// Rope TrimEnd();

	/// <summary>
	/// Trims all whitespace from the beginning of this string
	/// </summary>
	/// <returns>a rope with all leading whitespace trimmed</returns>
	// Rope TrimStart();

	/// <summary>
	/// Increase the length of this rope to the specified length by prepending
	/// spaces to this rope. If the specified length is less than or equal to
	/// the current length, the rope is unchanged.
	/// </summary>
	/// <param name="toLength">the desired length</param>
	/// <returns>the padded rope</returns>
	// Rope PadStart(int toLength);

	/// <summary>
	/// Increase the length of this rope to the specified length by repeatedly
	/// prepending the character to it. If the specified length is less than or
	/// equal to the current length, the rope is unchanged.
	/// </summary>
	/// <param name="toLength">the desired length</param>
	/// <param name="padChar">the character to use for padding</param>
	/// <returns>the padded rope</returns>
	// Rope PadStart(int toLength, char padChar);

	/// <summary>
	/// Increase the length of this rope to the specified length by appending
	/// spaces to this rope. If the specified length is less than or equal to
	/// the current length, the rope is unchanged.
	/// </summary>
	/// <param name="toLength">the desired length</param>
	/// <returns>the padded rope</returns>
	// Rope PadEnd(int toLength);

	/// <summary>
	/// Increase the length of this rope to the specified length by repeatedly
	/// appending the character to it. If the specified length is less than or
	/// equal to the current length, the rope is unchanged.
	/// </summary>
	/// <param name="toLength">the desired length</param>
	/// <param name="padChar">the character to use for padding</param>
	/// <returns>the padded rope</returns>
	// Rope PadEnd(int toLength, char padChar);

	/// <summary>
	/// Tells whether the rope starts with the specified prefix
	/// </summary>
	/// <param name="prefix">the specified prefix</param>
	/// <returns>true if it starts with the prefix, else false</returns>
	// bool StartsWith(String prefix);

	/// <summary>
	/// Tells whether the rope starts with the specified prefix offset by a
	/// given number of characters
	/// </summary>
	/// <param name="prefix">the specified prefix</param>
	/// <param name="offset">the specified offset</param>
	/// <returns>true if it starts with the prefix after the offset, else false</returns>
	// bool StartsWith(String prefix, int offset);

	/// <summary>
	/// Tells whether the rope ends with the specified suffix
	/// </summary>
	/// <param name="suffix">the specified suffix</param>
	/// <returns>true if it ends with the suffix, else false</returns>
	// bool EndsWith(String suffix);

	/// <summary>
	/// Tells whether the rope ends with the specified suffix
	/// </summary>
	/// <param name="suffix">the specified suffix</param>
	/// <param name="offset">the specified offset</param>
	/// <returns>true if it ends with the suffix, else false</returns>
	// bool EndsWith(String suffix, int offset);
}

// function autoRebalance(r: Rope): Rope {
// 	if (
// 		r instanceof AbstractRope &&
// 		(r as AbstractRope).Depth() > MAX_ROPE_DEPTH
// 	) {
// 		return rebalance(r);
// 	}
// 	return r;
// }

// function rebalance(r: Rope): Rope {
// 	const leafNodes: FlatRope[] = [];
// 	const toExamine: (FlatRope | ConcatenationRope)[] = [];

// 	toExamine.push(r);
// 	while (toExamine.length > 0) {
// 		const rExamine = toExamine.pop();
// 		if (rExamine instanceof ConcatenationRope) {
// 			toExamine.push(rExamine.right);
// 			toExamine.push(rExamine.left);
// 			continue;
// 		}
// 		leafNodes.push(rExamine);
// 	}

// 	const result: Rope = merge(leafNodes, 0, leafNodes.length);
// 	return result;
// }

// function merge(leafNodes: FlatRope[], start: number, end: number): Rope {
// 	const range = end - start;
// 	switch (range) {
// 		case 1:
// 			return leafNodes[start];
// 		case 2:
// 			return new ConcatenationRope(leafNodes[start], leafNodes[start + 1]);
// 		default:
// 			const middle = Math.floor(start + range / 2);
// 			return new ConcatenationRope(
// 				merge(leafNodes, start, middle) + merge(leafNodes, middle, end)
// 			);
// 	}
// }

// function Concatenate(left: Rope, right: Rope): Rope {
// 	if (left.Length() == 0) return right;
// 	if (right.Length() == 0) return left;

// 	if (left.Length() + right.Length() < COMBINE_LENGTH) {
// 		return new FlatRope(left.ToString() + right.ToString());
// 	} else if (!(left instanceof ConcatenationRope)) {
// 		if (right instanceof ConcatenationRope) {
// 			const cRight: ConcatenationRope = right;
// 			if (left.Length() + cRight.GetLeft().Length() < COMBINE_LENGTH)
// 				return autoRebalance(
// 					new ConcatenationRope(
// 						new FlatRope(left.toString(), cRight.left.toString()),
// 						cRight.right
// 					)
// 				);
// 		}
// 	} else if (!(right instanceof ConcatenationRope)) {
// 		if (left instanceof ConcatenationRope) {
// 			const cLeft: ConcatenationRope = left;
// 			if (right.Length() + cLeft.GetRight().Length() < COMBINE_LENGTH)
// 				return autoRebalance(
// 					new ConcatenationRope(
// 						cLeft.GetLeft(),
// 						new FlatRope(cLeft.right.toString(), right.toString())
// 					)
// 				);
// 		}
// 	}

// 	return AutoRebalance(new ConcatenationRope(left, right));
// }

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

abstract class RopeNode {
	abstract length: number;
	abstract left: LeafNode | ConcatNode;
	abstract right: LeafNode | ConcatNode;
}

class LeafNode {
	length: number;
	str: string;

	constructor(str: string = '') {
		this.str = str;
		this.length = str.length;
	}

	Length() {
		return this.length;
	}

	Depth() {
		return 0;
	}

	substring(start: number = 0, end: number = 0): LeafNode {
		if (start > this.length) {
			start = this.length;
			end = this.length;
		}
		if (end > this.length) {
			end = this.length;
		}

		if (start === 0 && end === this.length) {
			return this;
		}
		return new LeafNode(this.str.substring(start, end));
	}

	toString() {
		return this.str;
	}

	concat(str: string) {
		return new LeafNode(this.str.concat(str));
	}

	charAt(index: number): string {
		return this.str.charAt(index);
	}

	append(
		appendItem: string | FlatRope | ConcatenationRope,
		start?: number,
		end?: number
	) {
		if (typeof appendItem === 'string') {
			if (start && end) {
				return concatenate(
					this,
					new FlatRope(appendItem).SubSequence(start, end)
				);
			}
			return concatenate(this, new FlatRope(appendItem));
		}
		return concatenate(this, appendItem);
	}

	remove(start: number, end: number) {
		if (start == end) {
			return this;
		} else if (start > end) {
			throw new RangeError(`start ${start} less than end ${end}`);
		}

		return this.subSequence(0, start).append(
			this.subSequence(end, this.Length()).toString()
		);
	}
}

class ConcatNode {
	private depth: number;
	length: number;
	left: LeafNode | ConcatNode;
	right: LeafNode | ConcatNode;

	constructor(left: LeafNode | ConcatNode, right: LeafNode | ConcatNode) {
		this.length = left.length + right.length;
		this.left = left;
		this.right = right;
		this.depth = Math.max(left.Depth(), right.Depth()) + 1;
	}

	Depth() {
		return this.depth;
	}

	substring(start: number = 0, end: number = 0): LeafNode[] {
		if (start > this.length) {
			start = this.length;
			end = this.length;
		}
		if (end > this.length) {
			end = this.length;
		}

		const leftLength = this.left!.length;
		const leftStart = Math.min(start, leftLength);
		const leftEnd = Math.min(end, leftLength);
		const rightLength = this.right!.length;
		const rightStart = Math.max(0, Math.min(start - leftLength, rightLength));
		const rightEnd = Math.max(0, Math.min(end - leftLength, rightLength));

		// options
		// 1. start and end inside left child.
		// 2. start in left child and end inside right child.
		// 3. start and end inside right child.

		if (start === end) {
			return [new LeafNode()];
		}

		if (end < leftLength) {
			return [this.left.substring(leftStart, leftEnd)].flat();
		}
		if (start < leftLength && end > leftLength) {
			return [
				this.left.substring(leftStart, leftEnd),
				this.right.substring(rightStart, rightEnd),
			].flat();
		}

		return [this.right.substring(rightStart, rightEnd)].flat();
	}

	toString(): string {
		return this.left.toString() + this.right.toString();
	}

	charAt(index: number): string {
		const middle = Math.floor(this.length / 2);
		if (index < middle) {
			return this.left.charAt(index);
		}
		return this.left.charAt(index - middle);
	}

	concat(left: ConcatNode | LeafNode): ConcatNode | LeafNode {
		if (typeof appendItem === 'string') appendItem = new LeafNode(appendItem);

		return this.str.concat(str);
	}
	append(
		appendItem: string | FlatRope | ConcatenationRope,
		start?: number,
		end?: number
	) {
		//
		// if (typeof appendItem === 'string') {
		// 	if (start && end) {
		// 		return concatenate(
		// 			this,
		// 			new FlatRope(appendItem).SubSequence(start, end)
		// 		);
		// 	}
		// 	return concatenate(this, new FlatRope(appendItem));
		// }
		// return concatenate(this, appendItem);
	}

	remove(start: number, end: number) {
		if (start == end) {
			return this;
		} else if (start > end) {
			throw new RangeError(`start ${start} less than end ${end}`);
		}

		return this.subSequence(0, start).append(
			this.subSequence(end, this.Length()).toString()
		);
	}
}
