import { Component, OnInit, ViewChild } from "@angular/core";
import * as _ from "lodash";
import { LinkDataField, DataField } from "hordeflow-common";

@Component({
  template: `
    <hf-datagrid-view-page
      [title]="'Locations'"
      [icon]="'map-marker'"
      [fields]="fields"
      [enableRowActions]="true"
      [dataSource]="'api/v1/location'"
    >
      <ng-template> <app-location-form></app-location-form> </ng-template>
    </hf-datagrid-view-page>
  `
})
export class LocationsComponent {
  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    { name: "code", text: "Code", hidden: false, enableSearch: true },
    { name: "name", text: "Name", hidden: false, enableSearch: true },
    {
      name: "phoneNumber",
      text: "Phone Number",
      hidden: false,
      enableSearch: true
    },
    {
      name: "email",
      text: "Email",
      hidden: false,
      enableSearch: true
      //style: { "word-break": "break-all" }
    },
    {
      name: "faxNumber",
      text: "Fax Number",
      hidden: false,
      enableSearch: true
    },
    new LinkDataField<any>({ name: "website", text: "Website" }),
    // {
    // 	name: "website",
    // 	text: "Website",
    // 	hidden: false,
    // 	enableSearch: true
    // 	//style: { "word-break": "break-all" }
    // },
    { name: "notes", text: "Notes", hidden: true, enableSearch: true }
  ];
}
