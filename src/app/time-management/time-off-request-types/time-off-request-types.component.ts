import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from "@angular/core";
import * as _ from "lodash";
import * as dateFns from "date-fns";
import { DataField } from "hordeflow-common";

@Component({
  template: `
    <hf-datagrid-view-page
      [dataSource]="'api/v1/time-management/timeoffrequesttype'"
      [fields]="fields"
      [title]="'Request Types'"
      [icon]="'applet-executive-team'"
      [enableRowActions]="true"
    >
      <ng-template><hrf-time-off-request-type-form></hrf-time-off-request-type-form></ng-template>
    </hf-datagrid-view-page>
  `
})
export class TimeOffRequestTypesComponent {
  @ViewChild("booleanTemplate", { static: true }) booleanTemplate: TemplateRef<any>;

  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    { name: "code", text: "Code", enableSearch: true },
    { name: "name", text: "Name", enableSearch: true }
  ];
}
