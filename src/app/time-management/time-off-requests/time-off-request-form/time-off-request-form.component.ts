import { Component, forwardRef } from "@angular/core";
import { Validators } from "@angular/forms";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { TypedFields } from "hordeflow-common";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "app-time-off-request-form",
  templateUrl: "./time-off-request-form.component.html",
  styleUrls: ["./time-off-request-form.component.scss"],
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => TimeOffRequestFormComponent)
    }
  ]
})
export class TimeOffRequestFormComponent extends DatagridEditor {
  buildFormControls() {
    return {
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      employeeId: [null, Validators.required],
      timeOffRequestTypeId: [null, Validators.required],
      reason: "",
      notes: ""
    };
  }

  getTypedFields(): TypedFields[] {
    return [
      { name: "startDate", type: "date" },
      { name: "endDate", type: "date" }
    ];
  }
}
