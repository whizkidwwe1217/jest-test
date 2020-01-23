import { Component, OnInit, Input, TemplateRef } from "@angular/core";
import * as _ from "lodash";
import {
  HttpService,
  Inflector,
  DataWebApiDataSource,
  DataField,
  DataSource,
  UriResource
} from "hordeflow-common";
import { DatagridCommand } from "../datagrid-command";
import { DatagridBase } from "../grid/datagrid-base";

@Component({
  selector: "hf-data-table",
  templateUrl: "data-table.html",
  styleUrls: ["data-table.scss"],
  providers: [
    {
      provide: DataWebApiDataSource,
      useClass: DataWebApiDataSource,
      deps: [HttpService]
    }
  ]
})
export class DataTable<T> extends DatagridBase<T> implements OnInit {
  _columns: DataField<T>[] | string[] | string = [];
  @Input() template: TemplateRef<any>;

  @Input() get columns(): DataField<T>[] | string[] | string {
    if (typeof this._columns === "string") {
      return this._columns.split(",").map(f => {
        const df: DataField<T> = {
          name: f,
          text: new Inflector(f).humanize().value,
          enableSearch: true
        };

        return df;
      });
    } else {
      if (typeof this._columns[0] === "string") {
        return (this._columns as string[]).map((f: string) => {
          const df: DataField<T> = {
            name: f,
            text: new Inflector(f).humanize().value,
            enableSearch: true
          };

          return df;
        });
      } else {
        return this._columns as DataField<T>[];
      }
    }
  }

  set columns(columns: DataField<T>[] | string[] | string) {
    this._columns = columns;
    this.fields = this.columns as DataField<T>[];
  }

  isEditorOpen: boolean;

  commands: DatagridCommand[] = [
    {
      name: "actAdd",
      text: "Add",
      icon: "plus",
      click: e => (this.isEditorOpen = true)
    },
    {
      name: "actImport",
      text: "Import"
    }
  ];

  constructor(private defaultDatasource: DataWebApiDataSource<any>) {
    super();
    this.dataSource = this.getDataSource();
  }

  ngOnInit() {
    // this.dataSource = this.getDataSource();
    // this.loadData();
  }

  getDataSource(): DataSource<T> {
    if (!_.isString(this.dataSource)) return this.dataSource;
    const resource = new UriResource().setUrl(this.dataSource);
    this.defaultDatasource.setResource(resource);
    return this.defaultDatasource;
  }
}
