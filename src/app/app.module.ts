import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { ClarityModule } from "@clr/angular";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { NgProgressModule } from "ngx-progressbar";
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { NgProgressRouterModule } from "ngx-progressbar/router";
import { UikitModule } from 'uikit';
import { HordeflowCommonModule } from 'hordeflow-common';
import { StoreModule, Store } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import "@clr/icons";
import "@clr/icons/shapes/all-shapes";
import { ClarityIcons } from "@clr/icons";
import { AppRoutingModule } from './app.routing';
import { appInfoReducer } from './data/reducers/app-info.reducer';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ClarityModule,
		BrowserAnimationsModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgxChartsModule,
		NgProgressModule,
		NgProgressRouterModule,
		NgProgressHttpModule,
		UikitModule,
		HordeflowCommonModule,
		AppRoutingModule,
		StoreModule.forRoot({
			appInfo: appInfoReducer
		}),
		EffectsModule.forRoot([])
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
