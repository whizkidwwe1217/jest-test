import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClarityModule } from "@clr/angular";
import { SharedModule } from "../shared/shared.module";
import { HordeflowkitModule } from "hordeflowkit";
import { PayrollManagementRoutingModule } from "./payroll-management.routing";
import { PaysheetsComponent } from "./paysheets/paysheets.component";
import { PaysheetFormComponent } from "./paysheets/paysheet-form/paysheet-form.component";
import { PaysheetDetailComponent } from "./paysheets/paysheet-detail/paysheet-detail.component";
import { PayItemsComponent } from "./pay-items/pay-items.component";
import { PayItemFormComponent } from "./pay-items/pay-item-form/pay-item-form.component";
import { PayablesComponent } from "./paysheets/payables/payables.component";

@NgModule({
	declarations: [
		PaysheetsComponent,
		PaysheetFormComponent,
		PaysheetDetailComponent,
		PayablesComponent,
		PayItemsComponent,
		PayItemFormComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ClarityModule,
		SharedModule,
		HordeflowkitModule,
		PayrollManagementRoutingModule
	]
})
export class PayrollManagementModule {}
