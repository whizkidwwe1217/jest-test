import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ClarityModule } from "@clr/angular";
import { SharedModule } from "../../shared/shared.module";
import { SecurityRoutingModule } from "./security.routing";
import { UsersComponent } from "./users/users.component";
import { SecurityComponent } from "./security.component";
import { HordeflowkitModule } from "hordeflowkit";
import { RolesComponent } from "./roles/roles-component";
import { UserFormComponent } from "./users/user.form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RoleFormComponent } from "./roles/role-form.component";
import { AuditLogsComponent } from "./audit-logs/audit-logs.component";
import { PermissionsComponent } from "./permissions/permissions.component";

const components = [
  SecurityComponent,
  UsersComponent,
  UserFormComponent,
  RolesComponent,
  RoleFormComponent,
  AuditLogsComponent,
  PermissionsComponent
];

@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HordeflowkitModule,
    SecurityRoutingModule
  ],
  declarations: components
})
export class SecurityModule {}
