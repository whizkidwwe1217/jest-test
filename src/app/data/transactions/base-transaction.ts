import { Transaction, State, TransactionService } from "./transaction";
import { Injectable, EventEmitter } from "@angular/core";
import * as _ from "lodash";

@Injectable()
export class BaseTransactionService<
	T extends Transaction<T, K>,
	K,
	S extends State<T>
> implements TransactionService<T, K, S> {
	protected _isPending = false;
	protected _pendingTransactions: T[] = [];
	protected _pendingStates: Map<K, S> = new Map();

	/**
	 * @inheritdoc
	 */
	public get canRedo(): boolean {
		return false;
	}

	/**
	 * @inheritdoc
	 */
	public get canUndo(): boolean {
		return false;
	}

	/**
	 * @inheritdoc
	 */
	public get enabled(): boolean {
		return this._isPending;
	}

	/**
	 * @inheritdoc
	 */
	public onStateUpdate = new EventEmitter<T>();

	/**
	 * @inheritdoc
	 */
	public add(transaction: T, recordRef?: any): void {
		if (this._isPending) {
			this.updateState(this._pendingStates, transaction, recordRef);
			this._pendingTransactions.push(transaction);
		}
	}

	/**
	 * @inheritdoc
	 */
	getTransactionLog(id?: K): T[] {
		return [];
	}

	/**
	 * @inheritdoc
	 */
	undo(): void {}

	/**
	 * @inheritdoc
	 */
	redo(): void {}

	/**
	 * @inheritdoc
	 */
	getAggregatedChanges(mergeChanges: boolean): T[] {
		const result: T[] = [];
		this._pendingStates.forEach((state: S, key: K) => {
			const value = mergeChanges
				? this.getAggregatedValue(key, mergeChanges)
				: state.value;
			result.push({ id: key, newValue: value, type: state.type } as T);
		});
		return result;
	}

	/**
	 * @inheritdoc
	 */
	public getState(id: K): S {
		return this._pendingStates.get(id);
	}

	/**
	 * @inheritdoc
	 */
	public getAggregatedValue(id: K, mergeChanges: boolean): T {
		const state = this._pendingStates.get(id);
		if (!state) {
			return null;
		}
		if (mergeChanges) {
			return this.updateValue(state);
		}
		return state.value;
	}

	/**
	 * @inheritdoc
	 */
	commit(data: T[]): void {}

	/**
	 * @inheritdoc
	 */
	clear(): void {
		this._pendingStates.clear();
		this._pendingTransactions = [];
	}

	/**
	 * @inheritdoc
	 */
	public startPending(): void {
		this._isPending = true;
	}

	/**
	 * @inheritdoc
	 */
	public endPending(commit: boolean): void {
		this._isPending = false;
		this._pendingStates.clear();
		this._pendingTransactions = [];
	}

	/**
	 * Updates the provided states collection according to passed transaction and recordRef
	 * @param states States collection to apply the update to
	 * @param transaction Transaction to apply to the current state
	 * @param recordRef Reference to the value of the record in data source, if any, where transaction should be applied
	 */
	protected updateState(
		states: Map<K, S>,
		transaction: T,
		recordRef?: any
	): void {
		let state = states.get(transaction.id);
		if (state) {
			if (_.isObject(state.value)) {
				_.merge(state.value, transaction.newValue);
			} else {
				state.value = transaction.newValue;
			}
		} else {
			state = {
				value: _.clone(transaction.newValue),
				recordRef: recordRef,
				type: transaction.type
			} as S;
			states.set(transaction.id, state);
		}
	}

	/**
	 * Updates the recordRef of the provided state with all the changes in the state. Accepts primitive and object value types
	 * @param state State to update value for
	 * @returns updated value including all the changes in provided state
	 */
	protected updateValue(state: S) {
		return this.mergeValues(state.recordRef, state.value);
	}

	/**
	 * Merges second values in first value and the result in empty object. If values are primitive type
	 * returns second value if exists, or first value.
	 * @param first Value to merge into
	 * @param second Value to merge
	 */
	protected mergeValues<U>(first: U, second: U): U {
		let result: U;
		if (_.isObject(first) || _.isObject(second)) {
			result = _.merge(_.merge({}, first), second);
		} else {
			result = second ? second : first;
		}
		return result;
	}
}
