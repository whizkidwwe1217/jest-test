import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminComponent } from "./admin.component";
import { AdminRoutingModule } from "./admin.routing";
import { SharedModule } from "../shared/shared.module";
import { ClarityModule } from "@clr/angular";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppHttpInterceptor } from "../shared/interceptors/http.interceptor";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { tenantReducer } from "./store/reducer";
import { TenantStoreEffects } from "./store/effects";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { HighlightModule } from "ngx-highlightjs";
import { HordeflowkitModule } from "hordeflowkit";
import { SettingsComponent } from "./settings/settings.component";
import { HordeflowCommonModule } from "hordeflow-common";
import { TenantDetailComponent } from "./tenant/tenant-detail/tenant-detail.component";
import { TenantFormComponent } from "./tenant/tenant-form/tenant-form.component";
import { TenantComponent } from "./tenant/tenant.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NgProgressModule } from "ngx-progressbar";
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { NgProgressRouterModule } from "ngx-progressbar/router";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxChartsModule,
		ClarityModule,
		NgProgressModule,
		NgProgressRouterModule,
		HordeflowCommonModule,
		SharedModule,
		HordeflowkitModule,
		AdminRoutingModule,
		HighlightModule.forRoot({
			theme: "atom-one-dark",
			path: "assets/vendor/lib/hljs"
		}),
		StoreModule.forFeature("tenant", tenantReducer),
		EffectsModule.forFeature([TenantStoreEffects])
	],
	declarations: [
		AdminComponent,
		SettingsComponent,
		TenantComponent,
		TenantFormComponent,
		TenantDetailComponent,
		DashboardComponent
	]
})
export class AdminModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AdminModule,
			providers: [
				{
					provide: HTTP_INTERCEPTORS,
					useClass: AppHttpInterceptor,
					multi: true
				}
			]
		};
	}
}
