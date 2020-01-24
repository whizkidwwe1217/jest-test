import { EntityTransactionState } from "./entity-transaction-state";
import { EntityTransactionDetail } from "./entity-transaction-detail";
import { Observable, EMPTY, throwError } from "rxjs";
import * as _ from "lodash";
import { DataSource } from "hordeflow-common";

export class EntityTransaction<T> {
  public data: T;
  public state: EntityTransactionState;
  public undoStack: EntityTransactionDetail[] = [];
  public dataSource: DataSource<T>;
  private _detailsCollection: Map<string, EntityTransactionDetail[]> = new Map<
    string,
    EntityTransactionDetail[]
  >([]);

  get collection(): Map<string, EntityTransactionDetail[]> {
    return this._detailsCollection;
  }

  public commit(): Observable<T> {
    return EMPTY;
  }

  public delete(): Observable<T> {
    return EMPTY;
  }

  public canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  public undo() {
    if (this.canUndo()) {
      const lastTransaction = this.undoStack.pop();
      if (lastTransaction.state === EntityTransactionState.Added) {
        this.removeDetail(lastTransaction.getId(), lastTransaction.collectionKey, true);
      } else if (lastTransaction.state === EntityTransactionState.Deleted) {
        this.addDetail(lastTransaction, lastTransaction.collectionKey, true);
      }
    }
  }

  private addToUndoStack(transaction: EntityTransactionDetail) {
    this.undoStack.push(transaction);
  }

  public redo(): Observable<T> {
    return throwError("Not yet implemented.");
  }

  public add(detail: EntityTransactionDetail, collectionKey: string) {
    this.addDetail(detail, collectionKey, false);
  }

  public remove(id: any, collectionKey: string) {
    this.removeDetail(id, collectionKey, false);
  }

  private addDetail(
    detail: EntityTransactionDetail,
    collectionKey: string,
    bypassUndoStack: boolean
  ): EntityTransaction<T> {
    if (!this.collection.has(collectionKey)) {
      this.collection.set(collectionKey, []);
    }
    const details = this.collection.get(collectionKey);
    if (details && detail) {
      const found = details.find(e => e.getId() === detail.getId());
      if (!found) {
        detail.state = EntityTransactionState.Added;
        detail.collectionKey = collectionKey;
        details.push(detail);
        if (!bypassUndoStack) {
          this.addToUndoStack(_.cloneDeep(detail));
        }
      }
    }
    return this;
  }

  private removeDetail(
    id: any,
    collectionKey: string,
    bypassUndoStack: boolean
  ): EntityTransaction<T> {
    if (this.collection.has(collectionKey)) {
      const details = this.collection.get(collectionKey);
      if (details) {
        const index = details.findIndex(e => e.getId() === id);
        if (index > -1) {
          if (!bypassUndoStack) {
            const log = _.cloneDeep(details[index]);
            log.state = EntityTransactionState.Deleted;
            this.addToUndoStack(log);
          }
          details.splice(index, 1);
        }
      }
    }
    return this;
  }
}
