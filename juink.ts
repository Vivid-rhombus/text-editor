class RopeA {
	length: number;
	str?: string;
	left?: FlatRope | ConcatenationRope;
	right?: FlatRope | ConcatenationRope;

	constructor(...args: string[]) {
		const str = [...args].join('');
		this.str = str;
		this.length = str?.length || 0;
		this.left;
		this.right;
		this.adjust();
	}

	Depth() {
		return 0;
	}
	adjust() {
		if (this.str) {
			if (this.str.length > SPLIT_LEN) {
				const middle = Math.ceil(this.str.length / 2);
				this.left =
					new FlatRope() | ConcatenationRope(this.str.substring(0, middle));
				this.right =
					new FlatRope() | ConcatenationRope(this.str.substring(middle));
				delete this.str;
			}
		} else {
			if (this.length < JOIN_LEN) {
				if (this.left && this.right) {
					this.str = this.left!.toString() + this.right!.toString();
					delete this.left;
					delete this.right;
				}
			}
		}
	}

	toString(): string {
		if (this.str) {
			return this.str;
		} else {
			return this.left!.toString() + this.right!.toString();
		}
	}

	validateRange(start: number, end: number) {
		if (start < 0 || start > this.length)
			throw new RangeError('Start is not within rope bounds.');
		if (end < 0 || end > this.length)
			throw new RangeError('End is not within rope bounds.');
		if (start > end) throw new RangeError('Start is greater than end.');
	}

	childSubstringIndices(
		startIndex: number,
		endIndex: number,
		leftLength: number,
		rightLength: number
	) {
		const leftStart = Math.min(startIndex, leftLength);
		const leftEnd = Math.min(endIndex, leftLength);
		const rightStart = Math.max(
			0,
			Math.min(startIndex - leftLength, rightLength)
		);
		const rightEnd = Math.max(0, Math.min(endIndex - leftLength, rightLength));

		return [leftStart, leftEnd, rightStart, rightEnd];
	}

	remove(startIndex: number, endIndex?: number) {
		if (!endIndex) {
			endIndex = this.length;
		}
		this.validateRange(startIndex, endIndex);
		if (this.str) {
			this.str =
				this.str.substring(0, startIndex) + this.str.substring(endIndex);
			this.length = this.str.length;
			return;
		} else {
			const leftLength = this.left!.length;
			const rightLength = this.right!.length;

			const [leftStart, leftEnd, rightStart, rightEnd] =
				this.childSubstringIndices(
					startIndex,
					endIndex,
					leftLength,
					rightLength
				);
			if (leftStart < leftLength) {
				this.left!.remove(leftStart, leftEnd);
			}
			if (rightEnd > 0) {
				this.right!.remove(rightStart, rightEnd);
			}
			this.length = this.left!.length + this.right!.length;
		}
		this.adjust();
	}

	insert(position: number, value: string) {
		if (position < 0 || position > this.length)
			throw new RangeError('position is not within rope bounds.');
		if (this.str) {
			this.str =
				this.str.substring(0, position) +
				value.toString() +
				this.str.substring(position);
			this.length = this.str.length;
		} else {
			const leftLength = this.left!.length;
			if (position < leftLength) {
				this.left!.insert(position, value);
				this.length = this.left!.length + this.right!.length;
			} else {
				this.right!.insert(position - leftLength, value);
			}
		}
		this.adjust();
	}

	rebuild() {
		if (this.str === undefined) {
			this.str = this.left!.toString() + this.right!.toString();
			delete this.left;
			delete this.right;
			this.adjust();
		}
	}

	rebalance() {
		if (this.str) {
			if (
				this.left!.length / this.right!.length > BALANCE_RATIO ||
				this.right!.length / this.left!.length > BALANCE_RATIO
			) {
				this.rebuild();
			} else {
				this.left!.rebalance();
				this.right!.rebalance();
			}
		}
	}

	substring(start?: number, end?: number): string {
		if (!start || start < 0) {
			start = 0;
		} else if (start > this.length) {
			start = this.length;
		}
		if (!end || end < 0) {
			end = 0;
		} else if (end > this.length) {
			end = this.length;
		}
		if (this.str) {
			return this.str.substring(start, end);
		} else {
			const leftLength = this.left!.length;
			const leftStart = Math.min(start, leftLength);
			const leftEnd = Math.min(end, leftLength);
			const rightLength = this.right!.length;
			const rightStart = Math.max(0, Math.min(start - leftLength, rightLength));
			const rightEnd = Math.max(0, Math.min(end - leftLength, rightLength));

			if (leftStart != leftEnd) {
				if (rightStart != rightEnd) {
					return (
						this.left!.substring(leftStart, leftEnd) +
						this.right!.substring(rightStart, rightEnd)
					);
				} else {
					return this.left!.substring(leftStart, leftEnd);
				}
			} else {
				if (rightStart != rightEnd) {
					return this.right!.substring(rightStart, rightEnd);
				} else {
					return '';
				}
			}
		}
	}

	substr(start: number, length?: number) {
		let end;
		if (start < 0) {
			start = this.length + start;
			if (start < 0) {
				start = 0;
			}
		}
		if (!length) {
			end = this.length;
		} else {
			if (length < 0) {
				length = 0;
			}
			end = start + length;
		}
		return this.substring(start, end);
	}

	charAt(position: number) {
		return this.substring(position, position + 1);
	}
}
