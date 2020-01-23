export class Entity<Key> {
	id: Key;
	concurrencyStamp: string;
	concurrencyTimeStamp: any;
	dateCreated: Date;
	dateModified: Date;
	active: boolean;
	deleted: boolean;
}
