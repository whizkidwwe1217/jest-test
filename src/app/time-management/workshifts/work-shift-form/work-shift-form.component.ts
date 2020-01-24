import { Component, OnInit, Input, forwardRef } from "@angular/core";
import { Validators } from "@angular/forms";
import { TypedFields } from "hordeflow-common";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "app-work-shift-form",
  templateUrl: "./work-shift-form.component.html",
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => WorkShiftFormComponent)
    }
  ]
})
export class WorkShiftFormComponent extends DatagridEditor {
  buildFormControls() {
    return {
      name: ["", Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      isFlexiTime: false
    };
  }

  getTypedFields(): TypedFields[] {
    return [
      { name: "startTime", type: "time" },
      { name: "endTime", type: "time" }
    ];
  }
}
