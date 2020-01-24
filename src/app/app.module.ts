import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { ClarityModule } from "@clr/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgProgressModule } from "ngx-progressbar";
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { NgProgressRouterModule } from "ngx-progressbar/router";
import { HordeflowCommonModule } from "hordeflow-common";
import { StoreModule, Store } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import "@clr/icons";
import "@clr/icons/shapes/all-shapes";
import { ClarityIcons } from "@clr/icons";
import { AppRoutingModule } from "./app.routing";
import { appInfoReducer } from "./data/reducers/app-info.reducer";
import { RouterModule } from "@angular/router";
import { HordeflowkitModule } from "hordeflowkit";
import { SharedModule } from "./shared/shared.module";
import { WelcomeComponent } from "./welcome/welcome.component";
import { AdminAuthenticationGuard } from "./authentication/guards/admin-authentication.guard";
import { AuthenticationGuard } from "./authentication/guards/authentication.guard";
import { NoCompanyGuard } from "./authentication/guards/no-company.guard";
import { AuthenticationModule } from "./authentication/authentication.module";
import { AdminModule } from "./admin/admin.module";
import { WorkspaceModule } from "./workspace/workspace.module";

@NgModule({
	declarations: [AppComponent, WelcomeComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ClarityModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgxChartsModule,
		NgProgressModule,
		NgProgressRouterModule,
		NgProgressHttpModule,
		HordeflowCommonModule,
		HordeflowkitModule,
		SharedModule,
		AuthenticationModule,
		AdminModule.forRoot(),
		WorkspaceModule,
		AppRoutingModule,
		StoreModule.forRoot(
			{
				appInfo: appInfoReducer
			},
			{
				runtimeChecks: {
					strictActionImmutability: true,
					strictActionSerializability: true,
					strictStateImmutability: true,
					strictStateSerializability: true
				}
			}
		),
		EffectsModule.forRoot([])
	],
	bootstrap: [AppComponent],
	providers: [AdminAuthenticationGuard, AuthenticationGuard, NoCompanyGuard]
})
export class AppModule {}
