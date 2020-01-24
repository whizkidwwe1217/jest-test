import { Component, OnInit, Input, forwardRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatagridEditorAccountService, DatagridEditor } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
  selector: "app-position-form",
  templateUrl: "./position-form.component.html",
  styleUrls: ["./position-form.component.scss"],
  providers: [
    {
      provide: DatagridEditorAccountService,
      useExisting: forwardRef(() => SmartAuthService)
    },
    {
      provide: DatagridEditor,
      useExisting: forwardRef(() => PositionFormComponent)
    }
  ]
})
export class PositionFormComponent extends DatagridEditor {
  buildFormControls() {
    return {
      code: ["", Validators.required],
      name: ["", Validators.required],
      description: null
    };
  }
}
