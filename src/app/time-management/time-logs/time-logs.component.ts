import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import * as _ from "lodash";
import * as dateFns from "date-fns";
import {
  HttpService,
  DataSource,
  DataWebApiDataSource,
  DataField,
  UriResource
} from "hordeflow-common";
import { PersonPipe } from "src/app/shared/pipes/person.pipe";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  template: `
    <hf-datagrid-view-page
      [dataSource]="dataSource"
      [fields]="fields"
      [title]="'Time Logs'"
      [icon]="'applet-executive-team'"
      [enableRowActions]="false"
      [selectionMode]="'multi'"
      [compact]="true"
    >
      <ng-template><hrf-time-log-form></hrf-time-log-form></ng-template>
    </hf-datagrid-view-page>
    <ng-template #logTypeTemplate let-data="data">
      <span
        class="label"
        [ngClass]="{
          'label-success': data.record.logType === 'CheckIn',
          'label-danger': data.record.logType === 'CheckOut'
        }"
        >{{ renderTime(data) }}
      </span>
    </ng-template>
    <ng-template #anchorPerson let-data="data">
      <a routerLink="../../hr/employees/{{ data.record.employee.id }}">{{ data.value | person }}</a>
    </ng-template>
  `,
  providers: [
    {
      provide: DataSource,
      useClass: DataWebApiDataSource,
      deps: [HttpService]
    }
  ]
})
export class TimeLogsComponent implements OnInit {
  @ViewChild("logTypeTemplate", { static: true }) logTypeTemplate: TemplateRef<any>;
  @ViewChild("anchorPerson", { static: true }) anchorPerson: TemplateRef<any>;

  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    {
      name: "employee",
      text: "Employee",
      enableSearch: true
    },
    {
      name: "date",
      text: "Date",
      enableSearch: true,
      type: "date",
      render: (field, record, value, index) => dateFns.format(dateFns.parseISO(value), "MM/dd/yyyy")
    },
    {
      name: "checkTime",
      text: "Log Time",
      enableSearch: true,
      type: "time"
    },
    {
      name: "logType",
      text: "Log Type",
      enableSearch: true,
      render: (field, record, value, index) => {
        return value === "CheckIn" ? "In" : "Out";
      }
    },
    {
      name: "isNextDay",
      text: "Next Day?",
      hidden: true,
      enableSearch: false,
      excludeFromGrid: true
    },
    {
      name: "remarks",
      text: "Remarks",
      enableSearch: false
    }
  ];

  constructor(
    public dataSource: DataSource<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const resource: UriResource = new UriResource()
      .setUrl("api/v1/time-management/timelog")
      .setListUrl("api/v1/time-management/timelog/searchtimelogbasic", true);
    (dataSource as DataWebApiDataSource<any>).setResource(resource, null, true);
  }

  navigateToEmployee(data) {
    this.router.navigate(["../../hr/employees", data.record.employee.id], {
      relativeTo: this.route
    });
  }

  renderTime(data) {
    if (data.record.isNextDay) {
      return `${dateFns.format(dateFns.parseISO(data.value), "h:mm a")}, ${dateFns.format(
        dateFns.addDays(dateFns.parseISO(data.record.date), 1),
        "dd EEE"
      )}`;
    }
    return dateFns.format(dateFns.parseISO(data.value), "h:mm a");
  }

  ngOnInit() {
    _.find(this.fields, { name: "employee" }).template = this.anchorPerson;
    _.find(this.fields, { name: "checkTime" }).template = this.logTypeTemplate;
  }
}
