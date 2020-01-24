import { Component, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import * as _ from "lodash";
import {
  HttpService,
  DataSource,
  DataWebApiDataSource,
  DataField,
  NumericDataField,
  UriResource
} from "hordeflow-common";

@Component({
  selector: "app-employees",
  styles: [
    `
      :host ::ng-deep .datagrid-cell {
        display: flex;
        align-items: center;
        padding: 0.25rem;
      }
    `
  ],
  template: `
    <hf-datagrid-view-page
      [dataSource]="dataSource"
      [fields]="fields"
      [hideFilters]="false"
      [title]="'Employees'"
      [enableRowActions]="true"
      [icon]="'applet-executive-team'"
    >
      <ng-template>
        <app-employee-form></app-employee-form>
      </ng-template>
    </hf-datagrid-view-page>
    <ng-template #anchorDetails let-data="data">
      <a routerLink="{{ data.record.id }}">{{ data.value }}</a>
    </ng-template>

    <ng-template #anchorPerson let-data="data">
      <div style="display: flex; flex-direction: row; align-items: center">
        <hf-avatar [size]="24" [round]="true" [name]="data.record | person"></hf-avatar>
        <a style="margin-left: 0.5rem" routerLink="{{ data.record.id }}">{{
          data.record | person
        }}</a>
      </div>
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
export class EmployeesComponent implements AfterViewInit {
  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    {
      name: "name",
      text: "Name",
      hidden: false,
      enableSearch: false
    },
    {
      name: "code",
      text: "Code",
      enableSearch: true,
      hidden: false
    },
    {
      name: "firstName",
      text: "First Name",
      hidden: true,
      enableSearch: true
    },
    {
      name: "lastName",
      text: "Last Name",
      hidden: true,
      enableSearch: true
    },
    { name: "team.name", text: "Team", hidden: false, enableSearch: true },
    { name: "position.name", text: "Position", hidden: false, enableSearch: true },
    {
      name: "department.name",
      text: "Department",
      enableSearch: true,
      hidden: false
    },
    new NumericDataField({ name: "baseRate", text: "Rate" })
  ];
  @ViewChild("anchorDetails", { static: false }) anchorDetails: ElementRef<any>;
  @ViewChild("anchorPerson", { static: false }) anchorPerson: ElementRef<any>;
  constructor(public dataSource: DataSource<any>) {
    const resource: UriResource = new UriResource()
      .setUrl("api/v1/organization/employee")
      .setListUrl("api/v1/organization/employee/searchemployeebasic", true);
    (dataSource as DataWebApiDataSource<any>).setResource(resource, null, true);
  }

  ngAfterViewInit() {
    _.find(this.fields, { name: "name" }).template = this.anchorPerson;
    _.find(this.fields, { name: "code" }).template = this.anchorDetails;
    _.find(this.fields, { name: "firstName" }).template = this.anchorDetails;
    _.find(this.fields, { name: "lastName" }).template = this.anchorDetails;
    _.find(this.fields, { name: "id" }).template = this.anchorDetails;
  }
}
