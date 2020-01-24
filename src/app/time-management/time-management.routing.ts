import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PageNotFoundComponent } from "../shared/components/page-not-found/page-not-found.component";
import { WorkShiftsComponent } from "./workshifts/work-shifts.component";
import { TimeLogsComponent } from "./time-logs/time-logs.component";
import { TimesheetsComponent } from "./timesheets/timesheets.component";
import { TimesheetDetailsComponent } from "./timesheets/timesheet-details/timesheet-details.component";
import { TimeOffRequestTypesComponent } from "./time-off-request-types/time-off-request-types.component";
import { TimeOffRequestsComponent } from "./time-off-requests/time-off-requests.component";

const routes: Routes = [
	{ path: "time-logs", component: TimeLogsComponent },
	{ path: "work-shifts", component: WorkShiftsComponent },
	{ path: "time-off-requests", component: TimeOffRequestsComponent },
	{ path: "time-off-request-types", component: TimeOffRequestTypesComponent },
	{
		path: "timesheets",
		children: [
			{ path: "", component: TimesheetsComponent },
			{
				path: ":id",
				children: [
					{
						path: "",
						component: TimesheetDetailsComponent
					}
				]
			}
		]
	},
	{ path: "**", component: PageNotFoundComponent }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TimeManagementRoutingModule {}
