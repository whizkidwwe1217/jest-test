import { Component, forwardRef } from "@angular/core";
import { Validators } from "@angular/forms";
import { PersonPipe } from "src/app/shared/pipes/person.pipe";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "app-time-off-request-approver-form",
  templateUrl: "./time-off-request-approver-form.component.html",
  styleUrls: ["./time-off-request-approver-form.component.scss"],
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => TimeOffRequestApproverFormComponent)
    }
  ]
})
export class TimeOffRequestApproverFormComponent extends DatagridEditor {
  buildFormControls() {
    return {
      requesterId: [null, Validators.required],
      approverId: [null, Validators.required],
      level: 1,
      requirement: "Required"
    };
  }

  getEmployeeLookupText = value => {
    return new PersonPipe().transform(value);
  };
}
