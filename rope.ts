// import { FlatRope | ConcatenationRope } from './ropeUtils';

const SPLIT_LEN = 1000;
const JOIN_LEN = 500;
const BALANCE_RATIO = 1.2;

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

interface Rope {
	/// <summary>
	/// Returns a new rope created by appending the specified string to
	/// this rope
	/// </summary>
	/// <param name="suffix">the sequence to append</param>
	/// <returns>a new rope</returns>
	append(
		appendItem: string | FlatRope | ConcatenationRope,
		start?: number,
		end?: number
	): FlatRope | ConcatenationRope;

	/// <summary>
	/// Get the characters at the given index
	/// </summary>
	/// <param name="index">the index to look up</param>
	/// <returns>the character at the given index</returns>
	charAt(index: number): string;

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
	remove(start: number, end: number): FlatRope | ConcatenationRope;

	/// <summary>
	/// Creates a new rope by inserting the specified string into this
	/// rope. The characters of the string are inserted in order into
	/// this rope at the indicated offset. If s is null, then the four
	/// characters "null" are inserted into this sequence
	/// </summary>
	/// <param name="dstOffset">the offset</param>
	/// <param name="s">the sequence to be inserted</param>
	/// <returns>a new rope</returns>
	insert(str: string, offset: number): FlatRope | ConcatenationRope;

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
	rebalance(): FlatRope | ConcatenationRope;

	/// <summary>
	/// Returns a new rope denoting the subsequence from position start to
	/// position end (exclusive)
	/// </summary>
	/// <param name="start">the starting position</param>
	/// <param name="end">end ending position</param>
	/// <returns>a new rope denoting the subsequence</returns>
	subSequence(start: number, end?: number): FlatRope | ConcatenationRope;

	/// <summary>
	/// Tells whether the length of the rope is zero.
	/// </summary>
	/// <returns>true if the length is zero, else false</returns>
	isEmpty(): boolean;

	/// <summary>
	/// Reverses this rope
	/// </summary>
	/// <returns>a reversed copy of this rope</returns>
	// FlatRope | ConcatenationRope Reverse();

	/// <summary>
	/// Returns an enumerator positioned to start at the specified index
	/// </summary>
	/// <param name="start">the starting index</param>
	/// <returns>An enumerator positioned to start at the specified index</returns>
	// IEnumerator<char> GetEnumerator(int start = 0);

	/// <summary>
	/// Returns an enumerator positioned to start from the specified index
	/// and move backward through the FlatRope | ConcatenationRope
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
	// FlatRope | ConcatenationRope Trim();

	/// <summary>
	/// Trims all whitespace from the end of this rope
	/// </summary>
	/// <returns>a rope with all trailing whitespace removed</returns>
	// FlatRope | ConcatenationRope TrimEnd();

	/// <summary>
	/// Trims all whitespace from the beginning of this string
	/// </summary>
	/// <returns>a rope with all leading whitespace trimmed</returns>
	// FlatRope | ConcatenationRope TrimStart();

	/// <summary>
	/// Increase the length of this rope to the specified length by prepending
	/// spaces to this rope. If the specified length is less than or equal to
	/// the current length, the rope is unchanged.
	/// </summary>
	/// <param name="toLength">the desired length</param>
	/// <returns>the padded rope</returns>
	// FlatRope | ConcatenationRope PadStart(int toLength);

	/// <summary>
	/// Increase the length of this rope to the specified length by repeatedly
	/// prepending the character to it. If the specified length is less than or
	/// equal to the current length, the rope is unchanged.
	/// </summary>
	/// <param name="toLength">the desired length</param>
	/// <param name="padChar">the character to use for padding</param>
	/// <returns>the padded rope</returns>
	// FlatRope | ConcatenationRope PadStart(int toLength, char padChar);

	/// <summary>
	/// Increase the length of this rope to the specified length by appending
	/// spaces to this rope. If the specified length is less than or equal to
	/// the current length, the rope is unchanged.
	/// </summary>
	/// <param name="toLength">the desired length</param>
	/// <returns>the padded rope</returns>
	// FlatRope | ConcatenationRope PadEnd(int toLength);

