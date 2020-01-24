import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "../shared/components/page-not-found/page-not-found.component";
import { PaysheetsComponent } from "./paysheets/paysheets.component";
import { PaysheetDetailComponent } from "./paysheets/paysheet-detail/paysheet-detail.component";
import { PayItemsComponent } from "./pay-items/pay-items.component";
import { PayablesComponent } from "./paysheets/payables/payables.component";

const routes: Routes = [
	{
		path: "paysheets",
		children: [
			{ path: "", component: PaysheetsComponent },
			{
				path: ":id",
				children: [
					{
						path: "",
						component: PaysheetDetailComponent
					},
					{
						path: "payables/:id",
						component: PayablesComponent
					}
				]
			}
		]
	},
	{ path: "pay-items", component: PayItemsComponent },
	{ path: "**", component: PageNotFoundComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PayrollManagementRoutingModule {}
