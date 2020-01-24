import { Component, OnInit, ViewChild } from "@angular/core";
import * as _ from "lodash";
import { DataField } from "hordeflow-common";

@Component({
  template: `
    <hf-datagrid-view-page
      [dataSource]="'api/v1/organization/team'"
      [fields]="fields"
      [title]="'Teams'"
      [icon]="'applet-executive-team'"
      [enableRowActions]="true"
    >
      <ng-template>
        <app-team-form></app-team-form>
      </ng-template>
    </hf-datagrid-view-page>
  `
})
export class TeamsComponent {
  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    { name: "code", text: "Code", enableSearch: true },
    { name: "name", text: "Name", enableSearch: true },
    { name: "description", text: "Description", enableSearch: true }
  ];
}
