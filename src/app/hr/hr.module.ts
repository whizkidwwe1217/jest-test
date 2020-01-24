import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EmployeesComponent } from "./employees/employees.component";
import { HrRoutingModule } from "./hr.routing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EmployeeFormComponent } from "./employees/employee-form/employee-form.component";
import { DepartmentsComponent } from "./departments/departments.component";
import { TeamsComponent } from "./teams/teams.component";
import { PositionsComponent } from "./positions/positions.component";
import { DepartmentFormComponent } from "./departments/department-form/department-form.component";
import { PositionFormComponent } from "./positions/position-form/position-form.component";
import { TeamFormComponent } from "./teams/team-form/team-form.component";
import { EmployeeDetailComponent } from "./employees/employee-detail/employee-detail.component";
import { KeyValuePairComponent } from "./employees/employee-detail/key-value-pair.component";
import { SharedModule } from "../shared/shared.module";
import { HordeflowkitModule } from "hordeflowkit";
import { ClarityModule } from "@clr/angular";
import { WINDOW_PROVIDERS } from "../shared/components/windowRef";
import { EmployeePayItemFormComponent } from "./employees/employee-pay-item-form/employee-pay-item-form";
import { RichEditorModule } from "../shared/components/rich-editor";
import { EmployeePersonalInfoComponent } from "./employees/employee-detail/personal-info/employee-personal-info.component";
import { EmployeeJobDetailsComponent } from "./employees/employee-detail/job-details/employee-job-details.component";
import { EmployeeTimesheetComponent } from "./employees/employee-detail/timesheet/employee-timesheet.component";
import { TimeOffRequestApproversComponent } from "./time-off-request-approvers/time-off-request-approvers.component";
import { TimeOffRequestApproverFormComponent } from "./time-off-request-approvers/time-off-request-approver-form/time-off-request-approver-form.component";
import { JobHistoryComponent } from "./employees/employee-detail/job-history/job-history.component";
import { JobHistoryFormComponent } from "./employees/employee-detail/job-history/job-history-form.component";
import { SkillsComponent } from "./employees/employee-detail/skills/skills.component";
import { LeaveBalancesComponent } from "./employees/employee-detail/timesheet/leave-balances/leave-balances.component";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ClarityModule,
    SharedModule,
    HordeflowkitModule,
    HrRoutingModule,
    RichEditorModule
  ],
  declarations: [
    EmployeesComponent,
    EmployeeFormComponent,
    DepartmentsComponent,
    DepartmentFormComponent,
    TeamsComponent,
    TeamFormComponent,
    PositionsComponent,
    PositionFormComponent,
    EmployeeDetailComponent,
    EmployeePayItemFormComponent,
    EmployeePersonalInfoComponent,
    EmployeeJobDetailsComponent,
    EmployeeTimesheetComponent,
    KeyValuePairComponent,
    TimeOffRequestApproversComponent,
    TimeOffRequestApproverFormComponent,
    JobHistoryComponent,
    JobHistoryFormComponent,
    SkillsComponent,
    LeaveBalancesComponent
  ],
  providers: [WINDOW_PROVIDERS]
})
export class HrModule {}
