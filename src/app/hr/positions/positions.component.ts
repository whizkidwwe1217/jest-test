import { Component, OnInit, ViewChild } from "@angular/core";
import * as _ from "lodash";
import { DataField } from "hordeflow-common";

@Component({
  template: `
    <hf-datagrid-view-page
      [dataSource]="'api/v1/organization/position'"
      [fields]="fields"
      [title]="'Positions'"
      [icon]="'applet-executive-team'"
      [enableRowActions]="true"
    >
      <ng-template>
        <app-position-form></app-position-form>
      </ng-template>
    </hf-datagrid-view-page>
  `
})
export class PositionsComponent {
  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true, enableSearch: false },
    { name: "code", text: "Code", hidden: false, enableSearch: true },
    { name: "name", text: "Name", hidden: false, enableSearch: true },
    {
      name: "description",
      text: "Description",
      hidden: false,
      enableSearch: true
    }
  ];
}
