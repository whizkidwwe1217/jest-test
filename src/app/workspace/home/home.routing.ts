import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { HomeComponent } from "./home.component";
import { GettingStartedComponent } from "./getting-started/getting-started.component";
import { AuthenticationGuard } from "src/app/authentication/guards/authentication.guard";

const routes: Routes = [
	{
		path: "",
		component: HomeComponent,
		children: [
			{ path: "getting-started", component: GettingStartedComponent },
			{
				path: "hr",
				loadChildren: "../../hr/hr.module#HrModule",
				canActivate: [AuthenticationGuard], // Use canActivate because canLoad blocks preloading strategy https://angular.io/guide/router#canload-blocks-preload
				data: { preload: true }
			},
			{
				path: "time-management",
				loadChildren: "../../time-management/time-management.module#TimeManagementModule",
				canActivate: [AuthenticationGuard], // Use canActivate because canLoad blocks preloading strategy https://angular.io/guide/router#canload-blocks-preload
				data: { preload: true }
			},
			{
				path: "payroll",
				loadChildren:
					"../../payroll-management/payroll-management.module#PayrollManagementModule",
				canActivate: [AuthenticationGuard], // Use canActivate because canLoad blocks preloading strategy https://angular.io/guide/router#canload-blocks-preload
				data: { preload: false, lazyLoadedModuleName: "Payroll" }
			},
			{
				path: "administration",
				loadChildren: "../administration/administration.module#AdministrationModule",
				canLoad: [AuthenticationGuard],
				data: {
					lazyLoadedModuleName: "Administration"
				}
			},
			{
				path: "settings",
				loadChildren: "../settings/settings.module#SettingsModule",
				canLoad: [AuthenticationGuard],
				data: {
					lazyLoadedModuleName: "Settings"
				}
			},
			{ path: "", redirectTo: "getting-started", pathMatch: "full" },
			{ path: "**", component: PageNotFoundComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HomeRoutingModule {}
