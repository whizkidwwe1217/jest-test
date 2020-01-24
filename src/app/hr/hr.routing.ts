import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmployeesComponent } from "./employees/employees.component";
import { DepartmentsComponent } from "./departments/departments.component";
import { TeamsComponent } from "./teams/teams.component";
import { PositionsComponent } from "./positions/positions.component";
import { EmployeeDetailComponent } from "./employees/employee-detail/employee-detail.component";
import { PageNotFoundComponent } from "../shared/components/page-not-found/page-not-found.component";
import { TimeOffRequestApproversComponent } from "./time-off-request-approvers/time-off-request-approvers.component";

const routes: Routes = [
	{
		path: "employees",
		children: [
			{
				path: "",
				component: EmployeesComponent
			},
			{
				path: ":id",
				component: EmployeeDetailComponent
			}
		]
	},
	{
		path: "departments",
		component: DepartmentsComponent
	},
	{ path: "teams", component: TeamsComponent },
	{ path: "positions", component: PositionsComponent },
	{ path: "time-of-request-approvers", component: TimeOffRequestApproversComponent },
	{ path: "**", component: PageNotFoundComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HrRoutingModule {}
