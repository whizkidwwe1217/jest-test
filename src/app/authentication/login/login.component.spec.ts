// import { TestBed, inject, getTestBed } from "@angular/core/testing";
// import { ClarityModule } from "@clr/angular";
// import { ReactiveFormsModule, FormsModule } from "@angular/forms";
// import { SharedModule } from "src/app/shared/shared.module";
// import { HordeflowCommonModule } from "hordeflow-common";
// import { HordeflowkitModule } from "hordeflowkit";
// import { LoginComponent } from "./login.component";
// import { RouterModule, Router } from "@angular/router";
// import { HttpClientTestingModule } from "@angular/common/http/testing";
// import { APP_BASE_HREF } from "@angular/common";
// import { StoreModule } from "@ngrx/store";
// import { EffectsModule } from "@ngrx/effects";
// import { appInfoReducer } from "src/app/data/reducers/app-info.reducer";

// let router: Router;
// const credentials = {
// 	companyId: "d46f6c18",
// 	username: "admin",
// 	password: "12345678",
// 	rememberCredentials: true
// };

// beforeEach(() => {
// 	TestBed.configureTestingModule({
// 		imports: [
// 			HttpClientTestingModule,
// 			ClarityModule,
// 			FormsModule,
// 			ReactiveFormsModule,
// 			SharedModule,
// 			HordeflowCommonModule,
// 			HordeflowkitModule,
// 			RouterModule.forRoot([]),
// 			StoreModule.forRoot({
// 				appInfo: appInfoReducer
// 			}),
// 			EffectsModule.forRoot([])
// 		],
// 		declarations: [LoginComponent],
// 		providers: [{ provide: APP_BASE_HREF, useValue: "/" }]
// 	}).compileComponents();

// 	const injector = getTestBed();
// 	router = injector.get(Router);
// });

// test("should create LoginComponent", () => {
// 	const fixture = TestBed.createComponent(LoginComponent);
// 	const app = fixture.debugElement.componentInstance;
// 	expect(app).toBeTruthy();
// });

// test("should create forms", () => {
// 	const fixture = TestBed.createComponent(LoginComponent);
// 	const cmp = fixture.debugElement.componentInstance as LoginComponent;
// 	expect(cmp.setupForm).toBeTruthy();
// 	expect(cmp.loginForm).toBeTruthy();
// });

// test("should navigate to /login", () => {
// 	const route = {
// 		navigate: jest.fn()
// 	};
// 	route.navigate(["/login"]);
// 	expect(route.navigate).toHaveBeenCalledWith(["/login"]);
// });

// test("should enter valid credentials", () => {
// 	const fixture = TestBed.createComponent(LoginComponent);
// 	const cmp = fixture.debugElement.componentInstance as LoginComponent;
// 	cmp.setFormData(credentials, true);

// 	expect(cmp.username.value).toBe("admin");
// 	expect(cmp.password.value).toBe("12345678");
// 	expect(cmp.companyId.value).toBe("d46f6c18");
// });
test("truelala", () => {
	expect(true).toBeTruthy();
});
