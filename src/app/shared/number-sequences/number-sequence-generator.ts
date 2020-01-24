import { SequenceIncrementer } from "./sequence-incrementer";
import { SequenceResetCondition } from "./sequence-reset-condition";
import * as _ from "lodash";

export class NumberSequenceGenerator {
	startingValue: number;
	resetValue: number;
	endCyclePosition: number;
	cycleSequence: boolean;
	prefix: string;
	suffix: string;
	leftPadding: number;
	rightPadding: number;
	leftPadChar: string;
	rightPadChar: string;
	lastValue: number;
	sequenceIncrementer: SequenceIncrementer;
	resetCondition: SequenceResetCondition;

	public setPrefix(prefix: string): NumberSequenceGenerator {
		this.prefix = prefix ? prefix : "";
		return this;
	}

	public setSuffix(suffix: string): NumberSequenceGenerator {
		this.suffix = suffix ? suffix : "";
		return this;
	}

	public setRightPadding(
		padding: number,
		padChar: string = "0"
	): NumberSequenceGenerator {
		this.rightPadding = padding ? padding : 0;
		this.rightPadChar = padChar ? padChar[0] : "0";
		return this;
	}

	public setLeftPadding(
		padding: number,
		padChar: string = "0"
	): NumberSequenceGenerator {
		this.leftPadding = padding ? padding : 0;
		this.leftPadChar = padChar ? padChar[0] : "0";
		return this;
	}

	public setStartingValue(value: number): NumberSequenceGenerator {
		if (!value) value = 0;
		this.startingValue = value;
		this.lastValue = value;
		return this;
	}

	public setResetValue(value: number): NumberSequenceGenerator {
		if (!value) value = 0;
		this.resetValue = value;
		return this;
	}

	public nextSequenceValue(): number {
		let sequenceValue = this.startingValue;

		if (this.sequenceIncrementer)
			sequenceValue = this.sequenceIncrementer.increment(sequenceValue);
		else sequenceValue++;

		if (this.cycleSequence) {
			if (this.resetCondition)
				sequenceValue = this.resetCondition.reset(
					sequenceValue,
					this.endCyclePosition,
					this.resetValue
				);
			else {
				if (sequenceValue > this.endCyclePosition)
					sequenceValue = this.resetValue;
			}
		}

		return sequenceValue;
	}

	public valueToNumberSequence(value: number): string {
		let padded = _.padStart(
			value.toString(),
			this.leftPadding,
			this.leftPadChar[0]
		);
		padded = _.padEnd(
			padded,
			this.rightPadding + this.leftPadding - 1,
			this.rightPadChar[0]
		);
		return `${this.prefix}${padded}${this.suffix}`;
	}

	public generateNumberSequence(): string {
		const sequence = this.valueToNumberSequence(this.startingValue);
		this.lastValue = this.startingValue;
		this.startingValue = this.nextSequenceValue();
		return sequence;
	}

	public nextNumberSequence(): string {
		return this.valueToNumberSequence(this.startingValue);
	}

	public lastNumberSequence(): string {
		return this.valueToNumberSequence(this.lastValue);
	}
}
