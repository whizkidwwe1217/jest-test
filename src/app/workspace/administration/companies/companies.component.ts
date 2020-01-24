import { Component } from "@angular/core";
import { DataField } from "hordeflow-common";

@Component({
  template: `
    <hf-datagrid-view-page
      [title]="'Companies'"
      [icon]="'building'"
      [fields]="fields"
      [dataSource]="'api/v1/company'"
    >
      <ng-template> <app-company-form></app-company-form> </ng-template>
    </hf-datagrid-view-page>
  `
})
export class CompaniesComponent {
  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    { name: "name", text: "Name", enableSearch: true },
    { name: "code", text: "Code", enableSearch: true }
  ];
}
