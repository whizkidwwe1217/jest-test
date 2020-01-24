import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageNotFoundComponent } from "./shared/components/page-not-found/page-not-found.component";
import { AuthenticationGuard } from "./authentication/guards/authentication.guard";
import { NoCompanyGuard } from "./authentication/guards/no-company.guard";
import { WelcomeComponent } from "./welcome/welcome.component";
import { LoginComponent } from "./authentication/login/login.component";
import { SelectivePreloadingStrategyService } from "./selective-preloading-strategy.service";

const appRoutes: Routes = [
	{
		path: "auth",
		loadChildren: "./authentication/authentication.module#AuthenticationModule",
		canLoad: [NoCompanyGuard, AuthenticationGuard],
		data: {
			lazyLoadedModuleName: "Authentication"
		}
	},
	{
		path: "admin",
		loadChildren: "./admin/admin.module#AdminModule",
		canLoad: [AuthenticationGuard],
		data: {
			lazyLoadedModuleName: "Admin"
		}
	},
	{
		path: "workspace",
		loadChildren: "./workspace/workspace.module#WorkspaceModule",
		data: { preload: true },
		canActivate: [NoCompanyGuard, AuthenticationGuard] // Use canActivate because canLoad blocks preloading strategy https://angular.io/guide/router#canload-blocks-preload
	},
	{
		path: "welcome",
		component: WelcomeComponent
	},
	{
		path: "login",
		component: LoginComponent
	},
	{ path: "", redirectTo: "login", pathMatch: "full" },
	{ path: "**", component: PageNotFoundComponent, data: { preload: true } }
];

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes, {
			preloadingStrategy: SelectivePreloadingStrategyService,
			enableTracing: false
		})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
