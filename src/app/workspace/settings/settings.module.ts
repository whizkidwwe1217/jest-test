import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HordeflowkitModule } from "hordeflowkit";
import { ClarityModule } from "@clr/angular";
import { SharedModule } from "../../shared/shared.module";
import { SettingsRoutingModule } from "./settings.routing";

@NgModule({
	imports: [
		CommonModule,
		ClarityModule,
		SharedModule,
		HordeflowkitModule,
		SettingsRoutingModule
	]
})
export class SettingsModule {}
