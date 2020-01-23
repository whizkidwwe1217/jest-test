import {
  Component,
  Input,
  ViewChild,
  TemplateRef,
  ContentChild,
  Output,
  EventEmitter,
  ContentChildren,
  QueryList,
  AfterViewInit,
  ElementRef,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { DatagridExportFactory } from "./export/datagrid-export";
import {
  FilterRule,
  Inflector,
  HttpService,
  DataWebApiDataSource,
  DataField,
  DataSource,
  UriResource
} from "hordeflow-common";
import * as _ from "lodash";
import { Observable, of, throwError, forkJoin, fromEvent, zip, EMPTY } from "rxjs";
import {
  switchMap,
  exhaustMap,
  exhaust,
  concatMap,
  delay,
  catchError,
  tap,
  finalize
} from "rxjs/operators";
import { DatagridCommand } from "./datagrid-command";
import { Router, ActivatedRoute } from "@angular/router";
import { DatagridViewPageEditorService } from "./editor/datagrid-view-page-editor.service";
import { DatagridEditor } from "./editor/datagrid-editor";
import { DatagridBase } from "./grid/datagrid-base";
import { DatagridRowAction } from "./grid/datagrid-row-action";
import { ClrNotificationService } from "../notification/notification.service";
import { HfSidePanel } from "../side-panel/side-panel";
import { HfCommandBar } from "../command-bar/command-bar";
import { ErrorMessage } from "./error/error-message";

@Component({
  selector: "hf-datagrid-view-page",
  styleUrls: ["./datagrid-view-page.scss"],
  templateUrl: "./datagrid-view-page.html",
  providers: [
    DatagridViewPageEditorService,
    ClrNotificationService,
    {
      provide: DataWebApiDataSource,
      useClass: DataWebApiDataSource,
      deps: [HttpService]
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridViewPage<T> implements AfterViewInit, OnInit {
  hasSelection = false;
  searchString = "";
  error: ErrorMessage;
  successMessage = "";
  compactToolbars = false;
  needsConfirmation = false;
  toggleEditor = false;
  filters: FilterRule[];
  _editorTitle: string;
  filterHidden: boolean;
  @ViewChild("grid", { static: false }) grid: DatagridBase<T>;
  @ContentChild(TemplateRef, { static: false })
  editorTemplate: TemplateRef<any>;
  @ContentChild("cellTemplate", { static: false })
  @Input()
  cellTemplate: TemplateRef<any>;
  @ViewChild("commandbar", { static: true }) commandbar: HfCommandBar;
  @ViewChild("sidePanel", { static: false }) sidePanel: HfSidePanel;
  @ContentChild(TemplateRef, { static: false }) sidePanelEditorTemplate: TemplateRef<
    DatagridEditor
  >;
  @ContentChild(DatagridEditor, { static: false }) editor: DatagridEditor;
  @ViewChild("btnDelete", { static: true }) btnDelete: ElementRef<any>;

  @Output() add: EventEmitter<T[]> = new EventEmitter<T[]>();
  @Output() edit: EventEmitter<T[]> = new EventEmitter<T[]>();
  @Output() delete: EventEmitter<T[]> = new EventEmitter<T[]>();
  @Output("selectionchange") selectionChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() dataSource: DataSource<T> | string;
  @Input() title: string = "";
  @Input() subtitle: string;
  @Input() editorMode: "custom" | "sidepanel" | "modal" | "page" = "sidepanel";
  @Input() editorUrl: string;
  @Input() icon: string;
  @Input() hideFilters = true;
  @Input() stretched = true;
  @Input() focusOnSearchBox = true;
  @Input() noHeader = false;
  @Input() addButtonText = "Add";
  @Input() useSmallToolbarButtons = false;
  @Input() refreshOnEditorAccepted = true;
  @Input() dismissEditorOnAccepted = true;
  @Input() rowDetailTemplate: TemplateRef<any>;
  @Input() rowActions: DatagridRowAction<T>[] = [];
  @Input() compact: boolean;
  @Input() sidePanelDirection: string = "right";
  _fields: DataField<T>[] | string[] | string = [];

  @Input() get fields(): DataField<T>[] | string[] | string {
    if (typeof this._fields === "string") {
      return this._fields.split(",").map(f => {
        const df: DataField<T> = {
          name: f,
          text: new Inflector(f).humanize().value,
          enableSearch: true
        };

        return df;
      });
    } else {
      if (typeof this._fields[0] === "string") {
        return (this._fields as string[]).map((f: string) => {
          const df: DataField<T> = {
            name: f,
            text: new Inflector(f).humanize().value,
            enableSearch: true
          };

          return df;
        });
      } else {
        return this._fields as DataField<T>[];
      }
    }
  }
  set fields(fields: DataField<T>[] | string[] | string) {
    this._fields = fields;
  }

  @Input() selectionMode = "none";
  @Input() enableAdd = true;
  @Input() enableEdit = true;
  @Input() enableDelete = true;
  @Input() enableRowDetails = false;
  @Input() enablePagination = true;
  @Input() enableAutoLoad = true;
  @Input() enableRowSelection = false;
  @Input() enableServerDriven = true;
  @Input() enableRowActions = false;
  @Input() enableAutoColumns = true;
  @Input() enableExport = true;
  @Input() enableImport = false;
  @Input() enableBreadcrumb = false;
  @Input() enableForceAutoColumns = false;
  @Input() enableSearch = true;
  @Input() bypassDeleteConfirmation = false;

  @Input() set editorTitle(value) {
    if (_.isEmpty(value) && this.title)
      this._editorTitle = new Inflector(this.title).singularize().value;
    else this._editorTitle = value;
  }

  get editorTitle(): string {
    if (_.isEmpty(this._editorTitle))
      return (this._editorTitle = new Inflector(this.title).singularize().value);
    return this._editorTitle;
  }

  @Input() commands: DatagridCommand[];

  commandItems: DatagridCommand[] = [];

  constructor(
    private service: DatagridViewPageEditorService,
    private datagridService: DatagridViewPageEditorService,
    private notificationService: ClrNotificationService,
    private defaultDatasource: DataWebApiDataSource<any>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.service.editorToggleChange.subscribe(state => {
      this.toggleEditor = state.open;
      this.error = null;
      this.successMessage = null;
      if (!state.open && this.refreshOnEditorAccepted && state.accepted) {
        this.refresh();
      }
    });
  }

  initializeCommands() {
    let defaultCommands: DatagridCommand[] = [
      {
        name: "btnAdd",
        text: _.defaultTo(this.addButtonText, "Add"),
        icon: "plus",
        click: e => this.onAdd()
      },
      {
        name: "btnEdit",
        text: "Edit",
        disabled: true,
        icon: "pencil",
        click: e => this.onEdit()
      },
      {
        name: "btnRequestDeletion",
        text: "Delete",
        icon: "trash",
        disabled: true
      },
      {
        name: "btnRefresh",
        text: "Refresh",
        icon: "refresh",
        click: e => this.refresh()
      },
      {
        name: "btnExport",
        text: "Export",
        icon: "export",
        overflow: true,
        items: [
          {
            name: "btnExportCsv",
            text: "CSV",
            icon: "file",
            click: e => this.export("csv")
          },
          {
            name: "btnExportJson",
            text: "JSON",
            icon: "code",
            click: e => this.export("json")
          },
          {
            name: "btnExportExcel",
            text: "Excel",
            icon: "code",
            click: e => this.export("excel")
          }
        ]
      }
    ];

    if (this.selectionMode === "none") {
      defaultCommands = _.filter(
        defaultCommands,
        c => !["btnEdit", "btnRequestDeletion"].includes(c.name)
      );
    }

    if (!this.enableAdd) {
      defaultCommands = _.filter(defaultCommands, c => !["btnAdd"].includes(c.name));
    }

    if (!this.enableEdit) {
      defaultCommands = _.filter(defaultCommands, c => !["btnEdit"].includes(c.name));
    }

    if (!this.enableDelete) {
      defaultCommands = _.filter(defaultCommands, c => !["btnRequestDeletion"].includes(c.name));
    }

    this.commandItems = _.concat(defaultCommands, this.commands || []);
  }

  onSizeChanged(e) {
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeEventSubscriptions();
    }, 100);
  }

  ngOnInit() {
    this.initializeCommands();
    this.addDefaultRowActions();
  }

  addDefaultRowActions() {
    if (this.selectionMode === "none") {
      const deleteAction = (record, index, event) => {
        this.grid.selectedRecords = [];
        this.grid.selectedRecords.push(record);
        if (this.bypassDeleteConfirmation) {
          this.subscribeToDeleteEvent(of(true).pipe(exhaustMap(() => this.deleteRecord())));
        } else {
          of(true).subscribe(x => (this.needsConfirmation = true));
        }
      };
      const actions: DatagridRowAction<T>[] = [];
      if (this.enableEdit)
        actions.push({
          name: "btnEdit",
          text: "Edit",
          icon: "edit",
          perform: (record, index, event) => {
            this.grid.selectedRecords = [];
            this.grid.selectedRecords.push(record);
            this.onEdit();
          }
        });
      if (this.enableDelete)
        actions.push({
          name: "btnDelete",
          text: "Delete",
          icon: "trash",
          perform: deleteAction
        });
      this.rowActions = _.concat(actions, this.rowActions);
    }
  }

  getDataSource(): DataSource<T> {
    if (!_.isString(this.dataSource)) return this.dataSource;
    const resource = new UriResource().setUrl(this.dataSource);
    this.defaultDatasource.setResource(resource);
    return this.defaultDatasource;
  }

  // #region Toolbar actions

  refresh() {
    this.grid.loadData();
  }

  onAdd(): void {
    if (!this.sidePanelEditorTemplate) return;
    this.add.emit(this.grid.selectedRecords);
    if (this.editorMode === "page") {
      this.router.navigate([this.editorUrl], {
        relativeTo: this.activatedRoute
      });
    } else {
      this.service.editorState = {
        accepted: false,
        open: true,
        status: "adding",
        fields: this.fields as DataField<T>[],
        payload: this.grid.selectedRecords
      };
    }
  }

  onEdit(): void {
    this.edit.emit(this.grid.selectedRecords);
    if (this.editorMode === "page") {
      this.router.navigate([_.first(this.grid.selectedRecords)["id"]], {
        relativeTo: this.activatedRoute
      });
    } else {
      this.service.editorState = {
        accepted: false,
        open: true,
        status: "editing",
        payload: this.grid.selectedRecords,
        fields: this.fields as DataField<T>[],
        dataSource: this.getDataSource()
      };
    }
  }

  isEditorDirty(): boolean {
    return this.editor && this.editor.form && this.editor.form.dirty;
  }

  /**
   * An observable that deletes the selected record(s).
   */
  deleteRecord() {
    const selection = _.filter(this.grid.selectedRecords, s => _.has(s, "id"));
    const entityIds = { entityIds: _.map(selection, i => _.get(i, "id")) };
    const o$: Observable<any>[] = [];
    o$.push(
      this.getDataSource()
        .destroyBatchById(entityIds)
        .pipe(catchError(error => of(error)))
    );
    return forkJoin(o$);
  }

  /**
   * Called and throws a notification after deleting a record. If delete confirmation is enabled, the dialog is closed.
   */
  subscribeToDeleteEvent(obs: Observable<any>) {
    obs.subscribe(
      response => {
        const okResponses = _.filter(
          response,
          r => r.ok && [200, 201, 202, 204].includes(r.status)
        );
        if (okResponses.length > 0) {
          this.notifySuccess(`Deleted ${okResponses.length.toString()} record(s).`);
          this.refresh();
        } else {
          this.notifyFailed("There was a problem with deleting the selected record(s).");
        }
        this.needsConfirmation = false;
        this.cdr.markForCheck();
      },
      error => {
        this.notifyFailed("There was a problem with deleting the selected record(s).");
        this.needsConfirmation = false;
        this.cdr.markForCheck();
      }
    );
  }

  // Subscribe to events using observables to use RxJS exhaustMap operator that prevents users from double sending request when rapidly clicking on a button
  initializeEventSubscriptions() {
    let $delete = fromEvent(this.btnDelete.nativeElement, "click");

    const btnRequestDeletion = this.commandbar.commandBarItems.filter(
      item => item.name === "btnRequestDeletion"
    );

    if (btnRequestDeletion.length > 0) {
      if (this.bypassDeleteConfirmation) {
        $delete = fromEvent(btnRequestDeletion[0].getElement().querySelector("button"), "click");
      } else {
        fromEvent(btnRequestDeletion[0].getElement().querySelector("button"), "click").subscribe(
          x => {
            this.needsConfirmation = true;
            this.cdr.markForCheck();
          }
        );
      }
    }

    this.subscribeToDeleteEvent($delete.pipe(exhaustMap(() => this.deleteRecord())));
  }

  onSelectionChanged(selected) {
    this.hasSelection = !_.isEmpty(selected);
    this.selectionChange.emit(selected);
    this.setCommandBarItemsState();
  }

  /**
   * Disables the Edit and Delete buttons in the command bar if there's no selection in the grid.
   */
  setCommandBarItemsState() {
    const btnEdit = this.commandItems[_.findIndex(this.commandItems, { name: "btnEdit" })];
    if (btnEdit)
      btnEdit.disabled = !this.hasSelection || !this.enableEdit || this.selectionMode === "none";
    const btnDelete = this.commandItems[
      _.findIndex(this.commandItems, { name: "btnRequestDeletion" })
    ];
    if (btnDelete)
      btnDelete.disabled =
        !this.hasSelection || !this.enableDelete || this.selectionMode === "none";
  }

  /**
   * Applies filtering to the grid based on the keyword typed in the search command item of the command bar.
   */
  onSearchKeyChanged(e) {
    this.grid.searchString = e;
    this.refresh();
    if (_.isEmpty(e)) this.filters = [];
    else this.filters = this.grid.filterManager.filterGroup.groups[0].rules;
  }

  // #endregion

  // #region Editor

  /**
   * This is called when the grid editor Save button is clicked. This validates the editor's form values and perform CRUD operation.
   */
  accept(): Observable<T> {
    return of({} as T).pipe(
      switchMap(() => {
        this.editor.validate();
        if (this.editor.form.valid) {
          const record = this.editor.form.value;
          const payload = this.datagridService.editorState.payload;

          if (this.datagridService.editorState.status === "adding") {
            delete record.id;
            return this.getDataSource().create(record);
          } else if (this.datagridService.editorState.status === "editing") {
            return this.getDataSource().update(
              _.merge(this.editor.record, record),
              _.get(_.first(payload.records), "id")
            );
          } else if (this.datagridService.editorState.status === "deleting") {
            return this.getDataSource().destroy(_.get(_.first(payload.records), "id"));
          }
        }
        return throwError({
          title: "The form is invalid.",
          message: "The form has invalid values.",
          code: "596742",
          details: [this.editor.getErrors()]
        });
      })
    );
  }

  onException(error) {
    if (_.has(error, "title")) {
      this.error = error;
    } else
      this.error = {
        title: "Error saving record.",
        message: "Unable to save records",
        code: "234234",
        details: [error]
      };
    this.successMessage = null;

    // Scroll to error message component
    document.querySelector(".hf-side-panel-content").scrollTop = 0;
  }

  onOpenChange() {
    this.datagridService.editorState = {
      accepted: false,
      open: false,
      fields: this.fields as DataField<T>[],
      status: "closed"
    };
    this.error = null;
    this.successMessage = null;
  }

  /**
   * Triggers when the grid editor's CRUD operation is successful.
   */
  accepted() {
    this.error = null;
    const msg = "Success... Everything is good!";
    this.successMessage = msg;
    if (this.dismissEditorOnAccepted) {
      setTimeout(() => {
        this.notifySuccess(msg);
      }, 200);
    }

    // Give button success animation enough time to finish
    setTimeout(() => {
      this.datagridService.editorState = {
        accepted: true,
        open: false || !this.dismissEditorOnAccepted,
        fields: this.fields as DataField<T>[],
        status: "closed"
      };
    }, 300);
  }

  notifySuccess(message): void {
    this.notificationService.openNotification(message, {
      progressbar: false,
      dismissable: true,
      notificationType: "success"
    });
  }

  notifyFailed(message): void {
    this.notificationService.openNotification(message, {
      progressbar: false,
      dismissable: true,
      notificationType: "danger",
      timeout: 5000
    });
  }

  // #endregion

  // #region Other features

  /**
   * Exports the current data in the grid to CSV, JSON or Excel format.
   */
  export(type: "csv" | "json" | "excel") {
    const factory = new DatagridExportFactory(type);
    const filename = `${this.title}.${type === "excel" ? "xlsx" : type}`;
    const file = factory.createExporter().export(this.grid.records, {
      firstRecordAsHeader: true,
      filename: filename,
      title: this.title
    });

    if (type !== "excel") {
      const link = document.createElement("a");
      link.setAttribute("href", file);
      link.setAttribute("download", filename);
      link.click();
      link.remove();
    }
    this.notifySuccess("Data exported successfully.");
  }

  // #endregion
}
