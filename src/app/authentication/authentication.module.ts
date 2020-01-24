import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { AuthenticationRoutingModule } from "./authentication.routing";
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClarityModule } from "@clr/angular";
import { HordeflowkitModule } from "hordeflowkit";
import { HttpService, TenantAuthService, CatalogAuthService } from "hordeflow-common";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ClarityModule,
		ReactiveFormsModule,
		HordeflowkitModule,
		SharedModule,
		AuthenticationRoutingModule
	],
	declarations: [LoginComponent]
})
export class AuthenticationModule {}
