import {
  ContentChild,
  TemplateRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  HostBinding
} from "@angular/core";
import {
  FilterGroup,
  Inflector,
  executeDelayed,
  FilterManager,
  DataField,
  DataSource
} from "hordeflow-common";
import { ClrDatagridStateInterface, ClrDatagrid } from "@clr/angular";
import * as _ from "lodash";
import { DatagridRowAction } from "./datagrid-row-action";
import { Subscription } from "rxjs";

class CustomerFilter {}

// @Component({})
export abstract class DatagridBase<T> implements OnInit, OnDestroy {
  pageSize = 50;
  currentPage = 1;
  pageCount = 100;
  total = 0;
  selected: T[] = [];
  hasError = false;
  records: T[] = [];
  filterManager: FilterManager<T>;
  loadAttempts = 0;
  currentState: ClrDatagridStateInterface<T>;
  cdref: ChangeDetectorRef;

  @ContentChild(TemplateRef, { static: false })
  @Input()
  editorTemplate: TemplateRef<any>;
  @ContentChild("rowDetailTemplate", { static: false })
  @Input()
  rowDetailTemplate: TemplateRef<any>;
  @ContentChild("cellTemplate", { static: false })
  @Input()
  cellTemplate: TemplateRef<any>;
  @Output() selectionchanged: EventEmitter<T[]> = new EventEmitter<T[]>();
  @ViewChild(ClrDatagrid, { static: false }) grid: ClrDatagrid;
  @Input() loading = false;
  @Input() enableRowDetails = false;
  @Input() enablePagination = true;
  @Input() enableServerDriven = true;
  @Input() enableRowSelection = false;
  @Input() enableAutoColumns = true;
  @Input() enableForceAutoColumns = false;
  @Input() enableRowActions = false;
  @Input() fields: DataField<T>[] = [];
  @Input() rowActions: DatagridRowAction<T>[];
  @Input() dataSource: DataSource<T>;
  @Input() enableAutoLoad = false;
  @Input() searchString: string;
  @Input() compact: boolean;

  ngOnInit() {
    if (this.enableAutoLoad && this.loadAttempts === 0) this.loadData();
  }

  getGridFields(): DataField<T>[] {
    return _.filter(this.fields, field => !field.excludeFromGrid);
  }

  trackBy = (index, record) => (record && record.id ? record.id : index);
  // https://github.com/vmware/clarity/issues/2265
  // Issues in selection when using trackBy

  private pruneSelection() {
    if (!this.selected) return;
    // build an index for quick search in the cycle below
    const dataIndex = this.buildIndex(this.records);
    for (let i = this.selected.length - 1; i >= 0; i--) {
      const sel = this.selected[i];
      if (!dataIndex[_.get(sel, "id")]) {
        this.selected.splice(i, 1);
      }
    }
  }

  private buildIndex(data) {
    const index = {};
    for (const item of this.records) {
      index[_.get(item, "id")] = item;
    }
    return index;
  }

  selectionChanged(selected) {
    this.selectionchanged.emit(selected);
  }

  public get selectedRecords(): T[] {
    return _.isArray(this.selected) ? this.selected : [this.selected];
  }

  public set selectedRecords(selected: T[]) {
    this.selected = selected;
  }

  buildFilter(): FilterGroup {
    this.filterManager = new FilterManager<T>(this.fields);
    this.filterManager.searchString = this.searchString;
    return this.filterManager.buildFilter();
  }

  subscription$: Subscription;

  loadData() {
    if (this.dataSource) {
      let requestDone = false;
      this.hasError = false;
      if (this.loadAttempts === 0) {
        this.loading = true;
        this.cdref.markForCheck();
      }
      this.subscription$ = this.dataSource
        .page(this.currentPage, this.pageSize)
        .filter(this.buildFilter())
        .select(this.fields)
        .fetch()
        .pipe(
          executeDelayed(
            () => {
              if (!requestDone) {
                this.loading = true;
                this.cdref.markForCheck();
              }
            },
            this.pageSize > 200 ? 100 : 300
          )
        )
        .subscribe(
          response => {
            this.beforeDataChanged(response.data);
            this.records = response.data;
            this.total = response.total;
            this.loadAttempts++;
            // we need setTimeout to allow ng lifecycle to complete last update
            // no timeout value needed
            setTimeout(() => {
              // remove items that are gone out of the data set
              // this is something that the grid does not handle automagically
              if (this.records) this.pruneSelection();
              if (this.grid && this.grid.rows) this.grid.rows.notifyOnChanges();
            });
          },
          () => {
            this.records = [];
            this.total = 0;
            requestDone = true;
            this.loading = false;
            this.hasError = true;
            this.cdref.markForCheck();
          },
          () => {
            requestDone = true;
            this.loading = false;
            this.cdref.markForCheck();
          }
        );
    }
  }

  async ngOnDestroy() {
    if (this.subscription$) {
      await this.subscription$.unsubscribe();
    }
  }

  beforeDataChanged(data: T[]) {
    if (data) {
      const firstRecord = data[0];
      this.generateColumns(firstRecord);
    }
  }

  private generateColumns(record: T) {
    if (
      record &&
      (this.fields.length === 0 || this.enableForceAutoColumns) &&
      this.enableAutoColumns
    ) {
      const autoFields: DataField<T>[] = [];
      const keys = Object.keys(record);
      for (const k of keys) {
        const name = k;
        const text = new Inflector(k).titleize().value;
        autoFields.push({
          name: name,
          text: text,
          enableSearch: true,
          template: null
        });
      }

      this.fields = _.unionBy(this.fields, autoFields, "name");
      this.cdref.markForCheck();
    }
  }

  getRenderValue(record: T, field: DataField<T>, index: number) {
    const value = this.getRecordValue(record, field);
    return value || "";
  }

  getRecordValue(record: T, field: DataField<T>) {
    return _.get(record, field.name);
  }

  buildDatagridFilterState(newFilters: any[]) {
    if (!this.currentState) return null;
    const state: ClrDatagridStateInterface = {
      page: this.currentState.page,
      sort: this.currentState.sort,
      filters: _.union(this.currentState.filters, newFilters)
    };

    return state;
  }

  refresh(state: ClrDatagridStateInterface) {
    const filters: { [key: string]: any[] } = {};
    if (state.filters) {
      for (const filter of state.filters) {
        if (filter instanceof CustomerFilter) {
        } else {
          const { property, value } = <{ property: string; value: string }>filter;
          filters[property] = [value];
        }
      }
    }
    this.currentState = state;

    if (this.enableAutoLoad && state && state.page && this.loadAttempts > 0) {
      this.pageSize = state.page.size;
      this.loadData();
    }
  }
}
