import { EntityTransactionState } from "./entity-transaction-state";

export class EntityTransactionDetail {
	key: string;
	parentReferenceKey: string;
	data: any;
	state: EntityTransactionState;
	collectionKey: string;

	public static create(
		key: string,
		parentReferenceKey: string,
		data
	): EntityTransactionDetail {
		const detail = new EntityTransactionDetail();
		detail.data = data;
		detail.key = key;
		detail.parentReferenceKey = parentReferenceKey;
		detail.state = EntityTransactionState.Added;
		return detail;
	}

	getId(): any {
		return this.data ? this.data[this.key] : null;
	}
}
