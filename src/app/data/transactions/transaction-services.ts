import { EventEmitter } from "@angular/core";
import { Transaction } from "./transaction";

export interface TransactionService<T, K> {
	readonly: boolean;
	/** Event fired when transaction state has changed */
	onStateUpdate?: EventEmitter<T>;
	/** Add transaction */
	add(transaction: Transaction<T, K>, originalRecord?: any): void;
	/** Returns aggregated changes from all transactions */
	getAggregatedChanges(mergeValueWithOriginal: boolean): Transaction<T, K>[];
	/** Applies all transactions over the provided data */
	commit(data: any[]): void;
	/** Clears all transactions */
	clear(): void;
	/** Remove the last transaction */
	undo(): void;
	/** Apply back the last undone transaction */
	redo(): void;
	/** Start recording transactions into a pending state */
	startPending(): void;
	/** Stop recording and add pending state as single transaction */
	endPending(): void;
}
