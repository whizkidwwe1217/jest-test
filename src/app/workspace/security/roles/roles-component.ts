import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import * as _ from "lodash";
import { Router, ActivatedRoute } from "@angular/router";
import { DataField } from "hordeflow-common";
import { DatagridRowAction } from "hordeflowkit";

@Component({
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
      [dataSource]="'api/v1/auth/role'"
      [fields]="fields"
      [noHeader]="true"
      [title]="'Roles'"
      [addButtonText]="'Create Role'"
      [editorMode]="'sidepanel'"
      [dismissEditorOnAccepted]="true"
      [enableRowActions]="true"
      [rowActions]="rowActions"
      [selectionMode]="'none'"
    >
      <ng-template>
        <app-role-form></app-role-form>
      </ng-template>
    </hf-datagrid-view-page>
    <ng-template #booleanTemplate let-data="data">
      <clr-icon
        [ngStyle]="{ color: data.value ? 'green' : 'red' }"
        [attr.shape]="data.value ? 'check' : 'times'"
      ></clr-icon>
    </ng-template>

    <ng-template #roleNameTemplate let-data="data">
      <div style="display: flex; flex-direction: row; align-items: center">
        <hf-avatar [size]="24" [round]="true" [name]="data.record.name"></hf-avatar>
        <a href="javascript:void(0)" style="padding-left: 0.5rem">
          {{ data.value }}
        </a>
      </div>
    </ng-template>
  `
})
export class RolesComponent implements OnInit {
  @ViewChild("booleanTemplate", { static: true }) booleanTemplate: TemplateRef<any>;
  @ViewChild("roleNameTemplate", { static: true }) roleNameTemplate: TemplateRef<any>;
  rowActions: DatagridRowAction<any>[] = [
    {
      name: "btnAssignMembers",
      text: "Assign Members",
      icon: "group",
      perform: (record, index, event) => {}
    },
    {
      name: "btnPermissions",
      text: "Permissions",
      icon: "key",
      perform: (record, index) => {
        this.router.navigate(["permissions", record.id], {
          relativeTo: this.route,
          queryParams: { name: record.name, type: "role" }
        });
      }
    }
  ];

  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    { name: "name", text: "Name", enableSearch: true },
    { name: "description", text: "Description", enableSearch: true },
    {
      name: "isSystemAdministrator",
      text: "Administrator",
      type: "boolean"
    }
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    _.map(_.filter(this.fields, { type: "boolean" }), f => (f.template = this.booleanTemplate));
    _.map(_.filter(this.fields, { name: "name" }), f => (f.template = this.roleNameTemplate));
  }
}
