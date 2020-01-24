import { Component, ViewChild, OnInit, TemplateRef } from "@angular/core";
import * as _ from "lodash";
import * as dateFns from "date-fns";
import { HttpService, DataField } from "hordeflow-common";
import { HttpParams } from "@angular/common/http";
import { ClrNotificationService, DatagridCommand, DatagridViewPage } from "hordeflowkit";

@Component({
  selector: "hrf-time-off-request",
  styles: [
    `
      .label {
        border-radius: 2px;
      }
    `
  ],
  template: `
    <hf-datagrid-view-page
      #gridView
      [dataSource]="'api/v1/time-management/timeoffrequest'"
      [fields]="fields"
      [title]="'Time-off Requests'"
      [icon]="'applet-executive-team'"
      [enableRowActions]="true"
      (selectionchange)="selectionChange($event)"
      [selectionMode]="'multi'"
      [commands]="commands"
    >
      <ng-template>
        <app-time-off-request-form></app-time-off-request-form>
      </ng-template>
    </hf-datagrid-view-page>
    <ng-template #statusTemplate let-data="data">
      <span class="label" [ngClass]="getStatusClasses(data.value)">
        <clr-icon
          style="margin-right: 0.25rem"
          [attr.shape]="getStatusShape(data.value)"
        ></clr-icon>
        {{ data.value | inflector: "titleize" }}
      </span>
    </ng-template>
    <ng-template #anchorPerson let-data="data">
      <a routerLink="../../hr/employees/{{ data.record.employeeId }}">{{ data.value | person }}</a>
    </ng-template>
  `,
  providers: [ClrNotificationService]
})
export class TimeOffRequestsComponent implements OnInit {
  @ViewChild("statusTemplate", { static: true }) statusTemplate: TemplateRef<any>;
  @ViewChild("anchorPerson", { static: true }) anchorPerson: TemplateRef<any>;
  @ViewChild("gridView", { static: false }) gridView: DatagridViewPage<any>;

