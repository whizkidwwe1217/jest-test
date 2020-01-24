import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { SecurityComponent } from "./security.component";
import { UsersComponent } from "./users/users.component";
import { RolesComponent } from "./roles/roles-component";
import { AuditLogsComponent } from "./audit-logs/audit-logs.component";
import { PermissionsComponent } from "./permissions/permissions.component";

const routes: Routes = [
	{
		path: "",
		component: SecurityComponent,
		children: [
			{
				path: "users",
				children: [
					{
						path: "",
						component: UsersComponent
					},
					{
						path: "permissions/:id",
						component: PermissionsComponent
					}
				]
			},
			{
				path: "roles",
				children: [
					{
						path: "",
						component: RolesComponent
					},
					{
						path: "permissions/:id",
						component: PermissionsComponent
					}
				]
			},
			{
				path: "audit-logs",
				component: AuditLogsComponent
			},
			{
				path: "",
				redirectTo: "users",
				pathMatch: "full"
			},
			{
				path: "**",
				component: PageNotFoundComponent
			}
		]
	},
	{ path: "**", component: PageNotFoundComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SecurityRoutingModule {}
