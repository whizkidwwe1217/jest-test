import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subscription, Subject } from "rxjs";
import { DatagridEditorState } from "./datagrid-editor-state";

@Injectable()
export class DatagridViewPageEditorService implements OnDestroy {
  private _editorStateChange: Subject<DatagridEditorState> = new Subject<DatagridEditorState>();
  private _editorState: DatagridEditorState = {
    accepted: false,
    open: false,
    status: "viewing",
    fields: [],
    dataSource: null
  };

  constructor() {}

  public get editorToggleChange(): Observable<DatagridEditorState> {
    return this._editorStateChange.asObservable();
  }

  public set editorState(value: DatagridEditorState) {
    value.open = !!value.open;
    if (this._editorState.open !== value.open) {
      this._editorState = value;
      this._editorStateChange.next(value);
    }
  }

  public get editorState(): DatagridEditorState {
    return this._editorState;
  }

  ngOnDestroy() {
    this._editorStateChange.unsubscribe();
  }
}
