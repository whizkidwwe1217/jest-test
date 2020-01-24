import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { HttpService, TenantAuthService, JwtClaims } from "hordeflow-common";
import {
  switchMap,
  filter,
  map,
  distinct,
  tap,
  combineAll,
  withLatestFrom,
  last,
  takeLast
} from "rxjs/operators";
import { HttpParams, HttpUrlEncodingCodec } from "@angular/common/http";
import { from, combineLatest } from "rxjs";
import * as _ from "lodash";
import { DynamicListItem } from "src/app/shared/components/dynamic-list/dynamic-list-item";

export interface JwtClaim {
  type: string;
  value: string;
}

@Component({
  selector: "hf-permissions",
  templateUrl: "permissions.component.html",
  styleUrls: ["permissions.component.scss"]
})
export class PermissionsComponent implements OnInit {
  title: string = "Permissions";
  allowManageTeams: boolean;
  allowManagePositions: boolean;
  allowManageDepartments: boolean;
  allowManageWorkshifts: boolean;
  allowManageProfile: boolean;
  allowDisplayProfile: boolean;
  allowRead: boolean;
  allowCreate: boolean;
  allowUpdate: boolean;
  allowDelete: boolean;
  accountOrRoleId: string;
  permissionType: string;
  permissions: string[] = [];
  roles: string[] = [];
  isSuperUser: boolean = false;
  description: string;
  userRoles: DynamicListItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private accountService: TenantAuthService
  ) {
    this.route.params.subscribe(params => {
      this.accountOrRoleId = params["id"];
      if (!this.accountOrRoleId) {
        const decodedParams = decodeURIComponent(params["id"]);
        this.accountOrRoleId = decodedParams.substring(0, decodedParams.indexOf("?"));
        const parsedParams = this.parseUrlParams(decodedParams);
        this.title = `${parsedParams.get("name")}`;
        this.permissionType = parsedParams.get("type");
      }
    });
    route.queryParamMap.subscribe(o => {
      if (o.keys.length > 0) {
        this.title = `${o.get("name")}`;
        this.permissionType = o.get("type");
      }
    });
  }

  ngOnInit() {
    const type = this.permissionType === "role" ? "role" : "user";
    this.http.get<any, string>(`api/v1/auth/${type}`, this.accountOrRoleId).subscribe(payload => {
      this.accountOrRoleId = payload.id;
      this.title = `${type === "role" ? payload.name : payload.userName}`;
      this.description = `${type === "role" ? payload.description : payload.email}`;
      if (type === "role" && payload.normalizedName === "SUPERUSER") {
        this.isSuperUser = true;
        this.allowManageTeams = true;
        this.allowManagePositions = true;
        this.allowManageDepartments = true;
        this.allowManageWorkshifts = true;
        this.allowManageProfile = true;
        this.allowDisplayProfile = true;
        this.allowRead = true;
        this.allowCreate = true;
        this.allowUpdate = true;
        this.allowDelete = true;
      }

      const params = new HttpParams().set("id", this.accountOrRoleId.toString());
      this.http
        .list<any>(`/api/v1/auth/${type}/getclaims`, params)
        .pipe(
          /* convert to array stream */ switchMap(e => from(e)),
          /* add roles */ tap(e => {
            if (e.type === JwtClaims.Role) {
              this.roles.push(e.value);
              if (e.value === "SuperUser") {
                this.isSuperUser = true;
                this.allowManageTeams = true;
                this.allowManagePositions = true;
                this.allowManageDepartments = true;
                this.allowManageWorkshifts = true;
                this.allowManageProfile = true;
                this.allowDisplayProfile = true;
                this.allowRead = true;
                this.allowCreate = true;
                this.allowUpdate = true;
                this.allowDelete = true;
              }
            }
          }),
          /* filter permissions only */ filter(e => e.type === JwtClaims.Permission),
          /* emit the string vaue only */ map(e => e.value),
          /* remove duplicates */ distinct(),
          /* add to permissions */ tap(e => this.permissions.push(e))
        )
        .subscribe(permission => {
          this.allowManageTeams =
            this.permissions.indexOf("teams.manage") !== -1 || this.isSuperUser;
          this.allowManagePositions =
            this.permissions.indexOf("positions.manage") !== -1 || this.isSuperUser;
          this.allowManageDepartments =
            this.permissions.indexOf("departments.manage") !== -1 || this.isSuperUser;
          this.allowManageWorkshifts =
            this.permissions.indexOf("workshifts.manage") !== -1 || this.isSuperUser;
          this.allowManageProfile =
            this.permissions.indexOf("profile.manage") !== -1 || this.isSuperUser;
          this.allowDisplayProfile =
            this.permissions.indexOf("profile.display") !== -1 || this.isSuperUser;
          this.allowRead = this.permissions.indexOf("read") !== -1 || this.isSuperUser;
          this.allowCreate = this.permissions.indexOf("create") !== -1 || this.isSuperUser;
          this.allowUpdate = this.permissions.indexOf("update") !== -1 || this.isSuperUser;
          this.allowDelete = this.permissions.indexOf("delete") !== -1 || this.isSuperUser;
        });
    });

    const params = new HttpParams().set("userId", this.accountOrRoleId.toString());
    this.http
      .list(`api/v1/auth/${type}`, params)
      .pipe(switchMap(roles => from(roles)))
      .subscribe((role: string) => this.userRoles.push({ name: role }));
  }

  permissionChanged(e: Event, permission) {
    const checked = ((e.currentTarget || e.target) as HTMLInputElement).checked;
    const claim = {
      type: JwtClaims.Permission,
      value: permission
    };
    this.http
      .process(
        `/api/v1/auth/${this.permissionType === "role" ? "role" : "user"}/${
          checked ? "addclaim" : "removeclaim"
        }/${this.accountOrRoleId}`,
        claim
      )
      .subscribe(result => console.log(result));
  }

  onItemAdded(e) {
    if (this.permissionType === "user") {
      const params = new HttpParams()
        .set("userId", this.accountOrRoleId.toString())
        .set("roleId", e.payload.id);
      this.http
        .process(`api/v1/auth/user/assignrole`, {}, params)
        .subscribe(result => console.log(result));
    }
  }

  onItemDeleted(e) {
    if (this.permissionType === "user") {
      const params = new HttpParams()
        .set("userId", this.accountOrRoleId.toString())
        .set("role", e.name);
      this.http
        .process(`api/v1/auth/user/removerole`, {}, params)
        .subscribe(result => console.log(result));
    }
  }

  parseUrlParams(url: string): Map<string, string> {
    const start = url.indexOf("?");
    const paramsQuery = url.substring(start + 1);
    const paramPairs = paramsQuery.split("&");
    const params: Map<string, string> = new Map();

    paramPairs.forEach(p => {
      const pair = p.split("=");
      const type = pair[0];
      const value = pair[1];
      params.set(type, value);
    });

    return params;
  }
}
