import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { HttpService, DataWebApiDataSource, DataField, UriResource } from "hordeflow-common";
import * as _ from "lodash";
import { Router, ActivatedRoute } from "@angular/router";
import { DatagridRowAction } from "hordeflowkit";
@Component({
  styles: [
    `
      :host ::ng-deep .datagrid-cell {
        display: flex;
        align-items: center;
        padding: 0.25rem;
      }

      .email {
        display: block;
      }
    `
  ],
  template: `
    <hf-datagrid-view-page
      [dataSource]="dataSource"
      [fields]="fields"
      [noHeader]="true"
      [title]="'Users'"
      [selectionMode]="'none'"
      [addButtonText]="'Create New User'"
      [rowActions]="rowActions"
      [enableRowActions]="true"
    >
      <button class="action-item"><clr-icon shape="key"></clr-icon> Change Password</button>
      <button class="action-item">
        <clr-icon shape="shield-check"></clr-icon> Assign Permissions
      </button>

      <ng-template>
        <app-user-form></app-user-form>
      </ng-template>
    </hf-datagrid-view-page>
    <ng-template #booleanTemplate let-data="data">
      <clr-icon
        [ngStyle]="{ color: data.value ? 'green' : 'red' }"
        [attr.shape]="data.value ? 'check' : 'times'"
      ></clr-icon>
    </ng-template>

    <ng-template #usernameTemplate let-data="data">
      <div style="display: flex; flex-direction: row; align-items: center">
        <hf-avatar [size]="24" [round]="true" [name]="data.record.userName"></hf-avatar>
        <div style="padding-left: 0.5rem">
          <a
            href="javascript:void(0)"
            role="tooltip"
            aria-haspopup="true"
            class="tooltip tooltip-right"
          >
            {{ data.value }}
            <span class="tooltip-content"
              >Roles
              <ul>
                <li *ngFor="let role of data.record.roles">
                  {{ role.name }}
                </li>
              </ul></span
            ></a
          >
          <span class="email">{{ data.record.email }}</span>
        </div>
      </div>
    </ng-template>
  `,
  providers: [
    {
      provide: DataWebApiDataSource,
      useClass: DataWebApiDataSource,
      deps: [HttpService]
    }
  ]
})
export class UsersComponent implements OnInit {
  @ViewChild("booleanTemplate", { static: true }) booleanTemplate: TemplateRef<any>;
  @ViewChild("usernameTemplate", { static: true }) usernameTemplate: TemplateRef<any>;
  rowActions: DatagridRowAction<any>[] = [
    {
      name: "btnPermissions",
      text: "Permissions",
      icon: "key",
      perform: (record, index) => {
        this.router.navigate(["permissions", record.id], {
          relativeTo: this.route,
          queryParams: { name: record.userName, type: "user" }
        });
      }
    }
  ];
  fields: DataField<any>[] = [
    { name: "id", text: "Id", hidden: true },
    {
      name: "userName",
      text: "User Name",
      enableSearch: true,
      disableColumnSelection: true
    },
    {
      name: "email",
      text: "Email",
      enableSearch: true,
      excludeFromGrid: true
    },
    {
      name: "isConfirmed",
      text: "Confirmed?",
      type: "boolean",
      enableSearch: true
    },
    {
      name: "isSystemAdministrator",
      text: "Administrator?",
      type: "boolean",
      enableSearch: true
    },
    {
      name: "lockoutEnabled",
      text: "Lockout Enabled?",
      type: "boolean",
      enableSearch: true
    },
    {
      name: "twoFactorEnabled",
      text: "Two Factor Enabled?",
      type: "boolean",
      enableSearch: true
    },
    {
      name: "roles",
      text: "Roles",
      hidden: false,
      excludeFromGrid: true
    }
  ];

  constructor(
    public dataSource: DataWebApiDataSource<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const url = new UriResource()
      .setCreateUrl("api/v1/auth/account/register")
      .setUrl("api/v1/auth/user")
      .setListUrl("api/v1/auth/user/searchusers");

    dataSource.setResource(url, null, true);
  }

  ngOnInit() {
    _.map(_.filter(this.fields, { type: "boolean" }), f => (f.template = this.booleanTemplate));
    _.find(this.fields, { name: "userName" }).template = this.usernameTemplate;
  }
}