  commands: DatagridCommand[] = [
    {
      name: "cmdSubmit",
      text: "Submit",
      icon: "pinboard",
      click: e => {
        const request = _.first(
          _.map(this.selectedRequests, r => {
            return {
              id: r.id,
              notes: r.notes,
              employeeId: r.employeeId,
              reason: r.reason,
              status: r.status,
              requestTypeId: 1,
              startDate: r.startDate,
              endDate: r.endDate,
              concurrencyStamp: r.concurrencyStamp,
              concurrencyTimeStamp: r.concurrencyTimeStamp,
              timeOffRequestTypeId: r.timeOffRequestTypeId
            };
          })
        );

        this.http.process("./api/v1/time-management/timeoffrequest/submit", request).subscribe(
          res => {
            this.notifySuccess("Time-off Request was submitted!");
            this.gridView.grid.loadData();
          },
          res => {
            this.notifyFailed(res.error.Details);
          }
        );
      }
    },
    {
      name: "cmdApprove",
      text: "Approve",
      icon: "thumbs-up",
      click: e => {
        const request = _.first(
          _.map(this.selectedRequests, r => {
            return {
              id: r.id,
              notes: r.notes,
              employeeId: r.employeeId,
              reason: r.reason,
              status: r.status,
              requestTypeId: 1,
              startDate: r.startDate,
              endDate: r.endDate,
              concurrencyStamp: r.concurrencyStamp,
              concurrencyTimeStamp: r.concurrencyTimeStamp,
              timeOffRequestTypeId: r.timeOffRequestTypeId
            };
          })
        );
        const params = new HttpParams().set("approverId", "c4b2f156-2934-495e-bd68-08d73e5d1f54");
        this.http
          .process("./api/v1/time-management/timeoffrequest/approve", request, params)
          .subscribe(
            res => {
              this.notifySuccess("Time-off Request was approved!");
              this.gridView.grid.loadData();
            },
            res => {
              this.notifyFailed(res.error.Details);
            }
          );
      }
    },
    {
      name: "cmdReject",
      text: "Reject",
      icon: "thumbs-down",
      click: e => {
        const request = _.first(
          _.map(this.selectedRequests, r => {
            return {
              id: r.id,
              notes: r.notes,
              employeeId: r.employeeId,
              reason: r.reason,
              status: r.status,
              requestTypeId: 1,
              startDate: r.startDate,
              endDate: r.endDate,
              concurrencyStamp: r.concurrencyStamp,
              concurrencyTimeStamp: r.concurrencyTimeStamp,
              timeOffRequestTypeId: r.timeOffRequestTypeId
            };
          })
        );
        const params = new HttpParams().set("approverId", "c4b2f156-2934-495e-bd68-08d73e5d1f54");
        this.http
          .process("./api/v1/time-management/timeoffrequest/reject", request, params)
          .subscribe(
            res => {
              this.notifySuccess("Time-off Request was rejected!");
              this.gridView.grid.loadData();
            },
            res => {
              this.notifyFailed(res.error.Details);
            }
          );
      }
    }
  ];

  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    { name: "concurrencyStamp", text: "Concurrency Stamp", hidden: true },
    { name: "concurrencyTimeStamp", text: "Concurrency TimeStamp", hidden: true },
    { name: "timeOffRequestTypeId", text: "Request Type Id", hidden: true },
    { name: "employeeId", text: "Employee Id", enableSearch: false, hidden: true },
    { name: "employee", text: "Employee", enableSearch: false },
    { name: "requestType.code", text: "Type", enableSearch: false },
    { name: "reason", text: "Reason", enableSearch: true },
    {
      name: "startDate",
      text: "Start Date",
      enableSearch: true,
      render: (field, record, value) => dateFns.format(dateFns.parseISO(value), "MM/dd/yyyy")
    },
    {
      name: "endDate",
      text: "End Date",
      enableSearch: true,
      render: (field, record, value) => dateFns.format(dateFns.parseISO(value), "MM/dd/yyyy")
    },
    {
      name: "duration",
      text: "Duration",
      enableSearch: false,
      render: (field, record, value) => {
        const startDate = dateFns.parseISO(record.startDate);
        const endDate = dateFns.parseISO(record.endDate);

        return dateFns.isSameDay(startDate, endDate)
          ? "1 day"
          : dateFns.formatDistance(startDate, endDate);
      }
    },
    { name: "status", text: "Status", enableSearch: true },
    { name: "notes", text: "Notes", enableSearch: true }
  ];

  selectedRequests: any[] = [];

  constructor(private notification: ClrNotificationService, private http: HttpService) {}

  notifySuccess(message): void {
    this.notification.openNotification(message, {
      progressbar: false,
      dismissable: true,
      notificationType: "success"
    });
  }

  notifyFailed(message): void {
    this.notification.openNotification(message, {
      progressbar: false,
      dismissable: true,
      notificationType: "danger",
      timeout: 5000
    });
  }

  selectionChange(selected) {
    this.selectedRequests = selected;
  }

  ngOnInit() {
    _.find(this.fields, { name: "employee" }).template = this.anchorPerson;
    _.find(this.fields, { name: "status" }).template = this.statusTemplate;
  }

  getStatusClasses(status) {
    switch (status) {
      case "Rejected":
        return "label-danger";
      case "Approved":
        return "label-success";
      case "PartiallyApproved":
        return "label-info";
      case "Submitted":
        return "label-warning";
      default:
        return "label";
    }
  }

  getStatusShape(status) {
    switch (status) {
      case "Draft":
        return "note";
      case "Submitted":
        return "pinboard";
      case "Rejected":
        return "thumbs-down";
      case "Approved":
        return "thumbs-up";
      case "PartiallyApproved":
      case "Pending":
        return "history";
      default:
        return "file";
    }
  }
}
