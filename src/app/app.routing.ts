import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { NgModule } from "@angular/core";
const appRoutes: Routes = [];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes, {
			enableTracing: false
		})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
