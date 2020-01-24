import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { WorkspaceComponent } from "./workspace.component";
import { WorkspaceRoutingModule } from "./workspace.routing";
import { SharedModule } from "../shared/shared.module";
import { HordeflowkitModule } from "hordeflowkit";
import { ClarityModule } from "@clr/angular";

@NgModule({
	imports: [
		CommonModule,
		ClarityModule,
		SharedModule,
		HordeflowkitModule,
		WorkspaceRoutingModule
	],
	declarations: [WorkspaceComponent]
})
export class WorkspaceModule {}
