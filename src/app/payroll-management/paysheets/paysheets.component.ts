import { Component } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import * as dateFns from "date-fns";
import { DataField } from "hordeflow-common";

@Component({
  template: `
    <hf-datagrid-view-page
      [title]="'Paysheets'"
      [icon]="'calculator'"
      [fields]="fields"
      [enableRowActions]="true"
      [dataSource]="'api/v1/payroll'"
    >
      <ng-template> <app-paysheet-form></app-paysheet-form> </ng-template>
    </hf-datagrid-view-page>
  `
})
export class PaysheetsComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    {
      name: "name",
      text: "Name",
      hidden: false,
      enableSearch: true
    },
    {
      name: "description",
      text: "Description",
      hidden: false,
      enableSearch: true
    },
    {
      name: "startDate",
      text: "Period Start",
      type: "date",
      enableSearch: true,
      render: (field, record, value) => dateFns.format(dateFns.parseISO(value), "MM/dd/yyyy")
    },
    {
      name: "endDate",
      text: "Period End",
      type: "date",
      enableSearch: true,
      render: (field, record, value) => dateFns.format(dateFns.parseISO(value), "MM/dd/yyyy")
    }
  ];

  // onAccepted(value) {
  // 	if (value.mode === "new") {
  // 		setTimeout(() => {
  // 			this.name = value.record.name;
  // 			this.router.navigate([value.record.id], {
  // 				relativeTo: this.route,
  // 				queryParams: { name: value.record.name, show_picker: true }
  // 			});
  // 		}, 100);
  // 	}
  // }
}
