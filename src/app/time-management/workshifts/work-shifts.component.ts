import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from "@angular/core";
import * as _ from "lodash";
import * as dateFns from "date-fns";
import { DataField } from "hordeflow-common";

@Component({
  template: `
    <hf-datagrid-view-page
      [dataSource]="'api/v1/time-management/workshift'"
      [fields]="fields"
      [title]="'Work Shifts'"
      [icon]="'applet-executive-team'"
      [enableRowActions]="true"
    >
      <ng-template><app-work-shift-form></app-work-shift-form></ng-template>
    </hf-datagrid-view-page>
    <ng-template #booleanTemplate let-data="data">
      <clr-icon
        [ngStyle]="{ color: data.value ? 'green' : 'red' }"
        [attr.shape]="data.value ? 'check' : 'times'"
      ></clr-icon>
    </ng-template>
  `
})
export class WorkShiftsComponent implements OnInit {
  @ViewChild("booleanTemplate", { static: true }) booleanTemplate: TemplateRef<any>;

  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    { name: "name", text: "Name", enableSearch: true },
    {
      name: "startTime",
      text: "Start Time",
      render: (field, record, value) => dateFns.format(dateFns.parseISO(value), "h:mm a"),
      type: "time",
      enableSearch: false
    },
    {
      name: "endTime",
      text: "End Time",
      render: (field, record, value) => dateFns.format(dateFns.parseISO(value), "h:mm a"),
      type: "time",
      enableSearch: false
    },
    { name: "isFlexiTime", text: "Is Flexi-time", enableSearch: false }
  ];

  ngOnInit() {
    _.find(this.fields, { name: "isFlexiTime" }).template = this.booleanTemplate;
  }
}
