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
import { UikitModule } from "uikit";
import { AppRoutingModule } from "./app.routing";
import { HordeflowkitModule } from "hordeflowkit";

let fixture: ComponentFixture<AppComponent> = null;
let app: AppComponent = null;

beforeEach(() => {
	TestBed.configureTestingModule({
		imports: [
			BrowserModule,
			ClarityModule,
			NoopAnimationsModule,
			HttpClientModule,
			FormsModule,
			ReactiveFormsModule,
			NgxChartsModule,
			NgProgressModule,
			NgProgressRouterModule,
			NgProgressHttpModule,
			UikitModule,
			HordeflowCommonModule,
			HordeflowkitModule,
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
		declarations: [AppComponent],
		providers: [
			{
				provide: APP_BASE_HREF,
				useValue: "/"
			}
		]
	}).compileComponents();
});

test("should create app component", () => {
	fixture = TestBed.createComponent(AppComponent);
	app = fixture.componentInstance;
	expect(app).not.toBeNull();
});
