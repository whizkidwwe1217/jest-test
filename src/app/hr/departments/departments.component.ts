import { Component, ViewChild } from "@angular/core";
import * as _ from "lodash";
import { HttpService, DataField } from "hordeflow-common";

@Component({
  selector: "app-departments",
  template: `
    <hf-datagrid-view-page
      [dataSource]="'api/v1/organization/department'"
      [fields]="fields"
      [title]="'Departments'"
      [icon]="'applet-executive-team'"
      [enableRowActions]="true"
    >
      <ng-template>
        <app-department-form></app-department-form>
      </ng-template>
    </hf-datagrid-view-page>
  `
})
export class DepartmentsComponent {
  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    { name: "code", text: "Code", enableSearch: true },
    { name: "name", text: "Name", enableSearch: true },
    { name: "description", text: "Description", enableSearch: true }
  ];
}
