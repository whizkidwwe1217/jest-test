import { TransactionType } from "./transaction-type";
import { EventEmitter } from "@angular/core";

export interface Transaction<T, K> {
	id: K;
	type: TransactionType;
	newValue: T;
}

export interface State<T> {
	value: T;
	recordRef: T;
	type: TransactionType;
}

export interface TransactionService<
	T extends Transaction<T, K>,
	K,
	S extends State<T>
> {
	/**
	 * Returns whether transaction is enabled for this service
	 */
	readonly enabled: boolean;

	/**
	 * Event fired when transaction state has changed - add transaction, commit all transactions, undo and redo
	 */
	onStateUpdate?: EventEmitter<T>;

	/**
	 * @returns if there are any transactions in the Undo stack
	 */
	canUndo: boolean;

	/**
	 * @returns if there are any transactions in the Redo stack
	 */
	canRedo: boolean;

	/**
	 * Adds provided  transaction with recordRef if any
	 * @param transaction Transaction to be added
	 * @param recordRef Reference to the value of the record in the data source related to the changed item
	 */
	add(transaction: T, recordRef?: T): void;

	/**
	 * Returns all recorded transactions in chronological order
	 * @param id Optional record id to get transactions for
	 * @returns All transaction in the service or for the specified record
	 */
	getTransactionLog(id?: K): T[];

	/**
	 * Remove the last transaction if any
	 */
	undo(): void;

	/**
	 * Applies the last undone transaction if any
	 */
	redo(): void;

	/**
	 * Returns aggregated changes from all transactions
	 * @param mergeChanges If set to true will merge each state's value over relate recordRef
	 * and will record resulting value in the related transaction
	 * @returns Collection of aggregated transactions for each changed record
	 */
	getAggregatedChanges(mergeChanges: boolean): T[];

	/**
	 * Returns the state of the record with provided id
	 * @param id The id of the record
	 * @returns State of the record if any
	 */
	getState(id: K): S;

	/**
	 * Returns value of the required id including all uncommitted changes
	 * @param id The id of the record to return value for
	 * @param mergeChanges If set to true will merge state's value over relate recordRef
	 * and will return merged value
	 * @returns Value with changes or **null**
	 */
	getAggregatedValue(id: K, mergeChanges: boolean): T;

	/**
	 * Applies all transactions over the provided data
	 * @param data Data source to update
	 */
	commit(data: T[]): void;

	/**
	 * Clears all transactions
	 */
	clear(): void;

	/**
	 * Starts pending transactions. All transactions passed after call to startPending
	 * will not be added to transaction log
	 */
	startPending(): void;

	/**
	 * Clears all pending transactions and aggregated pending state. If commit is set to true
	 * commits pending states as single transaction
	 * @param commit Should commit the pending states
	 */
	endPending(commit: boolean): void;
}
