import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClarityModule } from "@clr/angular";
import { SharedModule } from "../shared/shared.module";
import { HordeflowkitModule } from "hordeflowkit";
import { TimeManagementRoutingModule } from "./time-management.routing";
import { WorkShiftsComponent } from "./workshifts/work-shifts.component";
import { WorkShiftFormComponent } from "./workshifts/work-shift-form/work-shift-form.component";
import { TimeLogsComponent } from "./time-logs/time-logs.component";
import { TimeLogFormComponent } from "./time-logs/time-log-form/time-log-form.component";
import { TimesheetsComponent } from "./timesheets/timesheets.component";
import { TimesheetFormComponent } from "./timesheets/timesheet-form/timesheet-form.component";
import { TimesheetDetailsComponent } from "./timesheets/timesheet-details/timesheet-details.component";
import { TimeOffRequestTypesComponent } from "./time-off-request-types/time-off-request-types.component";
import { TimeOffRequestsComponent } from "./time-off-requests/time-off-requests.component";
import { TimeOffRequestTypeFormComponent } from "./time-off-request-types/time-off-request-type-form/time-off-request-type-form.component";
import { TimeOffRequestFormComponent } from "./time-off-requests/time-off-request-form/time-off-request-form.component";

@NgModule({
  declarations: [
    WorkShiftsComponent,
    WorkShiftFormComponent,
    TimeLogsComponent,
    TimeLogFormComponent,
    TimesheetsComponent,
    TimesheetFormComponent,
    TimesheetDetailsComponent,
    TimeOffRequestTypesComponent,
    TimeOffRequestTypeFormComponent,
    TimeOffRequestsComponent,
    TimeOffRequestFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    SharedModule,
    HordeflowkitModule,
    TimeManagementRoutingModule
  ]
})
export class TimeManagementModule {}
