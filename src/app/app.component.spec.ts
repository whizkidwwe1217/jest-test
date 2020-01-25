import { TestBed, ComponentFixture } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { ClarityModule } from "@clr/angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { APP_BASE_HREF } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HordeflowCommonModule } from "hordeflow-common";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgProgressModule } from "ngx-progressbar";
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { NgProgressRouterModule } from "ngx-progressbar/router";
import { StoreModule } from "@ngrx/store";
import { appInfoReducer } from "./data/reducers/app-info.reducer";
import { EffectsModule } from "@ngrx/effects";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app.routing";
import { HordeflowkitModule } from "hordeflowkit";
import { WelcomeComponent } from "./welcome/welcome.component";
import { SharedModule } from "./shared/shared.module";
import { AdminAuthenticationGuard } from "./authentication/guards/admin-authentication.guard";
import { AuthenticationGuard } from "./authentication/guards/authentication.guard";
import { NoCompanyGuard } from "./authentication/guards/no-company.guard";
import { AuthenticationModule } from "./authentication/authentication.module";
import { AdminModule } from "./admin/admin.module";
import { WorkspaceModule } from "./workspace/workspace.module";

describe("App Component", () => {
	let fixture: ComponentFixture<AppComponent> = null;
	let component: AppComponent = null;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				BrowserModule,
				ClarityModule,
				NoopAnimationsModule,
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
			declarations: [AppComponent, WelcomeComponent],
			providers: [
				{
					provide: APP_BASE_HREF,
					useValue: "/"
				},
				AdminAuthenticationGuard,
				AuthenticationGuard,
				NoCompanyGuard
			]
		}).compileComponents();
	});

	test("should create App component", () => {
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.debugElement.componentInstance;
		expect(component).toBeTruthy();
	});

	test(`should have a title 'HordeFlow'`, () => {
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.debugElement.componentInstance;
		expect(component.title).toEqual("HordeFlow");
	});
});
