import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
	{
		path: "security",
		loadChildren: "../security/security.module#SecurityModule",
		data: {
			lazyLoadedModuleName: "Settings"
		}
	},
	{ path: "**", component: PageNotFoundComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SettingsRoutingModule {}