	/// <summary>
	/// Increase the length of this rope to the specified length by repeatedly
	/// appending the character to it. If the specified length is less than or
	/// equal to the current length, the rope is unchanged.
	/// </summary>
	/// <param name="toLength">the desired length</param>
	/// <param name="padChar">the character to use for padding</param>
	/// <returns>the padded rope</returns>
	// FlatRope | ConcatenationRope PadEnd(int toLength, char padChar);

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

function autoRebalance(
	r: FlatRope | ConcatenationRope
): FlatRope | ConcatenationRope {
	if (
		r instanceof AbstractRope &&
		(r as AbstractRope).Depth() > MAX_ROPE_DEPTH
	) {
		return rebalance(r);
	}
	return r;
}

function rebalance(
	r: FlatRope | ConcatenationRope
): FlatRope | ConcatenationRope {
	const leafNodes: FlatRope[] = [];
	const toExamine: (FlatRope | ConcatenationRope)[] = [];

	toExamine.push(r);
	while (toExamine.length > 0) {
		const rExamine = toExamine.pop();
		if (rExamine instanceof ConcatenationRope) {
			toExamine.push(rExamine.right);
			toExamine.push(rExamine.left);
			continue;
		}
		leafNodes.push(rExamine as FlatRope);
	}

	const result: FlatRope | ConcatenationRope = merge(
		leafNodes,
		0,
		leafNodes.length
	);
	return result;
}

function merge(
	leafNodes: FlatRope[],
	start: number,
	end: number
): FlatRope | ConcatenationRope {
	const range = end - start;
	switch (range) {
		case 1:
			return leafNodes[start];
		case 2:
			return new ConcatenationRope(leafNodes[start], leafNodes[start + 1]);
		default:
			const middle = Math.floor(start + range / 2);
			return new ConcatenationRope(
				merge(leafNodes, start, middle),
				merge(leafNodes, middle, end)
			);
	}
}

function concatenate(
	left: FlatRope | ConcatenationRope,
	right: FlatRope | ConcatenationRope
): FlatRope | ConcatenationRope {
	if (left.Length() == 0) return right;
	if (right.Length() == 0) return left;

	if (left.Length() + right.Length() < COMBINE_LENGTH) {
		return new FlatRope(left.toString() + right.toString());
	} else if (!(left instanceof ConcatenationRope)) {
		if (right instanceof ConcatenationRope) {
			const cRight: ConcatenationRope = right;
			if (left.Length() + cRight.left.Length() < COMBINE_LENGTH)
				return autoRebalance(
					new ConcatenationRope(
						new FlatRope(left.toString() + cRight.left.toString()),
						cRight.right
					)
				);
		}
	} else if (!(right instanceof ConcatenationRope)) {
		if (left instanceof ConcatenationRope) {
			const cLeft: ConcatenationRope = left;
			if (right.Length() + cLeft.right.Length() < COMBINE_LENGTH)
				return autoRebalance(
					new ConcatenationRope(
						cLeft.left,
						new FlatRope(cLeft.right.toString() + right.toString())
					)
				);
		}
	}

	return autoRebalance(new ConcatenationRope(left, right));
}

abstract class AbstractRope {
	// append(
	// 	appendItem: string | FlatRope | ConcatenationRope,
	// 	start?: number,
	// 	end?: number
	// ) {
	// 	if (typeof appendItem === 'string') {
	// 		if (start && end) {
	// 			return concatenate(this, RopeBuilder.BUILD(suffix).SubSequence(start, end));
	// 		}
	// 		// return RopeUtilities.INSTANCE.Concatenate(this, RopeBuilder.BUILD(suffix));
	// 	}
	// 	// return RopeUtilities.INSTANCE.Concatenate(this, rope);
	// }

	remove(start: number, end: number) {
		if (start == end) {
			return this;
		} else if (start > end) {
			throw new RangeError(`start ${start} less than end ${end}`);
		}

		// return SubSequence(0, start).append(
		// 	SubSequence(end, this.Length()).ToString()
		// );
	}

	isEmpty() {
		return this.Length() === 0;
	}

	abstract Length(): number;
	abstract Depth(): number;
	// abstract getEnumerator(): unknown; // enumerator
	rebalance(): AbstractRope {
		return this;
	}

	abstract CharAt(index: number): string;
	abstract Append(): FlatRope | ConcatenationRope;

	abstract Remove(start: number, end: number): FlatRope | ConcatenationRope;

	abstract Insert(str: string, offset: number): FlatRope | ConcatenationRope;

	abstract SubSequence(
		start: number,
		end: number
	): FlatRope | ConcatenationRope;
}

class FlatRope {
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

	IndexOf(str: string, offset: number = 0) {
		return this.str.indexOf(str, offset);
	}

	subSequence(start: number = 0, end: number = 0) {
		if (start == 0 && end == this.Length()) return this;
		else if (end - start < 16) {
			return this.str.substr(start, end - start);
		} else {
			return new SubStringRope(this, start, end - start);
		}
	}

	toString() {
		return this.str;
	}

	isEmpty() {
		return this.length === 0;
	}

	charAt(index: number): string {
		return '';
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

	Insert(str: string, offset: number): FlatRope | ConcatenationRope {
		return new FlatRope();
	}
}

class ConcatenationRope extends AbstractRope {
	length: number;
	depth: number;
	left: FlatRope | ConcatenationRope;
	right: FlatRope | ConcatenationRope;

	constructor(
		left: FlatRope | ConcatenationRope,
		right: FlatRope | ConcatenationRope
	) {
		super();
		this.length = left.Length() + right.Length();
		this.depth = Math.max(left.Depth(), right.Depth()) + 1;
		this.left = left;
		this.right = right;
	}

	Depth() {
		return this.depth;
	}

	Length() {
		return this.length;
	}

	SubSequence(start: number = 0, end: number = 0) {
		if (start < 0 || end > this.length)
			throw new RangeError('Illegal subsequence (' + start + ',' + end + ')');
		if (start == 0 && end == this.length) return this;
		const l = this.left.Length();
		if (end <= l) return this.left.SubSequence(start, end);
		if (start >= l) return this.right.SubSequence(start - l, end - l);
		return concatenate(
			this.left.SubSequence(start, l),
			this.right.SubSequence(0, end - l)
		);
	}
}
