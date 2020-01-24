import { Component, forwardRef } from "@angular/core";
import { Validators } from "@angular/forms";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "hrf-time-off-request-type-form",
  templateUrl: "time-off-request-type-form.component.html",
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => TimeOffRequestTypeFormComponent)
    }
  ]
})
export class TimeOffRequestTypeFormComponent extends DatagridEditor {
  buildFormControls() {
    return {
      code: [null, Validators.required],
      name: [null, Validators.required]
    };
  }
}
