import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AdminComponent } from "./admin.component";
import { PageNotFoundComponent } from "../shared/components/page-not-found/page-not-found.component";
import { AdminAuthenticationGuard } from "../authentication/guards/admin-authentication.guard";
import { SettingsComponent } from "./settings/settings.component";
import { TenantComponent } from "./tenant/tenant.component";
import { TenantFormComponent } from "./tenant/tenant-form/tenant-form.component";
import { TenantDetailComponent } from "./tenant/tenant-detail/tenant-detail.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

const adminRoutes: Routes = [
	{
		path: "admin",
		component: AdminComponent,
		canActivate: [AdminAuthenticationGuard],
		children: [
			{
				path: "tenant",
				component: TenantComponent,
				children: [
					{ path: "new", component: TenantFormComponent },
					{ path: ":id/edit", component: TenantFormComponent },
					{ path: ":id", component: TenantDetailComponent }
				]
			},
			{ path: "dashboard", component: DashboardComponent },
			{ path: "settings", component: SettingsComponent },
			{ path: "", redirectTo: "dashboard", pathMatch: "full" },
			{ path: "**", component: PageNotFoundComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(adminRoutes)],
	exports: [RouterModule]
})
export class AdminRoutingModule {}
