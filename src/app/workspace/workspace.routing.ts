import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WorkspaceComponent } from "./workspace.component";
import { PageNotFoundComponent } from "../shared/components/page-not-found/page-not-found.component";
import { AuthenticationGuard } from "../authentication/guards/authentication.guard";

const routes: Routes = [
	{
		path: "workspace",
		component: WorkspaceComponent,
		children: [
			{
				path: "home",
				loadChildren: "./home/home.module#HomeModule",
				canActivate: [AuthenticationGuard], // Use canActivate because canLoad blocks preloading strategy https://angular.io/guide/router#canload-blocks-preload
				data: { preload: true }
			},
			// {
			// 	path: "administration",
			// 	loadChildren:
			// 		"./administration/administration.module#AdministrationModule",
			// 	canLoad: [AuthenticationGuard]
			// },
			// {
			// 	path: "settings",
			// 	loadChildren: "./settings/settings.module#SettingsModule",
			// 	canLoad: [AuthenticationGuard]
			// },
			{ path: "dashboard", component: PageNotFoundComponent },
			{ path: "", redirectTo: "home", pathMatch: "full" },
			{ path: "**", component: PageNotFoundComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class WorkspaceRoutingModule {}
