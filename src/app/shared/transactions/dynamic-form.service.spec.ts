import { TestBed } from "@angular/core/testing";
import { HordeflowCommonModule, Entity } from "hordeflow-common";
import * as _ from "lodash";
import { concatMap, switchMap } from "rxjs/operators";
import { EntityTransactionState } from "./entity-transaction-state";
import { EntityTransaction } from "./entity-transaction";
import { EntityTransactionDetail } from "./entity-transaction-detail";

beforeEach(() => {
	TestBed.configureTestingModule({
		imports: [HordeflowCommonModule]
	});
});

test("should create a transaction", () => {
	const transaction = new EntityTransaction<any>();
	expect(transaction).toBeTruthy();
});

test("should create a new transaction", async done => {
	const transaction = new EntityTransaction<any>();
	const detail = EntityTransactionDetail.create("id", "itemId", {});
	transaction.add(detail, "items");
	done();
});

test("should be able to commit a transaction", async done => {
	const transaction = new EntityTransaction<any>();
	transaction.commit().subscribe(e => done(), error => done(), () => done());
});

test("should have a detail collection with an initial size of 0", () => {
	const transaction = new EntityTransaction<any>();
	expect(transaction.collection.size).toBe(0);
});

test("adding a new detail will automatically add a collection", () => {
	const transaction = new EntityTransaction<any>();
	const data = { id: "bc345-53dae-2333c-efef32" };
	const detail = EntityTransactionDetail.create("id", "itemdId", data);
	transaction.add(detail, "items");
	expect(transaction.collection.size).toBe(1);
});

test("should remove an item from a details collection", () => {
	const transaction = new EntityTransaction<any>();
	const data = { id: "bc345-53dae-2333c-efef32" };
	const detail = EntityTransactionDetail.create("id", "itemdId", data);

	transaction.add(detail, "items");
	transaction.remove("bc345-53dae-2333c-efef32", "items");
	const items = transaction.collection.get("items");
	expect(items).toBeTruthy();
	expect(items.length).toBe(0);
});

test("should create a transaction with 3 collections each with 2 details", () => {
	const transaction = new EntityTransaction<any>();
	const et = EntityTransactionDetail;
	transaction.data = { id: 1, name: "Item-0001" };
	const uom1 = et.create("id", "uomId", { id: 1, name: "kilograms" });
	const uom2 = et.create("id", "uomId", { id: 2, name: "pound" });
	transaction.add(uom1, "uoms");
	transaction.add(uom2, "uoms");

	const location1 = et.create("id", "locationId", {
		id: 1,
		name: "New York"
	});
	const location2 = et.create("id", "locationId", {
		id: 2,
		name: "Hong Kong"
	});
	transaction.add(location1, "locations");
	transaction.add(location2, "locations");

	const price1 = et.create("id", "priceId", { id: 1, name: "1.55" });
	const price2 = et.create("id", "priceId", { id: 2, name: "2.35" });
	transaction.add(price1, "prices");
	transaction.add(price2, "prices");

	expect(transaction.collection.size).toBe(3);
	expect(transaction.collection.get("uoms").length).toBe(2);
	expect(transaction.collection.get("locations").length).toBe(2);
	expect(transaction.collection.get("prices").length).toBe(2);
});

test("should set the state of the added details to a collection as 'Added'", () => {
	const transaction = new EntityTransaction<any>();
	const et = EntityTransactionDetail;
	transaction.data = { id: 1, name: "Item-0001" };
	const uom1 = et.create("id", "uomId", { id: 1, name: "kilograms" });
	const uom2 = et.create("id", "uomId", { id: 2, name: "pound" });
	transaction.add(uom1, "uoms");
	transaction.add(uom2, "uoms");
	expect(
		transaction.collection
			.get("uoms")
			.filter(e => e.state === EntityTransactionState.Added).length
	).toBe(2);
});
