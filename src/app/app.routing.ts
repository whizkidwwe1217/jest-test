import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
const appRoutes: Routes = [
	{
		path: "",
		component: AppComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes, {
			enableTracing: false
		})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
