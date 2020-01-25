import { TestBed, ComponentFixture } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { BrowserModule } from "@angular/platform-browser";
import { ClarityModule } from "@clr/angular";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgProgressModule } from "ngx-progressbar";
import { NgProgressRouterModule } from "ngx-progressbar/router";
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { HordeflowCommonModule } from "hordeflow-common";
import { HordeflowkitModule } from "hordeflowkit";
import { SharedModule } from "src/app/shared/shared.module";
import { AuthenticationModule } from "../authentication.module";
import { AdminModule } from "src/app/admin/admin.module";
import { WorkspaceModule } from "src/app/workspace/workspace.module";
import { AppRoutingModule } from "src/app/app.routing";
import { StoreModule } from "@ngrx/store";
import { appInfoReducer } from "src/app/data/reducers/app-info.reducer";
import { EffectsModule } from "@ngrx/effects";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { AdminAuthenticationGuard } from "../guards/admin-authentication.guard";
import { AuthenticationGuard } from "../guards/authentication.guard";
import { NoCompanyGuard } from "../guards/no-company.guard";
import { AuthenticationRoutingModule } from "../authentication.routing";

describe("Login Component", () => {
	let fixture: ComponentFixture<LoginComponent> = null;
	let component: LoginComponent = null;
	const credentials = {
		companyId: "d46f6c18",
		username: "admin",
		password: "12345678",
		rememberCredentials: true
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				CommonModule,
				FormsModule,
				ClarityModule,
				ReactiveFormsModule,
				HordeflowkitModule,
				SharedModule,
				AuthenticationModule,
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
			providers: [
				{
					provide: APP_BASE_HREF,
					useValue: "/"
				}
			]
		}).compileComponents();
	});

	test("should create Login Component", () => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.debugElement.componentInstance;
		expect(component).toBeTruthy();
	});

	test("should create forms", () => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.debugElement.componentInstance as LoginComponent;
		expect(component.setupForm).toBeTruthy();
		expect(component.loginForm).toBeTruthy();
	});

	test("should navigate to /login", () => {
		const route = {
			navigate: jest.fn()
		};
		route.navigate(["/login"]);
		expect(route.navigate).toHaveBeenCalledWith(["/login"]);
	});

	test("should enter valid credentials", () => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.debugElement.componentInstance as LoginComponent;
		component.setFormData(credentials, true);

		expect(component.username.value).toBe("admin");
		expect(component.password.value).toBe("12345678");
		expect(component.companyId.value).toBe("d46f6c18");
	});
});
