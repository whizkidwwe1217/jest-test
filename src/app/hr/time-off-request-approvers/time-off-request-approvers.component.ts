import { Component, ViewChild, OnInit, TemplateRef } from "@angular/core";
import * as _ from "lodash";
import { DataField } from "hordeflow-common";

@Component({
  selector: "hrf-time-off-request-approver",
  template: `
    <hf-datagrid-view-page
      [dataSource]="'api/v1/time-management/timeoffrequestapprover'"
      [fields]="fields"
      [title]="'Approvers'"
      [icon]="'applet-executive-team'"
      [enableRowActions]="true"
    >
      <ng-template>
        <app-time-off-request-approver-form></app-time-off-request-approver-form>
      </ng-template>
    </hf-datagrid-view-page>
    <ng-template #booleanTemplate let-data="data">
      <clr-icon
        [ngStyle]="{ color: data.value ? 'green' : 'red' }"
        [attr.shape]="data.value ? 'check' : 'times'"
      ></clr-icon>
    </ng-template>
    <ng-template #anchorRequester let-data="data">
      <a routerLink="../employees/{{ data.record.requesterId }}">{{ data.value | person }}</a>
    </ng-template>
    <ng-template #anchorApprover let-data="data">
      <a routerLink="../employees/{{ data.record.approverId }}">{{ data.value | person }}</a>
    </ng-template>
  `
})
export class TimeOffRequestApproversComponent implements OnInit {
  @ViewChild("booleanTemplate", { static: true }) booleanTemplate: TemplateRef<any>;
  @ViewChild("anchorRequester", { static: true }) anchorRequester: TemplateRef<any>;
  @ViewChild("anchorApprover", { static: true }) anchorApprover: TemplateRef<any>;
  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    { name: "approverId", text: "Approver Id", enableSearch: false, hidden: true },
    { name: "approver", text: "Approver", enableSearch: false },
    { name: "approver.code", text: "Approver Code", enableSearch: true },
    { name: "requesterId", text: "Employee Id", enableSearch: false, hidden: true },
    {
      name: "requester.lastName",
      text: "Employee Last Name",
      enableSearch: true,
      hidden: true,
      excludeFromGrid: true
    },
    { name: "requester", text: "Employee", enableSearch: false },
    { name: "requester.code", text: "Employee Code", enableSearch: true },
    { name: "requirement", text: "Requirement", enableSearch: true },
    { name: "level", text: "Level", enableSearch: true }
  ];

  ngOnInit() {
    _.find(this.fields, { name: "requester" }).template = this.anchorRequester;
    _.find(this.fields, { name: "approver" }).template = this.anchorApprover;
  }
}
